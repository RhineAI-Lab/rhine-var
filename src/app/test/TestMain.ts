import {rhineProxy} from "@/app/core/Proxy";
import {websocketRhineConnect} from "@/app/core/connector/WebsocketRhineConnector";
import User, {Sex} from "@/app/test/User";


export default class TestMain {
  
  static async start() {
    
    console.log('\n\n---- TestMain.Start ----\n\n')
    
    const defaultUserData: User = {
      name: 'Mark',
      age: 20,
      friends: [
        {name: 'Kitty', sex: Sex.Female}
      ],
      job: {
        enterprise: 'OpenAI',
        position: 'Developer',
        range: {start: 1000, end: 3000}
      }
    }
    
    const connector = websocketRhineConnect('wss://rhineai.com/ws/test-room-0')
    
    await connector.waitBind()
    
    const user = rhineProxy<User>(defaultUserData, connector, false)
    user.name = 'Henry'
    
    
    console.log(user.json())
    
  }
  
}

