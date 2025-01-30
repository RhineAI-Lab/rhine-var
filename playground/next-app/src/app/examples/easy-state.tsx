"use client"

import React from "react";
import {enableRhineVarLog, rhineProxy, text, map, item, useRhine} from "rhine-var";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

enableRhineVarLog(true)

const defaultValue = {
  obj: {
    a: {
      name: 'xxx',
    },
    b: {
      name: 'xxxa',
      age: 18
    }
  },
  arr: [
    {name: 'a'},
    {name: 'bb'},
    {name: 'ccc'},
  ],
  map: map({
    a: {name: 'aaa', text: text('aaa')},
    b: {name: 'bbb', text: text('aaa')},
    c: {name: 'ccc', text: text('aaa')},
  })
}

const url = 'room-11'
const state = rhineProxy(defaultValue, url, true)

state.afterSynced(() => {
  console.log(state.json())
  const a = state.map.get('a')
  if (a) {
    console.log(a.text.value)
  }
  console.log(state.json())
})

export default function EasyState() {

  return <div className='page'>
  </div>
}
