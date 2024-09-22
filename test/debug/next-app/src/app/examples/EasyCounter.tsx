import {rhineProxy, useRhine} from 'rhine-var'

const defaultValue = {count: 0}
const url = 'room-0'
const state = rhineProxy(defaultValue, url, false)

function Counter() {
  
  const snap = useRhine(state)
  
  return <div className='page'>
    <button onClick={() => state.count-- }> - 1 </button>
    <span>{snap.count}</span>
    <button onClick={() => state.count++ }> + 1 </button>
  </div>
}

export default Counter
