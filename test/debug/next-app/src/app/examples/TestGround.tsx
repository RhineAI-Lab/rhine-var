"use client"

import React from "react";
import {rhineProxy} from "rhine-var";


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
  console.log(state.fruits[0].root().json())
}
test()


export default function TestGround() {
  return <div className='page'/>
}
