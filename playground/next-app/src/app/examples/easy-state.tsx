"use client"

import React from "react";
import {enableRhineVarLog, rhineProxy, rhineText, useRhine} from "rhine-var";
import {Text as YText} from "yjs";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

enableRhineVarLog(true)

const defaultValue = {text: rhineText('aaaaa')}
const url = 'room-11'
const state = rhineProxy(defaultValue, url)

state.afterSynced(() => {
})


export default function EasyState() {

  const snap = useRhine(state)
  console.log('render')

  return <div className='page'>
    <span onClick={() => {
      (state.text.native as YText).insert(3, 'eee')
    }}>{snap.text as unknown as string}</span>
  </div>
}
