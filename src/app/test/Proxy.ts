import {Map as YMap, Array as YArray, Doc as YDoc, YMapEvent, Transaction} from "yjs";
import {Simulate} from "react-dom/test-utils";
import RhineVar from "@/app/test/RhineVar";

const ENABLE_LOG = true


export enum ChangeType {
  Add = 'add',
  Update = 'update',
  Delete = 'delete',
}

type RecursiveCrossRhineVar<T> = {
  [K in keyof T]: T[K] extends object ? RecursiveCrossRhineVar<T[K]> & RhineVar : T[K]
}

type ProxiedRhineVar<T> = T & RecursiveCrossRhineVar<T> & RhineVar


export function rhineProxy<T extends object>(target: YMap<any>) {
  
  const handler: ProxyHandler<RhineVar> = {
    
    get(object, p, receiver) {
      if (p in RhineVar) return Reflect.get(object, p, receiver)
      ENABLE_LOG && console.log('RhineVar Proxy.handler.get:', p, object, receiver)
      if (p in object) return Reflect.get(object, p, receiver)
      if (typeof p !== 'string') return undefined
      return target.get(p)
    },
    
    set(object, p, newValue, receiver) {
      if (p in RhineVar) return Reflect.set(object, p, newValue, receiver)
      ENABLE_LOG && console.log('RhineVar Proxy.handler.set:', p, object, newValue, receiver)
      if (p in object) return Reflect.set(object, p, newValue, receiver)
      if (typeof p !== 'string') return false
      target.set(p, newValue)
      return true
    },
    
  }
  
  const object = new RhineVar(target) as ProxiedRhineVar<T>
  
  if (target instanceof YMap) {
    target.forEach((value, keyString) => {
      let key = keyString as keyof T
      if (value instanceof YMap) {
        object[key] = rhineProxy(value as any) as any
      }
    })
  }
  
  target.observe((event, transaction) => {
    event.changes.keys.forEach(({action, oldValue}, key) => {
      ENABLE_LOG && console.log(`RhineVar Proxy.event ${action} ${key}: ${oldValue} -> ${target.get(key)}"`)
      object.emit(target.get(key), key, oldValue, action as ChangeType, event, transaction)
    })
  })
  
  return new Proxy(object, handler) as ProxiedRhineVar<T>
}

