"use client"

import React from "react";
import {enableRhineVarLog, rhineProxy, rhineText, rhineMap, useRhine} from "rhine-var";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

enableRhineVarLog(true)

const defaultValue = {
  arr: [0, 1, 2],
}
const url = 'room-11'
const state = rhineProxy(defaultValue, url, true)

state.afterSynced(() => {
  console.log(state.arr.json())
  state.arr.fill(9)
  console.log(state.arr.concat(3, 4, 5))
  console.log(state.arr.json())
})

export default function EasyState() {

  return <div className='page'>
  </div>
}
