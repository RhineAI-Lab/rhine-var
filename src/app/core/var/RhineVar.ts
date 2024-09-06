import {Array as YArray, Map as YMap, Transaction, YArrayEvent, YMapEvent} from "yjs";
import {ChangeType} from "@/app/core/Proxy";
import {start} from "node:repl";


type Callback = (value: any, key: string, oldValue: any, type: ChangeType, nativeEvent: YMapEvent<any> | YArrayEvent<any>, nativeTransaction: Transaction) => void


export default class RhineVar {
  
  constructor(
    public readonly native: YMap<any> | YArray<any>
  ) {}
  
  public json() {
    return this.native.toJSON()
  }
  
  private listeners: Callback[] = []
  subscribe(callback: Callback): () => void {
    this.listeners.push(callback)
    return () => this.unsubscribe(callback)
  }
  unsubscribe(callback: Callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback)
  }
  
  private keyListeners: Map<string, Callback[]> = new Map()
  subscribeKey(key: string, callback: Callback): () => void {
    if (!this.keyListeners.has(key)) {
      this.keyListeners.set(key, [])
    }
    this.keyListeners.get(key)!.push(callback)
    return () => this.unsubscribeKey(callback)
  }
  unsubscribeKey(callback: Callback) {
    this.keyListeners.forEach((listeners, key) => {
      this.keyListeners.set(key, listeners.filter(listener => listener !== callback))
    })
  }
  
  emit(value: any, key: string, oldValue: any, type: ChangeType, nativeEvent: YMapEvent<any> | YArrayEvent<any>, nativeTransaction: Transaction) {
    this.listeners.forEach(listener => listener(value, key, oldValue, type, nativeEvent, nativeTransaction))
    if (this.keyListeners.has(key)) {
      this.keyListeners.get(key)!.forEach(listener => listener(value, key, oldValue, type, nativeEvent, nativeTransaction))
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
])

