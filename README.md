
# The most concise and rigorous strongly-typed real-time collaborative editing library.

Variables that support multi-user collaboration and persistence, making collaboration and variable operations as simple as possible, with strict and well-defined type hints.

## Install
```bash
npm i rhine-var
```
Or with yarn:
```bash
yarn add rhine-var
```

## Usage


```typescript jsx
const defaultValue = {value: 0}
const count = rhineProxy(defaultValue, 'RhineAI.com/ws/room-0')

function EasyCounter() {

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

Start Debug Mode

```bash
npm run watch
cd test/debug/next-app
npm run dev
```

<br/>
