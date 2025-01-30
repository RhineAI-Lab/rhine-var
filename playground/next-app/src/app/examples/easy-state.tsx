"use client"

import React from "react";
import {enableRhineVarLog, rhineProxy, rhineText, rhineMap, useRhine} from "rhine-var";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

enableRhineVarLog(true)

const defaultValue = {
  map: rhineMap({
    'a': {name: rhineText('a'), age: 1},
    'b': {name: rhineText('b'), age: 2},
    'c': {name: rhineText('c'), age: 3},
  })
}
const url = 'room-11'
const state = rhineProxy(defaultValue, url, true)

state.afterSynced(() => {
  console.log(state.json())
  console.log(state.map.set('a', {name: rhineText('d'), age: 4}))
  console.log(state.json())
})

export default function EasyState() {

  return <div className='page'>
  </div>
}
