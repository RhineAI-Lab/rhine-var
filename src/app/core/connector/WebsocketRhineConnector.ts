import {Map as YMap, Array as YArray, Doc as YDoc} from "yjs";
import {WebsocketProvider} from "y-websocket";
import {ConnectorStatus} from "@/app/core/connector/ConnectorStatus";


const ENABLE_LOG = false

export default class WebsocketRhineConnector {
  
  yDoc: YDoc
  yBaseMap: YMap<any>
  url: string = ''
  
  clientId = -1
  synced = false
  
  provider: WebsocketProvider | null = null
  websocketStatus: ConnectorStatus = ConnectorStatus.DISCONNECTED
  
  constructor(url = '') {
    this.yDoc = new YDoc()
    this.yBaseMap = this.yDoc.getMap()
    url && this.connect(url)
  }
  
  bind(defaultValue: YMap<any> | YArray<any>, overwrite: boolean = false) {
    if (!overwrite && this.yBaseMap.has('state')) {
      return this.yBaseMap.get('state')
    }
    this.yBaseMap.set('state', defaultValue)
    return defaultValue
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
        ENABLE_LOG && console.log('WebsocketProvider status:', event.status)
      })
      
      this.provider.on('sync', (isSynced: boolean) => {
        ENABLE_LOG && console.info('WebsocketProvider sync:', isSynced)
        if (isSynced) {
          this.synced = true
          this.clientId = this.yDoc.clientID
          resolve()
        }
      })
      
      this.provider.on('connection-close', (e: any) => {
        this.websocketStatus = ConnectorStatus.DISCONNECTED
        ENABLE_LOG && console.warn('WebsocketProvider connection-close:', e)
      })
      
      this.provider.on('connection-error', (error: any) => {
        this.websocketStatus = ConnectorStatus.DISCONNECTED
        ENABLE_LOG && console.warn('WebsocketProvider connection-error:', error)
      })
    })
    
  }
  
}


export async function websocketRhineConnect(url: string) {
  const connector = new WebsocketRhineConnector()
  await connector.connect('wss://rhineai.com/ws/test-room-0')
  return connector
}
