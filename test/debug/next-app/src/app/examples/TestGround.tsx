"use client"

import React from "react";
import {rhineProxy, rhineItem} from "rhine-var";


const defaultValue = {
  fruits: [
    {name: 'apple', number: 3},
    {name: 'orange', number: 3},
    {name: 'peach', number: 3},
  ]
}
const state = rhineProxy(defaultValue, 'localhost:6600/room-1')

async function test() {
  
  await state.waitSynced()
  state.subscribeDeep((value, key, oldValue, type, nativeEvent, nativeTransaction) => {
  
  })
  
  console.log('### SET')
  state.fruits[0].name = 'aaa'
  
  // console.log('### PUSH')
  // state.fruits[3] = rhineItem({name: 'banana', number: 9})
  
}
test()


export default function TestGround() {
  return <div className='page'/>
}
