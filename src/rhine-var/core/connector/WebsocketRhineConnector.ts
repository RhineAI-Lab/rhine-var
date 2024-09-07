import {Map as YMap, Array as YArray, Doc as YDoc} from "yjs";
import {WebsocketProvider} from "y-websocket";
import {ConnectorStatus} from "@/rhine-var/core/connector/ConnectorStatus";
import {log} from "@/rhine-var/core/utils/Logger";

export type SyncedListener = (synced: boolean) => void

export default class WebsocketRhineConnector {
  
  static STATE_KEY = 'state'
  
  yDoc: YDoc
  yBaseMap: YMap<any>
  url: string = ''
  
  clientId = -1
  synced = false
  
  provider: WebsocketProvider | null = null
  websocketStatus: ConnectorStatus = ConnectorStatus.DISCONNECTED
  
  
  syncedListeners: SyncedListener[] = []
  addSyncedListener(listener: SyncedListener) {
    this.syncedListeners.push(listener)
  }
  removeSyncedListener(listener: SyncedListener) {
    this.syncedListeners = this.syncedListeners.filter(l => l !== listener)
  }
  emitSynced(synced: boolean) {
    this.syncedListeners.forEach(listener => listener(synced))
  }
  
  waitSynced(): Promise<void> {
    return new Promise((resolve) => {
      if (this.synced) return true
      const listener = (synced: boolean) => {
        if (synced) {
          this.removeSyncedListener(listener)
          resolve()
        }
      }
      this.addSyncedListener(listener)
    })
  }
  
  
  constructor(url = '') {
    this.yDoc = new YDoc()
    this.yBaseMap = this.yDoc.getMap()
    url && this.connect(url)
  }
  
  bind(defaultValue: YMap<any> | YArray<any>, overwrite: boolean = false) {
    if (this.synced) {
      if (!overwrite && this.yBaseMap.has(WebsocketRhineConnector.STATE_KEY)) {
        return this.yBaseMap.get(WebsocketRhineConnector.STATE_KEY)
      }
      this.yBaseMap.set(WebsocketRhineConnector.STATE_KEY, defaultValue)
      return defaultValue
    } else {
      const tempMap = new YDoc().getMap()
      tempMap.set(WebsocketRhineConnector.STATE_KEY, defaultValue)
      return defaultValue
    }
  }
  
  async connect(url: string): Promise<void> {
    this.url = url
    let li = this.url.lastIndexOf('/')
    if (li == -1 || li == this.url.length -1 || !this.url.startsWith('ws')) {
      console.error('UnSupport URL for Connect Room')
      return
    }
    
    return new Promise((resolve, reject) => {
      this.provider = new WebsocketProvider(
        this.url.slice(0, li),
        this.url.slice(li + 1),
        this.yDoc
      )
      this.provider.shouldConnect = true
      
      this.provider.on('status', (event: any) => {
        this.websocketStatus = event.status
        log('WebsocketRhineConnector.event status:', event.status)
      })
      
      this.provider.on('sync', (synced: boolean) => {
        log('WebsocketRhineConnector.event sync:', synced)
        if (synced) {
          this.synced = true
          this.clientId = this.yDoc.clientID
          this.emitSynced(synced)
          resolve()
        }
      })
      
      this.provider.on('connection-close', (e: any) => {
        this.websocketStatus = ConnectorStatus.DISCONNECTED
        log('WebsocketRhineConnector.event connection-close:', e)
      })
      
      this.provider.on('connection-error', (error: any) => {
        this.websocketStatus = ConnectorStatus.DISCONNECTED
        log('WebsocketRhineConnector.event connection-error:', error)
      })
    })
    
  }
  
}


export function websocketRhineConnect(url: string) {
  const connector = new WebsocketRhineConnector()
  if (typeof window !== 'undefined') {
    connector.connect(url)
  }
  return connector
}
