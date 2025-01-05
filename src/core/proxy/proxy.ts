import {Array as YArray, Map as YMap} from "yjs";
import WebsocketConnector, {websocketRhineConnect} from "@/core/connector/websocket-connector";
import RhineVarItem, {RHINE_VAR_PREDEFINED_PROPERTIES} from "@/core/proxy/rhine-var-item.class";
import {ensureNative, ensureRhineVar, isArray, isObject, isObjectOrArray} from "@/core/utils/data.utils";
import {log, warn} from "@/utils/logger.utils";
import {convertArrayProperty} from "@/core/utils/convert-property.utils";
import {ProxiedRhineVar, ProxiedRhineVarItem} from "@/core/proxy/proxied-rhine-var.type";
import {Native} from "@/core/native/native.type";
import {
  isNative,
  nativeDelete,
  nativeHas,
  nativeOwnKeys,
  nativeSet
} from "@/core/utils/native.utils";
import RhineVar from "@/core/proxy/rhine-var.class";


export const PROTOCOL_LIST = ['ws://', "wss://"]
export const DEFAULT_PUBLIC_URL = 'wss://rvp.rhineai.com/'


export function rhineProxy<T extends object>(
  defaultValue: T | Native,
  connector: WebsocketConnector | string | number,
  overwrite: boolean | number = false
): ProxiedRhineVar<T> {

  // Create Connector
  if (connector) {
    // Input Connector is String: Default for Websocket Connector
    if (typeof connector === 'string') {
      if (PROTOCOL_LIST.every(protocol => !(String(connector)).startsWith(protocol))) {
        connector = DEFAULT_PUBLIC_URL + connector
      }
      connector = websocketRhineConnect(String(connector))
    }
    // TODO: Bind Target
    // target = (connector as WebsocketConnector).bind(target, Boolean(overwrite))
  }
  connector = connector as WebsocketConnector

  // Create RhineVar
  const object = rhineProxyItem<T>(defaultValue) as ProxiedRhineVar<T>
  object.connector = connector

  // Manage synced
  if (connector && !connector.synced) {

    // TODO: Bind data after Synced
    // connector.subscribeSynced((synced: boolean) => {
    //   if (synced) {
    //     if (!overwrite && connector.yBaseMap.has(WebsocketConnector.STATE_KEY)) {
    //       const syncedValue = connector.yBaseMap.get(WebsocketConnector.STATE_KEY) as YMap<any>
    //       object.native.forEach((value: any, key: string | number) => {
    //         Reflect.deleteProperty(object.origin, key)
    //       })
    //       Reflect.get(object, 'unobserve').call(object)
    //       object.native = syncedValue
    //       Reflect.get(object, 'observe').call(object)
    //       log('Proxy.synced: Update synced native')
    //       syncedValue.forEach((value: any, key: string) => {
    //         if (isNative(value)) {
    //           Reflect.set(object.origin, key, rhineProxyItem(value, object))
    //         } else {
    //           Reflect.set(object.origin, key, value)
    //         }
    //       })
    //     } else {
    //       const syncedValue = ensureNative(defaultValue)
    //       connector.yBaseMap.set(WebsocketConnector.STATE_KEY, syncedValue)
    //     }
    //   }
    // })

  }

  return object
}


