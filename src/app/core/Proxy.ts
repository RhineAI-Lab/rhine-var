import {Map as YMap, Array as YArray, Doc as YDoc, YMapEvent, Transaction} from "yjs";
import RhineVar from "@/app/core/var/RhineVar";
import {convertArrayProperty} from "@/app/core/utils/ConvertProperty";
import WebsocketRhineConnector from "@/app/core/connector/WebsocketRhineConnector";
import {forceSet, isObjectOrArray, jsonToNative} from "@/app/core/utils/NativeDataUtils";

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


export function rhineProxyNative<T>(target: YMap<any> | YArray<any>) {
  
  const object = new RhineVar(target) as ProxiedRhineVar<T>
  
  target.forEach((value, keyString) => {
    let key = keyString as keyof T
    if (value instanceof YMap || value instanceof YArray) {
      object[key] = rhineProxyNative<T>(value) as any
    }
  })
  
  
  const handler: ProxyHandler<RhineVar> = {
    
    get(object, p, receiver) {
      if (p in RhineVar) return Reflect.get(object, p, receiver)
      log('Proxy.handler.get:', p, object, receiver)
      
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
      log('Proxy.handler.set:', p, 'to', newValue, '\n', object, receiver)
      
      if (isObjectOrArray(newValue)) {
        if (!(newValue instanceof RhineVar)) {
          newValue = rhineProxy(newValue)
        }
        forceSet(target, p, newValue.native)
        return Reflect.set(object, p, newValue, receiver)
      } else {
        let result = forceSet(target, p, newValue)
        if (!result) console.error('Failed to set new value')
        return result
      }
    },
    
  }
  
  if (target instanceof YMap) {
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

