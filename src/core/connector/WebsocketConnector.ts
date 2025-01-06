import {Doc as YDoc, Map as YMap} from "yjs";
import {WebsocketProvider} from "y-websocket";
import {ConnectorStatus} from "@/core/connector/ConnectorStatus";
import {log} from "@/utils/logger";
import {Native} from "@/core/native/Native";
import {SyncedCallback} from "@/core/event/Callback";
import RhineVarConfig from "@/config/config";
import SyncHandshakeCheck from "@/core/connector/SyncHandshakeCheck";

export default class WebsocketConnector {
  
  static STATE_KEY = 'state'
  
  yDoc: YDoc
  yBaseMap: YMap<any>
  url: string = ''
  
  clientId = -1
  synced = false
  
  provider: WebsocketProvider | null = null
  websocketStatus: ConnectorStatus = ConnectorStatus.DISCONNECTED
  
  
  private syncedSubscribers: SyncedCallback[] = []
  subscribeSynced(callback: SyncedCallback) {
    this.syncedSubscribers.push(callback)
    return () => this.unsubscribeSynced(callback)
  }
  unsubscribeSynced(callback: SyncedCallback) {
    this.syncedSubscribers = this.syncedSubscribers.filter(subscriber => subscriber !== callback)
  }
  unsubscribeAllSynced() {
    this.syncedSubscribers = []
  }
  emitSynced(synced: boolean) {
    this.syncedSubscribers.forEach(subscriber => subscriber(synced))
  }
  
  afterSynced(callback: () => void) {
    if (this.synced) {
      callback()
    } else {
      const subscriber = (synced: boolean) => {
        if (synced) {
          this.unsubscribeSynced(subscriber)
          callback()
        }
      }
      this.subscribeSynced(subscriber)
    }
  }
  waitSynced(): Promise<void> {
    return new Promise((resolve) => {
      this.afterSynced(resolve)
    })
  }
  
  constructor(url = '') {
    this.yDoc = new YDoc()
    this.yBaseMap = this.yDoc.getMap()
    url && this.connect(url)
  }

  hasState(): boolean {
    return this.yBaseMap.has(WebsocketConnector.STATE_KEY)
  }

  getState(): Native {
    return this.yBaseMap.get(WebsocketConnector.STATE_KEY)
  }

  setState(state: Native) {
    this.yBaseMap.set(WebsocketConnector.STATE_KEY, state)
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
      
      this.provider.on('sync', async (synced: boolean) => {
        if (synced) {
          if (RhineVarConfig.ENABLE_SYNC_HANDSHAKE_CHECK) {
            await SyncHandshakeCheck.wait(this.yBaseMap)
            log('Synced base map:', this.yBaseMap.toJSON())
          }
          log('WebsocketRhineConnector.event sync:', synced)
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
  
  async disconnect() {
    throw new Error('Disconnecting and switching connections are not supported at the moment.')
    /*
    if (this.provider) {
      this.provider.disconnect()
    }
    this.provider = null
    this.synced = false
    this.websocketStatus = ConnectorStatus.DISCONNECTED
    */
  }
  
}


export function websocketRhineConnect(url: string) {
  const connector = new WebsocketConnector()
  if (typeof window !== 'undefined') {
    connector.connect(url)
  }
  return connector
}
