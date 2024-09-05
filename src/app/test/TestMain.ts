import {Map as YMap, Array as YArray} from "yjs";
import {rhineProxy} from "@/app/test/Proxy";
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
    friends.push(['Kitty', 'Barry'])
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
    
    state.job.subscribe((value, key) => {  // 订阅任意处变化
      console.log('Subscribe', key, value)
    })
    
    state.job.enterprise = 'RhineAI'  // 修改任意节点属性
    console.log(state.job.json())  // 输出任意节点值
    
    state.job.range.subscribeKey('start', (value, key) => {  // 订阅任意节点属性变化
      console.log(value)
    })
    
    console.log(state.job.range.json())
    
    
    // 使用 yjs
    const jobMap = user.get('job')
    if (jobMap && jobMap instanceof YMap) {
      jobMap.observe((event, transaction) => {
        event.changes.keys.forEach((change, key) => {
          console.log('Subscribe', key, jobMap.get(key))
        })
      })
    }
    
    user.get('job')?.set('enterprise', 'RhineAI')
    console.log(user.get('job')?.toJSON())
    
  }
}

