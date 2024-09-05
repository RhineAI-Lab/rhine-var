import {Map as YMap, Array as YArray, Doc as YDoc, YMapEvent, Transaction} from "yjs";
import RhineVar from "@/app/core/var/RhineVar";
import {convertArrayProperty} from "@/app/core/utils/ConvertProperty";

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


export function r<T>(value: T) {
  return value as ProxiedRhineVar<T>
}


export function rhineProxy<T extends object>(target: YMap<any> | YArray<any>) {
  
  const handler: ProxyHandler<RhineVar> = {
    
    get(object, p, receiver) {
      if (p in RhineVar) return Reflect.get(object, p, receiver)
      ENABLE_LOG && console.log('RhineVar Proxy.handler.get:', p, object, receiver)
      if (p in object) return Reflect.get(object, p, receiver)
      if (typeof p !== 'string') return undefined
      
      if (target instanceof YMap) return target.get(p)
      
      const pn = parseInt(p)
      if (!isNaN(pn)) return target.get(pn)
      
      const f = convertArrayProperty(target, p)
      if (f) return f
      
      console.error('Unknown key on YArray')
      return undefined
    },
    
    set(object, p, newValue, receiver) {
      if (p in RhineVar) return Reflect.set(object, p, newValue, receiver)
      ENABLE_LOG && console.log('RhineVar Proxy.handler.set:', p, 'to', newValue, '\n', object, receiver)
      if (p in object) return Reflect.set(object, p, newValue, receiver)
      if (typeof p !== 'string') return false;
      if (target instanceof YMap) {
        target.set(p, newValue)
        return true
      }
      const pn = parseInt(p)
      if (target instanceof YArray && !isNaN(pn)) {
        target.delete(pn, 1)
        target.insert(pn, [newValue])
        return true
      }
      console.error('Unknown key on YArray')
      return false
    },
    
  }
  
  const object = new RhineVar(target) as ProxiedRhineVar<T>
  
  
  target.forEach((value, keyString) => {
    let key = keyString as keyof T
    if (value instanceof YMap || value instanceof YArray) {
      object[key] = rhineProxy(value as any) as any
    }
  })
  
  if (target instanceof YMap) {
    target.observe((event, transaction) => {
      event.changes.keys.forEach(({action, oldValue}, key) => {
        ENABLE_LOG && console.log(`RhineVar Proxy.event ${action} ${key}: ${oldValue} -> ${target.get(key)}"`)
        object.emit(target.get(key), key, oldValue, action as ChangeType, event, transaction)
      })
    })
  } else {
    // https://quilljs.com/docs/delta/
    target.observe((event, transaction) => {
      console.log(event, transaction)
    })
  }
  
  return new Proxy(object, handler) as ProxiedRhineVar<T>
}

