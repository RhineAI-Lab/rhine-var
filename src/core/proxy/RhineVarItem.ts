import {Array as YArray, Map as YMap, Transaction, YArrayEvent, YMapEvent} from "yjs";
import {rhineProxyItem} from "@/core/proxy/Proxy";
import {log} from "@/core/utils/Logger";
import {isObjectOrArray} from "@/core/utils/DataUtils";
import {Native, YPath} from "@/core/native/Native";
import {ChangeType} from "@/core/event/ChangeType";
import {Callback, DeepCallback} from "@/core/event/Callback";
import {StoredRhineVarItem} from "@/core/proxy/ProxiedRhineVar";
import RhineVar from "@/core/proxy/RhineVar";
import {YEvent} from "yjs/dist/src/utils/YEvent";


export default class RhineVarItem<T> {
  
  constructor(
    public native: Native,
    public parent: RhineVar<any> | RhineVarItem<any> | null = null,
    public origin: StoredRhineVarItem<T> = this as any
  ) {}
  
  isRoot(): boolean {
    return false
  }
  
  root(): RhineVar<any> {
    return this.parent!.root()
  }
  
  
  afterSynced(callback: () => void) {
    const connector = this.root()?.connector
    if (connector) {
      connector.afterSynced(callback)
    }
  }
  
  async waitSynced() {
    return new Promise((resolve: any) => {
      this.afterSynced(resolve)
    })
  }
  
  
  json(): T {
    return this.native.toJSON() as T
  }
  
  toString() {
    return String(this.json())
  }
  
  
  private subscribers: Callback<T>[] = []
  subscribe(callback: Callback<T>): () => void {
    this.subscribers.push(callback)
    return () => this.unsubscribe(callback)
  }
  unsubscribe(callback: Callback<T>) {
    this.subscribers = this.subscribers.filter(listener => listener !== callback)
  }
  unsubscribeAll() {
    this.subscribers = []
  }
  
  private keySubscribers: Map<keyof T, Callback<T>[]> = new Map()
  subscribeKey(key: keyof T, callback: Callback<T>): () => void {
    if (!this.keySubscribers.has(key)) {
      this.keySubscribers.set(key, [])
    }
    this.keySubscribers.get(key)!.push(callback)
    return () => this.unsubscribeKey(callback)
  }
  unsubscribeKey(callback: Callback<T>) {
    this.keySubscribers.forEach((listeners, key) => {
      this.keySubscribers.set(key, listeners.filter(listener => listener !== callback))
    })
  }
  unsubscribeAllKey() {
    this.keySubscribers = new Map()
  }
  
  private emit(key: keyof T, value: T[keyof T], oldValue: T[keyof T], type: ChangeType, nativeEvent: YMapEvent<any> | YArrayEvent<any>, nativeTransaction: Transaction) {
    this.subscribers.forEach(subscriber => subscriber(key, value, oldValue, type, nativeEvent, nativeTransaction))
    if (this.keySubscribers.has(key)) {
      this.keySubscribers.get(key)!.forEach(listener => listener(key, value, oldValue, type, nativeEvent, nativeTransaction))
    }
  }
  
  
  private deepSubscribers: DeepCallback<T>[] = []
  subscribeDeep(callback: DeepCallback<T>): () => void {
    this.deepSubscribers.push(callback)
    return () => this.unsubscribeDeep(callback)
  }
  unsubscribeDeep(callback: DeepCallback<T>) {
    this.deepSubscribers = this.deepSubscribers.filter(listener => listener !== callback)
  }
  unsubscribeAllDeep() {
    this.deepSubscribers = []
  }
  
  emitDeep(path: YPath, value: any, oldValue: any, type: ChangeType, nativeTarget: Native, nativeEvent: YMapEvent<any> | YArrayEvent<any>, nativeTransaction: Transaction) {
    this.deepSubscribers.forEach(subscriber => subscriber(path, value, oldValue, type, nativeTarget, nativeEvent, nativeTransaction))
  }
  
  
  observer = (event: YMapEvent<any> | YArrayEvent<any>, transaction: Transaction) => {}
  deepObserver = (events: Array<YMapEvent<any> | YArrayEvent<any>>, transaction: Transaction) => {}
  
  // 开始观察当前Native的内容变化
  observe() {
    const target = this.native
    if (target instanceof YMap) {
      this.observer = (event, transaction) => {
        event.changes.keys.forEach(({action, oldValue}, key) => {
          log(`Proxy.event: Map ${action} ${key}: ${oldValue} -> ${target.get(key)}`)
          
          let value = target.get(key)
          if (action === 'add' || action === 'update') {
            if (isObjectOrArray(value)) {
              Reflect.set(this, key, rhineProxyItem(value, this))
            }
          } else if (action === 'delete') {
            Reflect.deleteProperty(this, key)
          }
          this.emit(key as keyof T, target.get(key), oldValue, action as ChangeType, event, transaction)
        })
      }
    } else if (target instanceof YArray){
      this.observer = (event, transaction) => {
        log(`Proxy.event: Array changed:`, event, transaction)
        this.emit('' as keyof T, event.delta as T[keyof T], undefined as T[keyof T], ChangeType.Update, event, transaction)
      }
    }
    
    this.deepObserver = (events: Array<YMapEvent<any> | YArrayEvent<any>>, transaction: Transaction) => {
      events.forEach(event => {
        if (event instanceof YMapEvent) {
          event.changes.keys.forEach(({action, oldValue}, key) => {
            const eventTarget = event.target
            const value = eventTarget.get(key)
            const path = event.path.concat(key)
            // log(`Proxy.deepEvent: Map ${action} ${eventTarget} ${path}: ${oldValue} -> ${value}`)
            this.emitDeep(path, value, oldValue, action as ChangeType, eventTarget, event, transaction)
          })
        } else if (event instanceof YArrayEvent) {
          const eventTarget = event.target
          const delta = event.delta
          const path = event.path
          log(`Proxy.deepEvent: Array changed:`, event, transaction)
          this.emitDeep(path, undefined, undefined, ChangeType.Update, eventTarget, event, transaction)
        }
      })
    }
    
    if (this.observer) {
      target.observe(this.observer)
    }
    if (this.deepObserver) {
      target.observeDeep(this.deepObserver)
    }
  }
  
  unobserve() {
    if (this.observer) {
      this.native.unobserve(this.observer)
    }
    if (this.deepObserver) {
      this.native.unobserveDeep(this.deepObserver)
    }
  }
}


export const RHINE_VAR_PREDEFINED_PROPERTIES = new Set<string | symbol>([
  'origin',
  'native',
  'connector',
  'json',
  'toString',
  'parent',
  'isRoot',
  'root',
  
  'afterSynced',
  'waitSynced',
  
  'subscribers',
  'subscribe',
  'unsubscribe',
  'unsubscribeAll',
  'keyListeners',
  'subscribeKey',
  'unsubscribeKey',
  'unsubscribeAllKey',
  'emit',
  
  'deepSubscribers',
  'subscribeDeep',
  'unsubscribeDeep',
  'unsubscribeAllDeep',
  'emitDeep',
  
  'observer',
  'observe',
  'unobserve',
  'deepObserver',
])
