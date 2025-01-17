import {rhineProxy, useRhine, enableRhineVarLog} from 'rhine-var'

enableRhineVarLog(true)

const defaultValue = {count: 0}
const url = 'room-1'
const state = rhineProxy(defaultValue, url)

function Counter() {
  
  const snap = useRhine(state)
  
  return <div className='page'>
    <button onClick={() => state.count-- }> - 1 </button>
    <span onClick={() => state.count = 0}>{snap.count}</span>
    <button onClick={() => state.count++ }> + 1 </button>
  </div>
}

export default Counter
