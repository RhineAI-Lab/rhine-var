import {Array as YArray, Map as YMap, YMapEvent} from "yjs";
import WebsocketRhineConnector, {websocketRhineConnect} from "@/core/connector/WebsocketRhineConnector";
import RhineVar, {RHINE_VAR_KEYS} from "@/core/proxy/RhineVar";
import {ensureRhineVar, isObjectOrArray} from "@/core/utils/DataUtils";
import {log} from "@/core/utils/Logger";
import {convertArrayProperty} from "@/core/utils/ConvertProperty";
import {ProxiedRhineVar} from "@/core/proxy/ProxiedRhineVar";
import {Native} from "@/core/native/Native";
import {isNative, jsonToNative, nativeDelete, nativeGet, nativeSet} from "@/core/native/NativeUtils";
import {directKey, isDirectKey, originKey} from "@/core/proxy/DirectKey";
import {ChangeType} from "@/core/event/ChangeType";


export function rhineProxy<T extends object>(
  data: T,
  connector: WebsocketRhineConnector | string | null = null,
  overwrite: boolean = false
): ProxiedRhineVar<T> {
  let target = jsonToNative(data)
  
  if (connector) {
    if (typeof connector === 'string') {
      if (!connector.startsWith('ws://') && !connector.startsWith('wss://')) {
        connector = 'wss://' + connector
      }
      connector = websocketRhineConnect(connector)
    }
    target = connector.bind(target, overwrite)
  }
  connector = connector as WebsocketRhineConnector | null
  
  const object = rhineProxyNative<T>(target) as ProxiedRhineVar<T>
  object.connector = connector
  
  if (connector && !connector.synced) {
    connector.addSyncedListener((synced: boolean) => {
      
      if (synced) {
        let syncedValue = target.clone()
        if (!overwrite && connector.yBaseMap.has(WebsocketRhineConnector.STATE_KEY)) {
          syncedValue = connector.yBaseMap.get(WebsocketRhineConnector.STATE_KEY) as YMap<any>
          object.native.forEach((value: any, key: string | number) => {
            Reflect.deleteProperty(object, directKey(key))
          })
          object.unobserve()
          object.native = syncedValue
          object.observe()
          log('Proxy.synced: Update synced native')
          syncedValue.forEach((value: any, key: string) => {
            if (isNative(value)) {
              Reflect.set(object, directKey(key), rhineProxyNative(value))
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


export function rhineProxyNative<T extends object>(target: Native): ProxiedRhineVar<T> {
  // log('rhineProxyNative', target)
  const object = new RhineVar<T>(target)
  
  object.native.forEach((value, keyString) => {
    let key = keyString as keyof T
    if (isNative(value)) {
      Reflect.set(object, key, rhineProxyNative<T>(value))
    }
  })
  
  const handler: ProxyHandler<RhineVar<T>> = {
    get(proxy, p, receiver) {
      if (isDirectKey(p)) return Reflect.get(object, originKey(p), receiver)
      if (RHINE_VAR_KEYS.has(p)) return Reflect.get(object, p, receiver)
      log('Proxy.handler.get:', p, '\n', object, receiver)
      
      if (p in object) return Reflect.get(object, p, receiver)
      
      let result = nativeGet(object.native, p)
      if (result !== undefined) return result
      
      if (object.native instanceof YArray) {
        if (typeof p === 'string') {
          const f = convertArrayProperty<T>(object.native, p, object)
          if (f) return f
        }
      }
      return undefined
    },
    
    set(proxy, p, value, receiver): boolean {
      if (isDirectKey(p)) return Reflect.set(object, originKey(p), value.data, receiver)
      if (RHINE_VAR_KEYS.has(p)) return Reflect.set(object, p, value, receiver)
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
    
    deleteProperty(proxy: RhineVar<T>, p: string | symbol): boolean {
      if (isDirectKey(p)) return Reflect.deleteProperty(object, originKey(p))
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

