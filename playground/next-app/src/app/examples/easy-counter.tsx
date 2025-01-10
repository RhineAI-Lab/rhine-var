import {rhineProxy, useRhine, enableRhineVarLog, enableRhineVarSyncHandshakeCheck} from 'rhine-var'

enableRhineVarLog(true)

const defaultValue = {count: 0}
const url = 'ws://localhost:11600/room-1'
const state = rhineProxy(defaultValue, url)
console.log('outside')

function Counter() {
  
  const snap = useRhine(state)
  console.log('state:', state.json())
  console.log('snap:', snap)
  
  return <div className='page'>
    <button onClick={() => state.count-- }> - 1 </button>
    <span onClick={() => state.count = 0}>{snap.count}</span>
    <button onClick={() => state.count++ }> + 1 </button>
  </div>
}

export default Counter
