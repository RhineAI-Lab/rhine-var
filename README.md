
# The most concise and rigorous real-time collaborative editing library.

Variables that support multi-user collaboration and persistence, making collaboration and variable operations as simple as possible, with strict and well-defined type hints.



## Install
```bash
yarn add rhine-var
```
If you don't have `yarn`, you can install it via `npm i rhine-var`, or install `yarn` first using `npm i -g yarn` and then use the command above to install.

## Usage

```typescript jsx
const defaultValue = {value: 0}
const count = rhineProxy(defaultValue, 'localhost:6600/room-0')

function Counter() {
  
  const countSnap = useRhine(count)
  
  return <div>
    <button onClick={() => count.value-- }> - 1 </button>
    <span>{countSnap.value}</span>
    <button onClick={() => count.value++ }> + 1 </button>
  </div>
}
```
#### Default Value

When the room does not exist on the server, a default value will be used to create the room. If not connected to the server, data from the default value will also be returned.

#### Room ID

The `Same Room ID` manages the `Same State Variables`, and users who join will experience real-time multi-user collaboration.

### rhineProxy

Create a `RhineVariable` that anyone in the room can directly modify, and the value will be synchronized to everyone almost simultaneously.

Its value is `at least an object` in javascript, `but` there is almost no upper limit. It can be an `extremely complex and large JSON structure` to accommodate all the data for a large project.

### useRhine

A hook for use with React. It creates a snapshot of a `RhineVariable`, and whenever someone modifies this value, the information will be `updated on everyone's screen` in real-time.

Use snapshot only when data needs to be displayed on the React page. For other operations, such as modifying values, please use RhineVariable itself.

<br/>

## Server
We provide a simple server as a reference, located at `/test/server` in this project. The server is fully compatible with all YJS websocket servers.
```
git clone https://github.com/RhineAI-Lab/rhine-var.git
cd test/server
yarn install
yarn start
```
It will run on `Port 6600`, and you can connect to it via `ws://localhost:6600/<room-id>`. The same Room ID manages the same State Variables, and users who join will experience real-time multi-user collaboration.

More information about server develop: [https://docs.yjs.dev/ecosystem/connection-provider/y-websocket](https://docs.yjs.dev/ecosystem/connection-provider/y-websocket)

<br/>

## Develop

```bash
# start watch and build by typescript
yarn run watch

# start a easy websocket server
cd test/server
yarn install
yarn start

# start a nextjs playground for develop debug
cd test/debug/next-app
yarn install
yarn start
```

<br/>
