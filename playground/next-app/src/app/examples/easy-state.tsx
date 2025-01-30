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
  }),
  text: text('aaa')
}

const url = 'room-11'
const state = rhineProxy(defaultValue, url, true)

state.afterSynced(() => {
  console.log(state.text.value)
  state.text.value = 'bbb'
  console.log(state.text.json())
})

export default function EasyState() {

  return <div className='page'>
  </div>
}
