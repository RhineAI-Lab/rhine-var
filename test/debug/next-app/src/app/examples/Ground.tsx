"use client"

import React from "react";
import {rhineProxy} from "rhine-var";


const defaultValue = {fruits: [
    {name: 'apple', number: 4},
    {name: 'orange', number: 2},
    {name: 'peach', number: 3},
]}
const state = rhineProxy(defaultValue, 'RhineAI.com/ws/room-0', false)

async function test() {
  await state.waitSynced()
  
  console.log(state.fruits)
}
test()


export default function Ground() {
  return <div className='page'/>
}
