import {Map as YMap, Array as YArray} from "yjs";
import RhineVar, {RHINE_VAR_KEYS} from "@/app/core/var/RhineVar";
import WebsocketRhineConnector from "@/app/core/connector/WebsocketRhineConnector";
import {
  nativeGet,
  nativeSet,
  isObjectOrArray,
  isYMapOrYArray,
  jsonToNative,
  nativeDelete
} from "@/app/core/utils/NativeDataUtils";
import {convertArrayProperty} from "@/app/core/utils/ConvertProperty";

const ENABLE_LOG = true

export function log(...items: any[]) {
  if (ENABLE_LOG) {
    console.log('%cRhineVar', 'color: #b6ff00', ...items)
  }
}

export enum ChangeType {
  Add = 'add',
  Update = 'update',
  Delete = 'delete',
}

export type Native = YMap<any> | YArray<any>

type RecursiveCrossRhineVar<T> = {
  [K in keyof T]: T[K] extends object ? RecursiveCrossRhineVar<T[K]> & RhineVar : T[K]
}

type ProxiedRhineVar<T> = T & RecursiveCrossRhineVar<T> & RhineVar


export function rhineProxy<T extends object>(data: T, connector: WebsocketRhineConnector | null = null) {
  let target = jsonToNative(data)
  
  if (connector) {
    target = connector.bind(target, false)
  }
  
  return rhineProxyNative<T>(target) as ProxiedRhineVar<T>
}


export function rhineProxyNative<T extends object>(target: Native) {
  // log('rhineProxyNative', target)
  const object = new RhineVar(target) as ProxiedRhineVar<T>
  
  target.forEach((value, keyString) => {
    let key = keyString as keyof T
    if (isYMapOrYArray(value)) {
      Reflect.set(object, key, rhineProxyNative<T>(value))
    }
  })
  
  const handler: ProxyHandler<RhineVar> = {
    get(object, p, receiver) {
      if (RHINE_VAR_KEYS.has(p)) return Reflect.get(object, p, receiver)
      log('Proxy.handler.get:', p, object, receiver)
      
      if (p in object) return Reflect.get(object, p, receiver)
      
      let result = nativeGet(target, p)
      if (result) return result
      
      if (target instanceof YArray) {
        if (typeof p === 'string') {
          const f = convertArrayProperty(target, p, object)
          if (f) return f
        }
      }
      return undefined
    },
    
    set(object, p, value, receiver): boolean {
      if (RHINE_VAR_KEYS.has(p)) return Reflect.set(object, p, value, receiver)
      log('Proxy.handler.set:', p, 'to', value, '\n', object, receiver)
      
      value = ensureRhineVar(value)
      
      let result = false
      if (isObjectOrArray(value)) {
        result = nativeSet(target, p, value.native)
      } else {
        result = nativeSet(target, p, value)
      }
      if (!result) console.error('Failed to set value')
      return result
    },
    
    deleteProperty(object: RhineVar, p: string | symbol): boolean {
      if (RHINE_VAR_KEYS.has(p)) return false
      log('Proxy.handler.deleteProperty:', p)
      
      let result = nativeDelete(target, p)
      if (!result) console.error('Failed to delete value')
      return result
    }
  }
  
  if (target instanceof YMap) {
    target.observe((event, transaction) => {
      event.changes.keys.forEach(({action, oldValue}, key) => {
        
        let value = target.get(key)
        if (action === 'add' || action === 'update') {
          if (isObjectOrArray(value)) {
            Reflect.set(object, key, rhineProxy(value))
          }
        } else if (action === 'delete') {
          Reflect.deleteProperty(object, key)
        }
        
        log(`Proxy.event: Map ${action} ${key}: ${oldValue} -> ${target.get(key)}`)
        object.emit(target.get(key), key, oldValue, action as ChangeType, event, transaction)
      })
    })
  } else {
    target.observe((event, transaction) => {
      log(`Proxy.event: Array changed.`, event, transaction)
      const {added, deleted, delta} = event.changes
      object.emit(delta, '', undefined, ChangeType.Update, event, transaction)
    })
  }
  
  return new Proxy(object, handler) as ProxiedRhineVar<T>
}

export function ensureRhineVar<T>(value: T | ProxiedRhineVar<T>): ProxiedRhineVar<T> | any {
  if (isObjectOrArray(value)) {
    if (!(value instanceof RhineVar)) {
      return rhineProxy(value as object)
    }
  }
  return value
}

