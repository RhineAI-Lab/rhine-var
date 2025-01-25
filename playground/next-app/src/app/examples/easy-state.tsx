"use client"

import React from "react";
import {enableRhineVarLog, rhineProxy, rhineText, useRhine} from "rhine-var";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

enableRhineVarLog(true)

const defaultValue = {
  arr: [
    {
      person: {
        name: 'Hello',
        info: rhineText('World'),
      }
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
