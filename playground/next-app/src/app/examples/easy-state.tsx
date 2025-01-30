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
  state.text.subscribe((value) => {
    console.log('text:', value)
  })
  state.text.value = 'aaa'
})

export default function EasyState() {

  return <div className='page'>
  </div>
}
