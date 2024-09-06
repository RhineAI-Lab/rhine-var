import {Map as YMap, Array as YArray} from "yjs";
import RhineVar from "@/app/core/var/RhineVar";
import WebsocketRhineConnector from "@/app/core/connector/WebsocketRhineConnector";
import {
  nativeGet,
  nativeSet,
  isObjectOrArray,
  isYMapOrYArray,
  jsonToNative,
  isYMap,
  isYArray
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
    target = connector.bind(target, true)
  }
  
  return rhineProxyNative<T>(target) as ProxiedRhineVar<T>
}


export function rhineProxyNative<T extends object>(target: Native) {
  const object = new RhineVar(target) as ProxiedRhineVar<T>
  
  target.forEach((value, keyString) => {
    let key = keyString as keyof T
    if (isYMapOrYArray(value)) {
      Reflect.set(object, key, rhineProxyNative<T>(value))
    }
  })
  
  const handler: ProxyHandler<RhineVar> = {
    get(object, p, receiver) {
      if (p in RhineVar) return Reflect.get(object, p, receiver)
      log('Proxy.handler.get:', p, object, receiver)
      
      if (p in object) return Reflect.get(object, p, receiver)
      
      let result = nativeGet(target, p)
      if (result) return result
      
      if (isYArray(target)) {
        if (typeof p === 'string') {
          const f = convertArrayProperty(target, p, object)
          if (f) return f
        }
      }
      return undefined
    },
    
    set(object, p, newValue, receiver) {
      if (p in RhineVar) return Reflect.set(object, p, newValue, receiver)
      log('Proxy.handler.set:', p, 'to', newValue, '\n', object, receiver)
      
      newValue = ensureRhineVar(newValue)
      if (isObjectOrArray(newValue)) {
        nativeSet(target, p, newValue.native)
        return Reflect.set(object, p, newValue, receiver)
      } else {
        let result = nativeSet(target, p, newValue)
        if (!result) console.error('Failed to set new value')
        return result
      }
    },
  }
  
  if (isYMap(target)) {
    target.observe((event, transaction) => {
      event.changes.keys.forEach(({action, oldValue}, key) => {
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

