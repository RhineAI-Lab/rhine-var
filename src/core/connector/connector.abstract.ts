import {Doc as YDoc, Map as YMap} from "yjs";
import {WebsocketProvider} from "y-websocket";
import {ConnectorStatus} from "@/core/connector/connector-status.enum";
import {Native} from "@/core/native/native.type";
import {SyncedCallback} from "@/core/event/callback";

export default abstract class Connector {
  
  static STATE_KEY = 'state'
  
  yDoc: YDoc
  yBaseMap: YMap<any>
  url: string = ''
  
  clientId = -1
  synced = false
  
  provider: WebsocketProvider | null = null
  status: ConnectorStatus = ConnectorStatus.DISCONNECTED
  
  
  protected syncedSubscribers: SyncedCallback[] = []
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
  protected emitSynced(synced: boolean) {
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
    return this.yBaseMap.has(Connector.STATE_KEY)
  }

  getState(): Native {
    return this.yBaseMap.get(Connector.STATE_KEY)
  }

  setState(state: Native) {
    this.yBaseMap.set(Connector.STATE_KEY, state)
  }
  
  abstract connect(url: string): Promise<void>
  
  abstract disconnect(): Promise<void>
  
}


export function websocketRhineConnect(url: string) {
}
