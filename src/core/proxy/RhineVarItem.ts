import {Array as YArray, Map as YMap, Transaction, YArrayEvent, YMapEvent} from "yjs";
import {rhineProxyItem} from "@/core/proxy/Proxy";
import {log} from "@/utils/logger";
import {ensureNative, isObjectOrArray} from "@/core/utils/DataUtils";
import {Native, YPath} from "@/core/native/Native";
import {ChangeType} from "@/core/event/ChangeType";
import {Callback, DeepCallback, SyncedCallback} from "@/core/event/Callback";
import {StoredRhineVarItem} from "@/core/proxy/ProxiedRhineVar";
import RhineVar from "@/core/proxy/RhineVar";
import WebsocketConnector from "@/core/connector/WebsocketConnector";
import {isNative} from "@/core/native/NativeUtils";


export default class RhineVarItem<T> {

  public defaultValue: T
  public native: Native | null = null

  public origin: StoredRhineVarItem<T> = this as any

  public parent: RhineVar<any> | RhineVarItem<any> | null

  constructor(
    defaultValue?: T | Native,
    parent?: RhineVar<any> | RhineVarItem<any>,
  ) {
    this.parent = parent ?? null

    if (isNative(defaultValue)) {
      this.defaultValue = (defaultValue as Native).toJSON() as T
    } else {
      this.defaultValue = defaultValue as T
    }

    if (this.parent?.synced()) {
      this.native = ensureNative(defaultValue)
    }

  }
  
  isRoot(): boolean {
    return false
  }
  
  root(): RhineVar<any> {
    return this.parent!.root()
  }
  
  getConnector(): WebsocketConnector | null {
    return this.root().connector
  }

  synced(): boolean {
    return Boolean(this.getConnector()?.synced)
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
    if (this.synced() && this.native) {
      return this.native.toJSON() as T
    } else {
      return this.defaultValue
    }
  }
  
  frozenJson(): T {
    const origin = this.origin as any
    if (this.native instanceof YMap) {
      const result: { [key: string | number]: any} = {}
      for (let key in origin) {
        if (
          !RHINE_VAR_PREDEFINED_PROPERTIES.has(key) &&
          typeof origin[key] !== 'function' &&
          this.hasOwnProperty(key)
        ) {
          let value = origin[key]
          if (value instanceof RhineVarItem) {
            value = value.frozenJson()
          }
          if (!isNaN(Number(key))) {
            result[Number(key)] = value
          } else {
            result[key] = value
          }
        }
      }
      return result as T
    } else if (this.native instanceof YArray) {
      const result: any[] = []
      for (let i = 0;; i++) {
        if (i in origin) {
          let value = origin[i]
          if (value instanceof RhineVarItem) {
            value = value.frozenJson()
          }
          result.push(value)
        } else {
          break
        }
      }
      return result as T
    }
    return {} as T
  }
  
  string(indent = 2) {
    return JSON.stringify(this.json(), null, indent)
  }
  
  private syncedSubscribers: SyncedCallback[] = []
  subscribeSynced(callback: SyncedCallback) {
    this.syncedSubscribers.push(callback)
    return () => this.unsubscribeSynced(callback)
  }
  unsubscribeSynced(callback: SyncedCallback) {
    this.syncedSubscribers = this.syncedSubscribers.filter(subscriber => subscriber !== callback)
  }
  unsubscribeAllSynced() {
    this.syncedSubscribers = []
  }
  
