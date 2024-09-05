import {Map as YMap, Array as YArray, Doc as YDoc} from "yjs";
import {WebsocketProvider} from "y-websocket";
import {ConnectorStatus} from "@/app/core/connector/ConnectorStatus";


const ENABLE_LOG = false

export default class RhineConnector {
  
  yDoc: YDoc
  yBaseMap: YMap<any>
  url: string = ''
  
  clientId = ''
  
  provider: WebsocketProvider | null = null
  websocketStatus: ConnectorStatus = ConnectorStatus.DISCONNECTED
  
  constructor(url = '') {
    this.yDoc = new YDoc()
    this.yBaseMap = this.yDoc.getMap()
    url && this.connect(url)
  }
  
  bind(target: YMap<any> | YArray<any>) {
    this.yBaseMap.set('state', target)
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
        if (this.websocketStatus == ConnectorStatus.CONNECTED) resolve()
      })
      
      this.provider.on('sync', (isSynced: boolean) => {
        ENABLE_LOG && console.info('WebsocketProvider sync:', isSynced)
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
