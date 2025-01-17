"use client"

import React from "react";
import {enableRhineVarLog, rhineProxy, rhineText} from "rhine-var";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

enableRhineVarLog(true)


const defaultValue = {text: rhineText('aaa')}
const url = 'room-4'
const state = rhineProxy(defaultValue, url, true)
console.log(state.json())

export default function EasyState() {
  return <div className='page'/>
}
