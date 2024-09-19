"use client"

import React from "react";
import {rhineProxy, rhineItem} from "rhine-var";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

const defaultValue = {
  fruits: [
    {name: 'apple', number: 4},
    {name: 'orange', number: 1},
    {name: 'peach', number: 3},
  ]
}
const state = rhineProxy(defaultValue, 'localhost:6600/room-1', true)

state.afterSynced(() => {
  
  for (const fruit of state.fruits) {
    console.log(fruit.json())
  }
  
})


export default function Playground() {
  return <div className='page'/>
}
