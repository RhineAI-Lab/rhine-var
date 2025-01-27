"use client"

import React from "react";
import {enableRhineVarLog, rhineProxy, rhineText, rhineMap, useRhine} from "rhine-var";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

enableRhineVarLog(true)

const defaultValue = {
  arr: [1, 2, 3, 4, 5],
}
const url = 'room-11'
const state = rhineProxy(defaultValue, url, true)

state.afterSynced(() => {
  console.log(state.arr.json())
  console.log(state.arr.copyWithin(0, 3, 4).json())
})

export default function EasyState() {

  return <div className='page'>
  </div>
}
