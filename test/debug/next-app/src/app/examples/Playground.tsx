"use client"

import React from "react";
import {rhineProxy} from "rhine-var";
import {ProxiedRhineVarItem} from "../../../../../../src/core/proxy/ProxiedRhineVar";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

const defaultValue = {
  person: 'Henry'
}
const state = rhineProxy(defaultValue, 'localhost:6600/room-1', true)

state.afterSynced(() => {
  
  state.person = 'Bob'
  
})


export default function Playground() {
  return <div className='page'/>
}
