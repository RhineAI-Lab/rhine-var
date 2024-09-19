"use client"

import React from "react";
import {rhineProxy, ProxiedRhineVarItem} from "rhine-var";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

const defaultValue = {
  person: {name: 'Aaa', age: 20}
}
const state = rhineProxy(defaultValue, 'localhost:6600/room-1', true)

state.afterSynced(() => {
  
  state.subscribeDeep((path, value, oldValue) => {
    console.log(path, value, oldValue)
  })
  
  state.person = {name: 'B', age: 0} as ProxiedRhineVarItem<{name: string, age: number}>
  
})


export default function Playground() {
  return <div className='page'/>
}
