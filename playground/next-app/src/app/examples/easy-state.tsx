"use client"

import React from "react";
import {enableRhineVarLog, rhineProxy, rhineText, useRhine} from "rhine-var";
import {Array as YArray} from "yjs";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

enableRhineVarLog(true)

interface P {
  text: string
}
const arr = new YArray<P>()

const defaultValue = {
  arr: arr,
}
const url = 'room-11'
const state = rhineProxy<{
  arr: YArray<P>
}>(defaultValue, url)

state.arr[0].text

export default function EasyState() {

  const snap = useRhine(state)
  console.log('render')

  return <div className='page'>
  </div>
}
