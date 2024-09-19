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
const state = rhineProxy(defaultValue, 'localhost:6600/room-1', true)

async function test() {
  
  await state.waitSynced()
  state.subscribeDeep((path, value, oldValue, type, nativeEvent, nativeTransaction) => {
    console.log(path, value)
  })
  
  state.fruits[3] = rhineItem({name: 'banana', number: 9})
  state.fruits.forEach(item => {
    console.log(item)
  })
}
test()


export default function TestGround() {
  return <div className='page'/>
}
