<div align="center">

# RHINE-VAR: Simplest and Powerful CRDT Library

Rhine Variable — A self-synchronizing variable for collaboration.
Developing collaborative applications has never been this easy.


[English](README.md) &nbsp; | &nbsp; [中文](README_zh.md)

<img src='./assets/images/example1.png' style="border-radius: 10px"/>

</div>

<br/>

### **Document:** [LEARN.md](assets/documents/LEARN.md)

### **Github:** [https://github.com/RhineAI-Lab/rhine-var](https://github.com/RhineAI-Lab/rhine-var)

### **Npm:** [https://www.npmjs.com/package/rhine-var](https://www.npmjs.com/package/rhine-var)

<br/>

## Why Choose RHINE-VAR ?

<div style="height: 6px"></div>

### Concise and Efficient Syntax Design
RhineVar draws inspiration from the design philosophy of the Valtio state management library, `significantly reducing the learning curve`. Allowing developers to handle data seamlessly, as if `working with standard variables`.

### Comprehensive Type Support
RhineVar offers full type hints and checks, ensuring `Precise Code Completion` and `Static Analysis` during development. This not only improves the development experience but also reduces potential errors, making it especially `suitable for TypeScript projects`, enhancing code safety and reliability.

### Distributed Real-time Collaboration Algorithm
The underlying collaboration algorithm of RhineVar is `Powered By the Robust Yjs Library`. Using the CRDT (Conflict-free Replicated Data Type) algorithm, it ensures eventual consistency even in multi-user and offline environments.

### Almost No Structural Complexity Limitations
There is almost no upper limit. It can be an `Extremely Complex and Large Data Structure` to accommodate all the data for a large project. But at the very least, it is `a JavaScript Object`.

<br/>
<details>
<summary><b>More Advantages of RHINE-VAR</b></summary>

### High Performance with Low Bandwidth Requirements
The data synchronization and conflict resolution mechanism is highly efficient. Leveraging Yjs's `Incremental Update Mechanism`, only necessary data changes are transmitted rather than the entire document, making it ideal for bandwidth-constrained environments and reducing unnecessary data transfers.

### Strong Offline Support
Users can continue to work even while offline. Once reconnected, all changes are automatically synchronized, ensuring `no data is lost or conflicted`. This is crucial for building offline-first applications.

### Cross-platform and Framework Agnostic
RhineVar can be used in `All JavaScript Environments`, including browsers, Node.js, and other JavaScript platforms. It integrates with multiple frontend frameworks and libraries such as Next.js, React, Vue.js, ProseMirror, and more.

### Lightweight and Extensible
RhineVar is a highly lightweight library, with its core package `only a few KB` in size, making it suitable for various frontend applications. Its modular architecture supports feature extensions, allowing developers to import or develop custom modules as needed.

### Decentralized Architecture
With a decentralized architecture, collaborative editing becomes more scalable, efficient, and fault-tolerant. Peer-to-peer data transfer is supported without relying on a central server (currently under development).

### Native Yjs Support
RhineVar offers full support for native Yjs object operations, providing lower-level, richer API support. `Direct operations on Yjs objects automatically trigger updates in RhineVar`.

### More Friendly and Complete Event System
RhineVar offers an extensive event subscription and listening system with `Intuitive Data Change Events`. It also supports deep data change monitoring within objects, catering to a wide range of use cases.

### Fully Open Source
This is a fully open-source project, licensed under the `Apache-2.0 license` on GitHub. You are `Free to use it for both Commercial and Non-commercial Projects`, and it allows modification and distribution, as long as the original copyright notice is retained.

</details>

<br/>

## Contact Us
Welcome to join our WeChat group for communication. We look forward to having more community members participate in the creation of rhine-var.

WeChat: [FNA-04]()

Email: [RhineAILab@gmail.com](rhineailab@gmail.com) & [RhineAI@163.com](RhineAI@163.com)

<br/>

## Install
```bash
yarn add rhine-var
```
If you don't have `yarn`, you can install it via `npm i rhine-var`, or install `yarn` first using `npm i -g yarn` and then use the command above to install.

<br/>

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

### Room ID

&lt;room-id&gt; can be any text, with each Room ID corresponding to a RhineVar, and users who join with the same Room ID will experience real-time multi-user collaboration.

### Default Value

When the room does not exist on the server, a default value will be used to create the room. If not connected to the server, data from the default value will also be returned.

### rhineProxy

Create a `RhineVar Object` that anyone in the room can directly modify, and the value will be synchronized to everyone real-time.

Its data structure `can be quite complex`, but `at least`, it is `an object` in JavaScript.

### useRhine

A hook for use with React. It creates a snapshot of a `RhineVar Object`, and whenever someone modifies this value, the information will be `updated on everyone's screen` in real-time.

<br/>

#### [Click to view the full document: LEARN.md](assets/documents/LEARN.md)


<br/>

## Server
We provide a simple server as a reference, located at `/test/server` in this project. The server is fully compatible with all Yjs websocket servers.
```
git clone https://github.com/RhineAI-Lab/rhine-var.git
cd test/server
yarn install
yarn start
```
It will run on `Port 6600`, and you can connect to it via `ws://localhost:6600/<room-id>`. `<room-id>` can be any text, with each room ID corresponding to a `RhineVariable`.

More information about server develop: [https://docs.yjs.dev/ecosystem/connection-provider/y-websocket](https://docs.yjs.dev/ecosystem/connection-provider/y-websocket)

<br/>

## Develop

```bash
# start watch and build by typescript
yarn run watch
yarn link

# start a easy websocket server
cd test/server
yarn install
yarn start

# start a nextjs playground for develop debug
cd test/debug/next-app
yarn link rhine-var  # Install rhine-var from local
yarn install
yarn run dev
# Open http://localhost:3000 in browser
```

<br/>
