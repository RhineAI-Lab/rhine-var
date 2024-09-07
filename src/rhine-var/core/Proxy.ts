import {Array as YArray, Map as YMap} from "yjs";
import WebsocketRhineConnector from "@/rhine-var/core/connector/WebsocketRhineConnector";
import RhineVar, {RHINE_VAR_KEYS} from "@/rhine-var/core/var/RhineVar";
import {
  isObjectOrArray,
  isYMapOrYArray,
  jsonToNative, nativeDelete,
  nativeGet,
  nativeSet
} from "@/rhine-var/core/utils/NativeDataUtils";
import {log} from "@/rhine-var/core/utils/Logger";
import {convertArrayProperty} from "@/rhine-var/core/utils/ConvertProperty";


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


export function rhineProxy<T extends object>(
  data: T,
  connector: WebsocketRhineConnector | null = null,
  overwrite: boolean = false
) {
  let target = jsonToNative(data)
  
  if (connector) {
    target = connector.bind(target, overwrite)
  }
  
  const object = rhineProxyNative<T>(target) as ProxiedRhineVar<T>
  object.connector = connector
  
  if (connector && !connector.synced) {
    connector.addSyncedListener((synced) => {
      if (!synced) return
      
      let syncedValue = target.clone()
      if (!overwrite && connector.yBaseMap.has(WebsocketRhineConnector.STATE_KEY)) {
        syncedValue = connector.yBaseMap.get(WebsocketRhineConnector.STATE_KEY) as YMap<any>
        object.native.forEach((value, key) => {
          Reflect.deleteProperty(object, key)
        })
        object.unobserve()
        object.native = syncedValue
        object.observe()
        log('Proxy.synced: Update synced native')
        syncedValue.forEach((value: any, key: string) => {
          if (isYMapOrYArray(value)) {
            Reflect.set(object, key, directPackage(rhineProxyNative(value)))
          }
        })
      } else {
        connector.yBaseMap.set(WebsocketRhineConnector.STATE_KEY, syncedValue)
      }
    })
  }

  return object
}


export function rhineProxyNative<T extends object>(target: Native) {
  // log('rhineProxyNative', target)
  const object = new RhineVar(target)
  
  object.native.forEach((value, keyString) => {
    let key = keyString as keyof T
    if (isYMapOrYArray(value)) {
      Reflect.set(object, key, rhineProxyNative<T>(value))
    }
  })
  
  const handler: ProxyHandler<RhineVar> = {
    get(proxy, p, receiver) {
      if (RHINE_VAR_KEYS.has(p)) return Reflect.get(object, p, receiver)
      log('Proxy.handler.get:', p, '\n', object, receiver)
      
      if (p in object) return Reflect.get(object, p, receiver)
      
      let result = nativeGet(object.native, p)
      if (result) return result
      
      if (object.native instanceof YArray) {
        if (typeof p === 'string') {
          const f = convertArrayProperty(object.native, p, object)
          if (f) return f
        }
      }
      return undefined
    },
    
    set(proxy, p, value, receiver): boolean {
      if (RHINE_VAR_KEYS.has(p)) return Reflect.set(object, p, value, receiver)
      if (value instanceof DirectSetPackage) return Reflect.set(object, p, value.data, receiver)
      log('Proxy.handler.set:', p, 'to', value, '\n', object, receiver)
      
      value = ensureRhineVar(value)
      
      let result = false
      if (isObjectOrArray(value)) {
        result = nativeSet(object.native, p, value.native)
      } else {
        result = nativeSet(object.native, p, value)
      }
      if (!result) console.error('Failed to set value')
      return result
    },
    
    deleteProperty(proxy: RhineVar, p: string | symbol): boolean {
      if (RHINE_VAR_KEYS.has(p)) return false
      log('Proxy.handler.deleteProperty:', p)
      
      let result = nativeDelete(object.native, p)
      if (!result) console.error('Failed to delete value')
      return result
    }
  }
  
  object.observe()
  
  return new Proxy(object, handler) as ProxiedRhineVar<T>
}

export function ensureRhineVar<T>(value: T | ProxiedRhineVar<T>): ProxiedRhineVar<T> | any {
  if (isYMapOrYArray(value)) {
    return rhineProxyNative(value)
  }
  if (isObjectOrArray(value)) {
    if (!(value instanceof RhineVar)) {
      return rhineProxy(value as object)
    }
  }
  return value
}

export class DirectSetPackage {
  constructor(
    public data: any
  ) {}
}

export function directPackage(data: any) {
  return new DirectSetPackage(data)
}

