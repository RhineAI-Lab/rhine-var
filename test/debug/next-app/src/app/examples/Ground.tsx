"use client"

import React from "react";
import {rhineProxy} from "rhine-var";


const defaultValue = {fruits: ['apple', 'orange']}
const state = rhineProxy(defaultValue, 'RhineAI.com/ws/room-0', false)

async function test() {
  state.afterSynced(() => state.fruits.subscribe((delta) => {
    console.log('subscribe', delta)
  }))
  
  await state.connector!.waitSynced()
  state.fruits.push('aa')
  console.log(state.fruits.json())
}

test()



export default function Ground() {
  return <div className='page'/>
}
