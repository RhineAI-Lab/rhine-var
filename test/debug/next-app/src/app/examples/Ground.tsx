"use client"

import React from "react";
import {rhineProxy, useRhine} from "rhine-var";


const defaultValue = {fruits: ['apple', 'orange']}
const state = rhineProxy(defaultValue, 'RhineAI.com/ws/room-0', false)

async function test() {
  state.fruits.subscribe((value, key) => {
    console.log('subscribe', key, value)
  })
  
  state.fruits.push('peach')
  console.log(state.fruits.json())
  await state.connector!.waitSynced()
  console.log(state.json())
  console.log(state.fruits)
  console.log(state.fruits[0])
}

test()



export default function Ground() {
  return <div className='page'/>
}
