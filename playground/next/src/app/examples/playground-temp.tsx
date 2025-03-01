"use client"

import React from "react";
import {rhineProxy, enableRhineVarLog, map} from "rhine-var";
import {StoredRhineVar} from "../../../../../src";
import {string} from "prop-types";

console.log('\n\n=================== Rhine Var Temp Playground ===================\n\n')

enableRhineVarLog(true)



const defaultValue = {
  obj: {
    size: 20,
  },
  map: map(),
}

const state = rhineProxy(defaultValue, 'room-5', {overwrite: false})

console.log(state.obj)
console.log(state.map)

state.afterSynced(() => {
  console.log(state.obj)
  console.log(state.map)
  console.log('Synced:', state.json())
})

export default function PlaygroundTemp() {
  return <div className='page'/>
}
