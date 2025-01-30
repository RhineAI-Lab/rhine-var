"use client"

import React from "react";
import {enableRhineVarLog, rhineProxy, text, map, item, useRhine} from "rhine-var";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

enableRhineVarLog(true)

const defaultValue = {
  arr: [
    {name: 'a', age: 1},
    {name: 'b', age: 2},
    {name: 'c', age: 3},
    {name: 'd', age: 4},
  ]
}

const url = 'room-11'
const state = rhineProxy(defaultValue, url, {
  overwrite: true
})

state.afterSynced(async () => {
})

export default function EasyState() {

  return <div className='page'>
  </div>
}
