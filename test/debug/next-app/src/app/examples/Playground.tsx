"use client"

import React from "react";
import {rhineProxy} from "rhine-var";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

const defaultValue = {
  fruits: ['apple', 'orange', 'peach']
}
const state = rhineProxy(defaultValue, 'localhost:6600/room-1', true)

state.afterSynced(() => {
  
  state.fruits[2] = 'apple'
  
  console.log(state.fruits[2])
  
})


export default function Playground() {
  return <div className='page'/>
}
