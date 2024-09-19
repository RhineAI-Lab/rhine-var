"use client"

import React from "react";
import {rhineProxy} from "rhine-var";

console.log('\n\n=================== Rhine Var Playground ===================\n\n')

const defaultValue: {
  people?: {name: string}[]
} = {
  people: [
    {name: 'A'},
    {name: 'B'},
  ]
}
const state = rhineProxy(defaultValue, 'localhost:6600/room-1', true)

state.afterSynced(() => {
  
  state.subscribeDeep((path, value, oldValue) => {
    console.log(path, value.json(), oldValue)
  })
  
  state.people = [{name: 'C'}]
  
})


export default function Playground() {
  return <div className='page'/>
}
