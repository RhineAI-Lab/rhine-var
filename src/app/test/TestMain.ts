import {Map as YMap, Array as YArray} from "yjs";
import {rhineProxy} from "@/app/core/Proxy";
import MainService from "@/app/MainService";

export interface User {
  name: string
  age: number
  friends: string[]
  job: {
    enterprise: string
    position: string
    range: {
      start: 1019
      end: 1110
    }
  }
}

export default class TestMain {
  static start() {
    
    console.log('\n\n---- TestMain.Start ----\n\n')
    
    // {
    //   name: 'Eddie',
    //   age: 20,
    //   friends: ['Kitty', 'Barry'],
    //   job: {
    //     enterprise: 'RhineAI',
    //     position: 'Developer',
    //   }
    // }
    
    const friends = new YArray<any>()
    friends.push(['Kitty', 'Ross', 'Mark', 'Betty'])
    const range = new YMap()
    range.set('start', 1019)
    range.set('end', 1110)
    const job = new YMap<any>()
    job.set('enterprise', 'OpenAI')
    job.set('position', 'Developer')
    job.set('range', range)
    const user = new YMap<any>()
    user.set('name', 'Eddie')
    user.set('age', 20)
    user.set('friends', friends)
    user.set('job', job)
    MainService.yMap.set('user', user)
    
    
    // 使用 RhineVar
    const state = rhineProxy<User>(user)  // 使用RhineVar 创建代理管理对象
    
    
  }
}

