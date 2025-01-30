"use client"

import React from "react";
import {enableRhineVarLog, rhineProxy, text, map, item, useRhine} from "rhine-var";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

enableRhineVarLog(true)

const defaultValue = {
  text: text('Hello, Rhine Var!'),
}

const url = 'room-11'
const state = rhineProxy(defaultValue, url, {
  overwrite: true
})

state.afterSynced(async () => {
  console.log('state.text.value:', state.text.value)
  state.text.value = 'set'
  console.log('state.text.value:', state.text.value)
})

export default function EasyState() {

  return <div className='page'>
  </div>
}
