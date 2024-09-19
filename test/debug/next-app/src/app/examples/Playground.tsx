"use client"

import React from "react";
import {rhineProxy} from "rhine-var";
import {ProxiedRhineVarItem} from "../../../../../../src";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

const defaultValue = {
  people: ['Henry']
}
const state = rhineProxy(defaultValue, 'localhost:6600/room-1', true)

state.afterSynced(() => {
  
  state.subscribeDeep((path, value, oldValue) => {
    console.log('deep change:', path, value, '\n\nfrom:', oldValue)
  })
  
  state.people[0] = 'Kitty'
  
})


export default function Playground() {
  return <div className='page'/>
}
