"use client"

import React from "react";
import {rhineProxy, enableRhineVarLog, map} from "rhine-var";
import {StoredRhineVar} from "../../../../../src";
import {string} from "prop-types";

console.log('\n\n=================== Rhine Var Playground 2 ===================\n\n')

enableRhineVarLog(true)



const defaultValue = {
  obj: {
    size: 10,
    a: 'aaa'
  }
}

const state = rhineProxy(defaultValue, 'room-3', {
  overwrite: false
})

console.log(state.obj.size)

setTimeout(() => {
  console.log(state.obj.size)
}, 2000)

export default function PlaygroundTemp() {
  return <div className='page'/>
}
