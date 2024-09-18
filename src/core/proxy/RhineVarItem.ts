import {Array as YArray, Map as YMap, Transaction, YArrayEvent, YMapEvent} from "yjs";
import {rhineProxyItem} from "@/core/proxy/Proxy";
import {log} from "@/core/utils/Logger";
import {isObjectOrArray} from "@/core/utils/DataUtils";
import {Native} from "@/core/native/Native";
import {ChangeType} from "@/core/event/ChangeType";
import {Callback} from "@/core/event/Callback";
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
  
  private emit(value: T[keyof T], key: keyof T, oldValue: T[keyof T], type: ChangeType, nativeEvent: YMapEvent<any> | YArrayEvent<any>, nativeTransaction: Transaction) {
    this.subscribers.forEach(listener => listener(value, key, oldValue, type, nativeEvent, nativeTransaction))
    if (this.keySubscribers.has(key)) {
      this.keySubscribers.get(key)!.forEach(listener => listener(value, key, oldValue, type, nativeEvent, nativeTransaction))
    }
  }
  
  
  private deepSubscribers: Callback<T>[] = []
  subscribeDeep(callback: Callback<T>): () => void {
    this.deepSubscribers.push(callback)
    return () => this.unsubscribe(callback)
  }
  unsubscribeDeep(callback: Callback<T>) {
    this.deepSubscribers = this.deepSubscribers.filter(listener => listener !== callback)
  }
  unsubscribeAllDeep() {
    this.deepSubscribers = []
  }
  
  emitDeep(value: T[keyof T], key: keyof T, oldValue: T[keyof T], type: ChangeType, nativeEvent: YMapEvent<any> | YArrayEvent<any>, nativeTransaction: Transaction) {
  
  }
  
  
  observer = (event: YMapEvent<any> | YArrayEvent<any>, transaction: Transaction) => {}
  
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
          this.emit(target.get(key), key as keyof T, oldValue, action as ChangeType, event, transaction)
        })
      }
    } else if (target instanceof YArray){
      this.observer = (event, transaction) => {
        log(`Proxy.event: Array changed.`, event, transaction)
        const {added, deleted, delta} = event.changes
        this.emit(delta as T[keyof T], '' as keyof T, undefined as T[keyof T], ChangeType.Update, event, transaction)
      }
    }
    if (this.observer) {
      target.observe(this.observer)
    }
  }
  
  // 当存在观察者时 结束观察当前native的内容变化
  unobserve() {
    if (this.observer) {
      this.native.unobserve(this.observer)
    }
  }
  
  deepObserver = (event: Array<YEvent<any>>, transaction: Transaction) => {}
  
  deepObserve() {
    const target = this.native
    if (target instanceof YMap) {
    
    } else if (target instanceof YArray){
    
    }
    if (this.deepObserver) {
      target.observeDeep(this.deepObserver)
    }
  }
  
  deepUnobserve() {
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
  'deepObserve',
  'deepUnobserve',
])
