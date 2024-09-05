import {Map as YMap, Array as YArray, Doc as YDoc} from "yjs";
import {WebsocketProvider} from "y-websocket";
import TestMain from "@/app/test/TestMain";

export enum WebsocketStatus {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
}

export default class MainService {
  
  static yDoc: YDoc
  static yMap: YMap<any>
  static yIds: YMap<any>
  
  static clientId = ''
  
  static provider: WebsocketProvider
  static websocketStatus: WebsocketStatus = WebsocketStatus.DISCONNECTED

  static async initialize() {
    
    this.yDoc = new YDoc()
    this.yMap = this.yDoc.getMap()
    
    await this.connect()
    
    TestMain.start()
  }
  
  
  
  static async connect(): Promise<any> {
    console.info('CollaborationManager.connect')
    
    return new Promise((resolve, reject) => {
      // let url = 'ws://' + l.hostname + ':3340'
      let url = 'wss://rhineai.com/ws'
      this.provider = new WebsocketProvider(
        url,
        'crdt-test-1',
        this.yDoc
      )
      this.provider.shouldConnect = true
      
      this.provider.on('status', (event: any) => {
        console.log('WebsocketProvider status:', event.status)
        this.websocketStatus = event.status
        if (event.status === 'connected') {
          // resolve(this.provider)
        }
      })
      
      this.provider.on('sync', (isSynced: boolean) => {
        console.info('WebsocketProvider sync:', isSynced)
        if (isSynced) {
          resolve(this.provider)
        }
      })
      
      this.provider.on('connection-close', (e: any) => {
        this.websocketStatus = WebsocketStatus.DISCONNECTED
        console.warn('WebsocketProvider connection-close:', e)
      })
      
      this.provider.on('connection-error', (error: any) => {
        console.warn('WebsocketProvider connection-error:', error)
        // reject()
      })
    })
  }
  
}

