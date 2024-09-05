import {rhineProxy} from "@/app/core/Proxy";
import WebsocketRhineConnector, {websocketRhineConnect} from "@/app/core/connector/WebsocketRhineConnector";

export interface User {
  name: string
  age: number
  friends: string[]
  job: {
    enterprise: string
    position: string
    range: Range
  }
}

export interface Range {
  start: number
  end: number
}

export default class TestMain {
  
  static async start() {
    
    console.log('\n\n---- TestMain.Start ----\n\n')
    
    const user = {
      name: 'Eddie',
      age: 20,
      friends: ['Kitty', 'Lily', 'Betty'],
      job: {
        enterprise: 'RhineAI',
        position: 'Developer',
        range: {
          start: 1000,
          end: 3000,
        }
      }
    }
    
    const connector = await websocketRhineConnect('wss://rhineai.com/ws/test-room-0')
    console.log('Rhine Var Connected.', connector.url)
    
    const state = rhineProxy<User>(user, connector)  // 使用RhineVar 创建代理管理对象
    
    console.log(state.job.json())
    
  }
  
}

