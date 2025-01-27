"use client"

import React from "react";
import {enableRhineVarLog, rhineProxy, rhineText, rhineMap, useRhine} from "rhine-var";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

enableRhineVarLog(true)

const defaultValue = {
  map: rhineMap({
    'a': {name: 'aaa'},
    'b': {name: 'bbb'},
  })
}
const url = 'room-11'
const state = rhineProxy(defaultValue, url, true)

state.afterSynced(() => {
  console.log(state.map)
})

export default function EasyState() {

  return <div className='page'>
  </div>
}
