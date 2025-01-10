"use client"

import React from "react";
import {enableRhineVarSyncHandshakeCheck, rhineProxy} from "rhine-var";
import {enableRhineVarLog, ProxiedRhineVarItem} from "rhine-var";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

enableRhineVarLog(true)


const defaultValue = {
  state: 0,
}
const url = 'ws://localhost:11600/room-1'
const state = rhineProxy(defaultValue, url, true)
console.log(state.json())

export default function EasyState() {
  return <div className='page'/>
}
