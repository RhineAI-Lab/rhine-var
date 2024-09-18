import {Array as YArray, Map as YMap} from "yjs";
import WebsocketRhineConnector, {websocketRhineConnect} from "@/core/connector/WebsocketRhineConnector";
import RhineVarItem, {RHINE_VAR_PREDEFINED_PROPERTIES} from "@/core/proxy/RhineVarItem";
import {ensureNative, ensureRhineVar, isObjectOrArray} from "@/core/utils/DataUtils";
import {log} from "@/core/utils/Logger";
import {convertArrayProperty} from "@/core/utils/ConvertProperty";
import {ProxiedRhineVar, ProxiedRhineVarItem} from "@/core/proxy/ProxiedRhineVar";
import {Native} from "@/core/native/Native";
import {
  isNative,
  jsonToNative,
  nativeDelete,
  nativeGet,
  nativeHas,
  nativeOwnKeys,
  nativeSet
} from "@/core/native/NativeUtils";
import RhineVar from "@/core/proxy/RhineVar";


export const PROTOCOL_LIST = ['ws://', "wss://"]
export const DEFAULT_PROTOCOL_LIST = PROTOCOL_LIST[0]


export function rhineProxy<T extends object>(
  data: T | Native,
  connector: WebsocketRhineConnector | string,
  overwrite: boolean | number = false
): ProxiedRhineVar<T> {
  let target: Native = ensureNative<T>(data)
  
  if (connector) {
    if (typeof connector === 'string') {
      if (PROTOCOL_LIST.every(protocol => !(connector as string).startsWith(protocol))) {
        connector = DEFAULT_PROTOCOL_LIST + connector
      }
      connector = websocketRhineConnect(connector)
    }
    target = connector.bind(target, Boolean(overwrite))
  }
  connector = connector as WebsocketRhineConnector
  
  const object = rhineProxyItem<T>(target) as ProxiedRhineVar<T>
  object.connector = connector
  
  if (connector && !connector.synced) {
    connector.addSyncedListener((synced: boolean) => {
      
      if (synced) {
        let syncedValue = target.clone()
        if (!overwrite && connector.yBaseMap.has(WebsocketRhineConnector.STATE_KEY)) {
          syncedValue = connector.yBaseMap.get(WebsocketRhineConnector.STATE_KEY) as YMap<any>
          object.native.forEach((value: any, key: string | number) => {
            Reflect.deleteProperty(object.origin, key)
          })
          object.unobserve()
          object.native = syncedValue
          object.observe()
          log('Proxy.synced: Update synced native')
          syncedValue.forEach((value: any, key: string) => {
            if (isNative(value)) {
              Reflect.set(object.origin, key, rhineProxyItem(value, object))
            }
          })
        } else {
          connector.yBaseMap.set(WebsocketRhineConnector.STATE_KEY, syncedValue)
        }
      }
      
    })
  }

  return object
}


export function rhineItem<T>(data: T): ProxiedRhineVarItem<T> {
  return data as ProxiedRhineVarItem<T>
}


export function rhineProxyItem<T extends object>(
  data: T | Native,
  parent: RhineVar<any> | RhineVarItem<any> | null = null
): ProxiedRhineVarItem<T> | ProxiedRhineVar<T> {
  let target = ensureNative<T>(data)
  
  // log('rhineProxyNative', target)
  const object = parent ? new RhineVarItem<T>(target, parent) : new RhineVar<T>(target)
  
  object.native.forEach((value, keyString) => {
    let key = keyString as keyof T
    if (isNative(value)) {
      Reflect.set(object, key, rhineProxyItem<T>(value, object))
    }
  })
  
  const handler: ProxyHandler<RhineVarItem<T>> = {
    get(proxy, p, receiver) {
      if (RHINE_VAR_PREDEFINED_PROPERTIES.has(p)) return Reflect.get(object, p, receiver)
      log('Proxy.handler.get:', p, '\n', object, receiver)
      
      if (p in object) return Reflect.get(object, p, receiver)
      
      let result = nativeGet(object.native, p)
      if (result !== undefined) return result
      
      if (object.native instanceof YArray) {
        if (typeof p === 'string') {
          const f = convertArrayProperty<T>(p, object.native, object)
          if (f) return f
        }
      }
      return undefined
    },
    
    set(proxy, p, value, receiver): boolean {
      if (RHINE_VAR_PREDEFINED_PROPERTIES.has(p)) return Reflect.set(object, p, value, receiver)
      log('Proxy.handler.set:', p, 'to', value, '\n', object, receiver)
      
      value = ensureRhineVar(value, object)
      
      let result = false
      if (isObjectOrArray(value)) {
        result = nativeSet(object.native, p, value.native)
      } else {
        result = nativeSet(object.native, p, value)
      }
      if (!result) console.error('Failed to set value')
      return result
    },
    
    deleteProperty(proxy: RhineVarItem<T>, p: string | symbol): boolean {
      if (RHINE_VAR_PREDEFINED_PROPERTIES.has(p)) return false
      log('Proxy.handler.deleteProperty:', p)
      
      let result = nativeDelete(object.native, p)
      if (!result) console.error('Failed to delete value')
      return result
    },
    
    has(proxy: RhineVarItem<T>, p: string | symbol): boolean {
      if (RHINE_VAR_PREDEFINED_PROPERTIES.has(p)) return false
      return nativeHas(object.native, p)
    },
    
    ownKeys(proxy: RhineVarItem<T>): string[] {
      return nativeOwnKeys(object.native)
    },
  }
  
  object.observe()
  
  return new Proxy(object, handler) as ProxiedRhineVarItem<T>
}

