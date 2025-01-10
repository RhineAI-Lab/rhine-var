import {Doc as YDoc, Map as YMap} from "yjs";
import {WebsocketProvider} from "y-websocket";
import {ConnectorStatus} from "@/core/connector/connector-status.enum";
import {log} from "@/utils/logger";
import RhineVarConfig from "@/config/config";
import SyncHandshakeCheck from "@/core/connector/websocket/sync-handshake-check.class";
import Connector from "@/core/connector/connector.abstract";

export default class WebsocketConnector extends Connector{

  name: string = ''
  url: string = ''

  provider: WebsocketProvider | null = null
  
  async connect(text: string): Promise<void> {
    let li = this.url.lastIndexOf('/')
    if (li == -1 || li == this.url.length -1 || !this.url.startsWith('ws')) {
      console.error('WebsocketConnector: UnSupport URL to connect room')
      return
    }

    this.name = text.substring(li + 1)
    this.url = text.substring(0, li)

    this.yDoc = new YDoc()
    this.yBaseMap = this.yDoc.getMap()

    return new Promise((resolve, reject) => {
      this.provider = new WebsocketProvider(
        this.url,
        this.name,
        this.yDoc!
      )
      this.provider.shouldConnect = true
      
      this.provider.on('status', (event: any) => {
        this.status = event.status
        log('WebsocketConnector.event status:', event.status)
      })
      
      this.provider.on('sync', async (synced: boolean) => {
        if (synced) {
          if (RhineVarConfig.ENABLE_SYNC_HANDSHAKE_CHECK) {
            await SyncHandshakeCheck.wait(this.yBaseMap!)
          }
          log('WebsocketConnector.event sync:', this.yBaseMap!.toJSON())
          this.synced = true
          this.clientId = this.yDoc!.clientID
          this.emitSynced(synced)
          resolve()
        } else {
          log('WebsocketConnector.event sync:', false)
        }
      })
      
      this.provider.on('connection-close', (e: any) => {
        this.status = ConnectorStatus.DISCONNECTED
        log('WebsocketConnector.event connection-close:', e)
      })
      
      this.provider.on('connection-error', (error: any) => {
        this.status = ConnectorStatus.DISCONNECTED
        log('WebsocketConnector.event connection-error:', error)
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
