import {Array as YArray, Map as YMap, Doc as YDoc} from "yjs";
import Connector, {websocketRhineConnect} from "@/core/connector/connector.class";
import RhineVarItem, {RHINE_VAR_PREDEFINED_PROPERTIES} from "@/core/proxy/rhine-var-item.class";
import {ensureNative, ensureRhineVar} from "@/core/utils/data.utils";
import {log} from "@/utils/logger";
import {convertArrayProperty} from "@/core/utils/convert-property.utils";
import {ProxiedRhineVar, ProxiedRhineVarItem} from "@/core/proxy/proxied-rhine-var.type";
import {Native} from "@/core/native/native.type";
import {
  isNative,
  nativeDelete,
  nativeHas,
  nativeOwnKeys,
  nativeSet
} from "@/core/native/native.utils";
import RhineVar from "@/core/proxy/rhine-var.class";
import {createConnector} from "@/core/connector/create-connector";


export const PROTOCOL_LIST = ['ws://', "wss://"]
export const DEFAULT_PUBLIC_URL = 'wss://rvp.rhineai.com/'


export function rhineProxy<T extends object>(
  defaultValue: T | Native,
  connector: Connector | string | number,
  overwrite: boolean | number = false
): ProxiedRhineVar<T> {
  // Create local temp YDoc and YMap
  let target: Native = ensureNative<T>(defaultValue)
  const tempMap = new YDoc().getMap()
  tempMap.set(Connector.STATE_KEY, target)

  // Create core proxied rhine-var object
  const object = rhineProxyItem<T>(target) as ProxiedRhineVar<T>

  // Create connector by string, number or direct
  if (typeof connector === 'string' || typeof connector === 'number') {
    connector = createConnector(connector)
  }
  connector = connector as Connector
  object.connector = connector

  // Bind connector
  connector.subscribeSynced((synced: boolean) => {
    if (overwrite) {
      connector.setState(ensureNative(object.json()))
    }
    if (!connector.hasState()) {
      connector.setState(ensureNative(object.json()))
    }
    object.initialize(connector.getState())
  })

  return object
}


export function rhineProxyItem<T extends object>(
  data: T | Native,
  parent: RhineVar<any> | RhineVarItem<any> | null = null
): ProxiedRhineVarItem<T> | ProxiedRhineVar<T> {
  let target = ensureNative<T>(data)

  const object = parent ? new RhineVarItem<T>(target, parent) : new RhineVar<T>(target)
  
  object.native.forEach((value, keyString) => {
    let key = keyString as keyof T
    if (isNative(value)) {
      Reflect.set(object, key, rhineProxyItem<T>(value, object))
    } else {
      Reflect.set(object, key, value)
    }
  })
  
  const proxyGetOwnPropertyDescriptor = (proxy: RhineVarItem<T>, p: string | symbol) => {
    log('Proxy.handler.getOwnPropertyDescriptor:', p, '  ', object)
    if (p === Symbol.iterator) {
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
    return Reflect.getOwnPropertyDescriptor(object, p)
  }
  
  const handler: ProxyHandler<RhineVarItem<T>> = {
    get(proxy, p, receiver) {
      if (RHINE_VAR_PREDEFINED_PROPERTIES.has(p)) return Reflect.get(object, p, receiver)
      log('Proxy.handler.get:', p, '  ', object, receiver)
      
      if (p in object) return Reflect.get(object, p, receiver)
      
      const descriptor = proxyGetOwnPropertyDescriptor(proxy, p)
      if (descriptor !== undefined) return descriptor.value
      
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
      log('Proxy.handler.set:', p, 'to', value, '  ', object, receiver)
      
      value = ensureRhineVar(value, object)
      
      let result = nativeSet(object.native, p, value)
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
    
    getOwnPropertyDescriptor: proxyGetOwnPropertyDescriptor,
  }
  
  Reflect.get(object, 'observe').call(object)
  
  return new Proxy(object, handler) as ProxiedRhineVarItem<T>
}

