import {rhineProxy} from "@/app/core/Proxy";
import {websocketRhineConnect} from "@/app/core/connector/WebsocketRhineConnector";
import User, {Sex} from "@/app/test/User";


export default class TestMain {
  
  static async start() {
    
    console.log('\n\n---- TestMain.Start ----\n\n')
    
    const user: User = {
      name: 'Eddie',
      age: 20,
      friends: [
        {name: 'Kitty', sex: Sex.Female}
      ],
      job: {
        enterprise: 'RhineAI',
        position: 'Developer',
        range: {start: 1000, end: 3000}
      }
    }
    
    const connector = await websocketRhineConnect('wss://rhineai.com/ws/test-room-0')
    console.log('Rhine Var Connected.', connector.url)
    
    const state = rhineProxy<User>(user, connector)  // 使用RhineVar 创建代理管理对象
    
    state.friends[1] = rhineProxy({name: 'Henry', sex: Sex.Male})
    console.log(state.friends.json())
    
  }
  
}