  private emitSynced(synced: boolean) {
    this.syncedSubscribers.forEach(subscriber => subscriber(synced))
  }
  
  
  private subscribers: Callback<T>[] = []
  subscribe(callback: Callback<T>): () => void {
    this.subscribers.push(callback)
    return () => this.unsubscribe(callback)
  }
  unsubscribe(callback: Callback<T>) {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback)
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
    this.keySubscribers.forEach((subscribers, key) => {
      this.keySubscribers.set(key, subscribers.filter(subscriber => subscriber !== callback))
    })
  }
  unsubscribeAllKey() {
    this.keySubscribers = new Map()
  }
  
  private emit(key: keyof T, value: T[keyof T], oldValue: T[keyof T], type: ChangeType, nativeEvent: YMapEvent<any> | YArrayEvent<any>, nativeTransaction: Transaction) {
    this.subscribers.forEach(subscriber => subscriber(key, value, oldValue, type, nativeEvent, nativeTransaction))
    if (this.keySubscribers.has(key)) {
      this.keySubscribers.get(key)!.forEach(subscriber => subscriber(key, value, oldValue, type, nativeEvent, nativeTransaction))
    }
  }
  
  
  private deepSubscribers: DeepCallback<T>[] = []
  subscribeDeep(callback: DeepCallback<T>): () => void {
    this.deepSubscribers.push(callback)
    return () => this.unsubscribeDeep(callback)
  }
  unsubscribeDeep(callback: DeepCallback<T>) {
    this.deepSubscribers = this.deepSubscribers.filter(subscriber => subscriber !== callback)
  }
  unsubscribeAllDeep() {
    this.deepSubscribers = []
  }
  
  emitDeep(path: YPath, value: any, oldValue: any, type: ChangeType, nativeEvent: YMapEvent<any> | YArrayEvent<any>, nativeTransaction: Transaction) {
    this.deepSubscribers.forEach(subscriber => subscriber(path, value, oldValue, type, nativeEvent, nativeTransaction))
    // console.log('emitDeep', path, value)
    if (!parent) return undefined
    for (let key in this.parent) {
      if (RHINE_VAR_PREDEFINED_PROPERTIES.has(key)) continue;
      if (Reflect.get(this.parent, key)?.origin === this) {
        if (!isNaN(Number(key))) {
          key = Number(key) as any
        }
        this.parent.emitDeep([key, ...path], value, oldValue, type, nativeEvent, nativeTransaction)
      }
    }
  }

  private observer = (event: YMapEvent<any> | YArrayEvent<any>, transaction: Transaction) => {}
  private syncedObserver: SyncedCallback = (synced: boolean) => {}

  private firstSynced() {

  }

  private observe() {
    // TODO: Split sync observe and target observe
    const connector = this.getConnector()
    if (connector) {
      this.syncedObserver = (synced: boolean) => {
        this.emitSynced(synced)
      }
      connector.subscribeSynced(this.syncedObserver)
      this.emitSynced(connector.synced)
    }

    // const target = this.native
    // if (target instanceof YMap) {
    //   this.observer = (event, transaction) => {
    //     event.changes.keys.forEach(({action, oldValue}, key) => {
    //       if (isObjectOrArray(oldValue)) {
    //         oldValue = Reflect.get(this, key)
    //         if (oldValue instanceof RhineVarItem) {
    //           oldValue = oldValue.frozenJson()
    //         }
    //       }
    //
    //       let value = undefined
    //       if (action === 'add' || action === 'update') {
    //         value = target.get(key)
    //         if (isObjectOrArray(value)) {
    //           Reflect.set(this.origin, key, rhineProxyItem(value, this))
    //         } else {
    //           Reflect.set(this.origin, key, value)
    //         }
    //       } else if (action === 'delete') {
    //         Reflect.deleteProperty(this.origin, key)
    //       }
    //
    //       const newValue = key in this ? Reflect.get(this, key) : value
    //       log('Proxy.event: Map', action, key + ':', oldValue, '->', newValue)
    //       this.emit(key as keyof T, newValue, oldValue, action as ChangeType, event, transaction)
    //       this.emitDeep([key], newValue, oldValue, action as ChangeType, event, transaction)
    //     })
    //   }
    // } else if (target instanceof YArray){
    //   this.observer = (event, transaction) => {
    //     let i = -1
    //     event.delta.forEach(deltaItem => {
    //       if (deltaItem.retain !== undefined) {
    //         i += deltaItem.retain
    //       }
    //       if (deltaItem.delete !== undefined) {
    //         for (let j = 0; j < deltaItem.delete; j++) {
    //           i++
    //           let oldValue = i in this ? Reflect.get(this, i) : target.get(i)
    //           if (oldValue instanceof RhineVarItem) {
    //             oldValue = oldValue.frozenJson()
    //           }
    //
    //           Reflect.deleteProperty(this.origin, i)
    //           for (let k = i + 1; k < target.length + deltaItem.delete; k++) {
    //             const value = Reflect.get(this, k)
    //             Reflect.set(this.origin, k - 1, value)
    //             Reflect.deleteProperty(this.origin, k)
    //           }
    //
    //           log('Proxy.event: Array delete', i + ':', oldValue, '->', undefined)
    //           this.emit(i as keyof T, undefined as any, oldValue as any, ChangeType.Delete, event, transaction)
    //           this.emitDeep([i], undefined, oldValue, ChangeType.Delete, event, transaction)
    //         }
    //       }
    //       if (deltaItem.insert !== undefined && Array.isArray(deltaItem.insert)) {
    //         deltaItem.insert.forEach((value) => {
    //           i++
    //
    //           for (let k = target.length - 1; k >= i; k--) {
    //             const existingValue = Reflect.get(this, k)
    //             Reflect.set(this.origin, k + 1, existingValue)
    //           }
    //           if (isObjectOrArray(value)) {
    //             Reflect.set(this.origin, i, rhineProxyItem(value, this))
    //           } else {
    //             Reflect.set(this.origin, i, value)
    //           }
    //
    //           const newValue = i in this ? Reflect.get(this, i) : target.get(i)
    //           log('Proxy.event: Array add', i, ':', undefined, '->', newValue)
    //           this.emit(i as keyof T, newValue as any, undefined as any, ChangeType.Add, event, transaction)
    //           this.emitDeep([i], newValue, undefined, ChangeType.Add, event, transaction)
    //         })
    //       }
    //     })
    //   }
    // }
    //
    // if (this.observer) {
    //   target.observe(this.observer)
    // }
  }
  
  private unobserve() {
    if (this.observer && this.native) {
      this.native.unobserve(this.observer)
    }
    if (this.syncedObserver) {
      this.getConnector()?.unsubscribeSynced(this.syncedObserver)
    }
  }
}


export const RHINE_VAR_PREDEFINED_PROPERTIES = new Set<string | symbol>([
  'origin',
  'defaultValue',
  'native',
  'connector',
  'json',
  'string',
  'parent',
  'isRoot',
  'synced',
  'root',
  'getConnector',
  
  'afterSynced',
  'waitSynced',
  
  'syncedSubscribers',
  'subscribeSynced',
  'unsubscribeSynced',
  'unsubscribeAllSynced',
  
  'subscribers',
  'subscribe',
  'unsubscribe',
  'unsubscribeAll',
  
  'keySubscribers',
  'subscribeKey',
  'unsubscribeKey',
  'unsubscribeAllKey',
  
  'deepSubscribers',
  'subscribeDeep',
  'unsubscribeDeep',
  'unsubscribeAllDeep',
  
  'emitSynced',
  'emit',
  'emitDeep',
  
  'observer',
  'syncedObserver',
  'observe',
  'unobserve',
])
