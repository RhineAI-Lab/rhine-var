
# The world's most intuitive and reliable strongly-typed collaborative library

## Install
```bash
npm i rhine-sync
```

## Usage


```typescript jsx
const defaultValue = {value: 0}
const count = rhineProxy(defaultValue, 'RhineAI.com/ws/room-0')

export default function EasyCounter() {

  const countSnap = useRhine(count)

  return <div className='page'>
    <button onClick={() => count.value-- }> - 1 </button>
    <span>{countSnap.value}</span>
    <button onClick={() => count.value++ }> + 1 </button>
  </div>
}
```

<br/>

## Develop With US
```bash
npm run dev
```

<br/>
