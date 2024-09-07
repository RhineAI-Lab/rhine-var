import User, {Sex} from "@/app/test/User";
import {websocketRhineConnect} from "@/rhine-var/core/connector/WebsocketRhineConnector";
import {rhineProxy} from "@/rhine-var/core/Proxy";


export default class TestMain {
  
  static async start() {
    
    console.log('\n\n---- TestMain.Start ----\n\n')
    
    const defaultUserData: User = {
      name: 'Jane',
      age: 20,
      friends: [
        {name: 'Mark', sex: Sex.Female}
      ],
      job: {
        enterprise: 'RhineAI',
        position: 'Developer',
        range: {start: 1000, end: 3000}
      }
    }
    
    const connector = websocketRhineConnect('wss://rhineai.com/ws/test-room-0')
    const user = rhineProxy<User>(defaultUserData, connector, false)
    
    console.log(user.json())
    await connector.waitSynced()
    console.log(user.json())
    
  }
  
}

