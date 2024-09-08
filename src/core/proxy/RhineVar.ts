import {Array as YArray, Map as YMap, Transaction, YArrayEvent, YMapEvent} from "yjs";
import {rhineProxyNative} from "@/core/proxy/Proxy";
import WebsocketRhineConnector from "@/core/connector/WebsocketRhineConnector";
import {log} from "@/core/utils/Logger";
import {isObjectOrArray} from "@/core/utils/DataUtils";
import {Native} from "@/core/native/Native";
import {ChangeType} from "@/core/event/ChangeType";
import {Callback} from "@/core/event/Callback";


export default class RhineVar<T> {
  
  constructor(
    public native: Native
  ) {}
  
  connector: WebsocketRhineConnector | null = null
  
  public json(): T {
    return this.native.toJSON() as T
  }
  
  private listeners: Callback<T>[] = []
  subscribe(callback: Callback<T>): () => void {
    this.listeners.push(callback)
    return () => this.unsubscribe(callback)
  }
  unsubscribe(callback: Callback<T>) {
    this.listeners = this.listeners.filter(listener => listener !== callback)
  }
  
  private keyListeners: Map<keyof T, Callback<T>[]> = new Map()
  subscribeKey(key: keyof T, callback: Callback<T>): () => void {
    if (!this.keyListeners.has(key)) {
      this.keyListeners.set(key, [])
    }
    this.keyListeners.get(key)!.push(callback)
    return () => this.unsubscribeKey(callback)
  }
  unsubscribeKey(callback: Callback<T>) {
    this.keyListeners.forEach((listeners, key) => {
      this.keyListeners.set(key, listeners.filter(listener => listener !== callback))
    })
  }
  
  emit(value: T[keyof T], key: keyof T, oldValue: T[keyof T], type: ChangeType, nativeEvent: YMapEvent<any> | YArrayEvent<any>, nativeTransaction: Transaction) {
    this.listeners.forEach(listener => listener(value, key, oldValue, type, nativeEvent, nativeTransaction))
    if (this.keyListeners.has(key)) {
      this.keyListeners.get(key)!.forEach(listener => listener(value, key, oldValue, type, nativeEvent, nativeTransaction))
    }
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
              Reflect.set(this, key, rhineProxyNative(value))
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
  
}

export const RHINE_VAR_KEYS = new Set<string | symbol>([
  'native',
  'json',
  'listeners',
  'subscribe',
  'unsubscribe',
  'keyListeners',
  'subscribeKey',
  'unsubscribeKey',
  'emit',
  'observer',
  'observe',
  'unobserve',
  'connector',
])