export function rhineProxyItem<T extends object>(
  defaultValue: T | Native,
  parent: RhineVar<any> | RhineVarItem<any> | null = null
): ProxiedRhineVarItem<T> | ProxiedRhineVar<T> {

  const object = parent ? new RhineVarItem<T>(defaultValue, parent) : new RhineVar<T>(defaultValue)

  // TODO: Support array default value
  if (object.native) {
    object.native.forEach((value, keyString) => {
      let key = keyString as keyof T
      if (isNative(value)) {
        Reflect.set(object, key, rhineProxyItem<T[keyof T] & object>(value, object))
      } else {
        Reflect.set(object, key, value)
      }
    })
  } else {
    const data = defaultValue as T
    for (const keyString in data) {
      if (data.hasOwnProperty(keyString)) {
        let key = keyString as keyof T
        const value = data[key]
        if (isObjectOrArray(value)) {
          Reflect.set(object, key, rhineProxyItem<T[keyof T] & object>(value as T[keyof T] & object, object))
        }else {
          Reflect.set(object, key, value)
        }
      }
    }
  }

  const proxyGetOwnPropertyDescriptor = (proxy: RhineVarItem<T>, p: string | symbol) => {
    log('Proxy.handler.getOwnPropertyDescriptor:', p, '  ', object)

    if (object.native) {
      // Synced

      if (p === Symbol.iterator) {
        // Support iterator like for...of
        return {
          value: function* () {
            if (object.native instanceof YMap) {
              for (const key of object.native.keys()) {
                yield Reflect.get(object, key)
              }
            } else if (object.native instanceof YArray) {
              for (let i = 0; i < object.native.length; i++) {
                yield Reflect.get(object, String(i))
              }
            }
          },
          enumerable: false,
          configurable: true,
        }
      }

    }  else {
      // Before synced
      if (p === Symbol.iterator) {
        // Special iterator
      }
    }

    return Reflect.getOwnPropertyDescriptor(object, p)
  }
  
  const handler: ProxyHandler<RhineVarItem<T>> = {
    get(proxy, p, receiver) {
      if (RHINE_VAR_PREDEFINED_PROPERTIES.has(p)) return Reflect.get(object, p, receiver)
      log('Proxy.handler.get:', p, '  ', object, receiver)
      if (p in object) return Reflect.get(object, p, receiver)
      const descriptor = proxyGetOwnPropertyDescriptor(proxy, p)
      if (descriptor !== undefined) return descriptor.value

      if (object.native) {
        if (object.native instanceof YArray) {
          if (typeof p === 'string') {
            const f = convertArrayProperty<T>(p, object.native, object)
            if (f) return f
          }
        }
        return undefined
      } else {
        return Reflect.get(object.defaultValue, p, receiver)
      }
    },
    
    set(proxy, p, value, receiver): boolean {
      if (RHINE_VAR_PREDEFINED_PROPERTIES.has(p)) return Reflect.set(object, p, value, receiver)
      log('Proxy.handler.set:', p, 'to', value, '  ', object, receiver)
      
      value = ensureRhineVar(value, object)

      if (object.native) {
        let result = nativeSet(object.native, p, value)
        if (!result) console.error('Failed to set value')
        return result
      } else {
        warn('Operate \'set\' cannot be performed before synchronization.')
        // TIP: Just warn but return true when deleteProperty before synchronization
        return true
      }
    },
    
    deleteProperty(proxy: RhineVarItem<T>, p: string | symbol): boolean {
      if (RHINE_VAR_PREDEFINED_PROPERTIES.has(p)) {
        warn('The built-in method in RhineVar cannot be deleted.')
        return false
      }
      log('Proxy.handler.deleteProperty:', p)

      if (object.native) {
        let result = nativeDelete(object.native, p)
        if (!result) console.error('Failed to delete value')
        return result
      } else {
        warn('Operate \'deleteProperty\' cannot be performed before synchronization.')
        // TIP: Just warn, but return true when deleteProperty before synchronization
        return true
      }
    },
    
    has(proxy: RhineVarItem<T>, p: string | symbol): boolean {
      if (RHINE_VAR_PREDEFINED_PROPERTIES.has(p)) return false

      if (object.native) {
        return nativeHas(object.native, p)
      } else {
        return Reflect.has(object.defaultValue, p)
      }
    },
    
    ownKeys(proxy: RhineVarItem<T>): (string | symbol)[] {
      log('Proxy.handler.ownKeys')

      if (object.native) {
        return nativeOwnKeys(object.native)
      } else {
        return Reflect.ownKeys(object.defaultValue)
      }
    },

    getPrototypeOf: (proxy: RhineVarItem<T>) => {
      log('Proxy.handler.getPrototypeOf')
      if (object.native) {
        return Reflect.getPrototypeOf(object)
      } else {
        return Reflect.getPrototypeOf(object.defaultValue)
      }
    },
    
    getOwnPropertyDescriptor: proxyGetOwnPropertyDescriptor,
  }

  Reflect.get(object, 'observe').call(object)
  
  return new Proxy(object, handler) as ProxiedRhineVarItem<T>
}

