"use client"

import React from "react";
import {enableRhineVarLog, rhineProxy, rhineText, useRhine} from "rhine-var";
import {Text as YText} from "yjs";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

enableRhineVarLog(true)

const defaultValue = {
  arr: [
    {
      text: 'Hello',
      rhineText: rhineText('World'),
    },
  ],
}
const url = 'room-11'
const state = rhineProxy(defaultValue, url)

export default function EasyState() {

  const snap = useRhine(state)
  console.log('render')

  return <div className='page'>
  </div>
}
