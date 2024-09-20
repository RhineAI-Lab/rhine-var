<div align="center">

# RHINE-VAR &nbsp; Document

[English](LEARN.md) &nbsp; | &nbsp; [中文](LEARN_zh.md)

</div>


## Simplest Usage Example

```typescript jsx
const defaultValue = {count: 0}
const state = rhineProxy(defaultValue, 'localhost:6600/room-id')

function Counter() {
  
  const snap = useRhine(state)
  
  return <div>
    <button onClick={() => state.count-- }> - 1 </button>
    <span>{snap.count}</span>
    <button onClick={() => state.count++ }> + 1 </button>
  </div>
}
```

When building a collaborative application using RHINE-VAR, typically, there will only be a single shared RhineVar object in your project. It can be a complex and large JSON data structure to store all the collaborative information of your project.

## rhineProxy

The core function used to create a RhineVar object, whose internal data will automatically synchronize with others.  

Typically, a project will use it only once, as only one root RhineVar object is needed.

```typescript jsx
function rhineProxy<T>(defaultValue, connector, overwrite)
```

| Parameter           | Type                       | Default  | Description                                                                 |
|--------------|--------------------------|------|--------------------------------------------------------------------|
| defaultValue | T                        | Required  | The default value. <br/>If there is no data for this room on the server, this default value is used as the project's initial value. <br/>Note: This value will also be returned temporarily before the first connection to the server is established. |
| connector    | RhineConnector \| string | Required  | The connector. <br/>When a string is passed, a WebSocket connection is automatically created. The default protocol is ws://. <br/>For more information on the server, see below. |
| overwrite    | boolean                  | false | Overwrite mode. <br/>Even if there is data on the server, the default value will overwrite the server data. This is mainly used for debugging purposes.  |
| return       | RhineVar\<T\>                 |  | The root RhineVar collaborative variable object, which contains not only collaborative data but also connection-related features.  |


## useRhine

A React-specific Hook function used to create snapshots that automatically update the content on the page when the data changes.

Whenever someone modifies this value, the information will be `updated on everyone's screen` in real-time.

```typescript jsx
function useRhine<T>(proxy)
```

| Parameter           | Type                           | Default | Description                               |
|--------------|------------------------------|----|----------------------------------|
| proxy | RhineVar\<T\>  | Required | The RhineVar collaborative variable that needs to subscribe for updates, or any node inside it. |
| return       | Snapshot\<RhineVar\<T\>>         |    | The snapshot corresponding to the RhineVar.
|

Note: Do not operate on the returned snapshot. The snapshot is only used to read data in React's JSX. All other operations (such as assigning values or subscriptions) should be done on the original RhineVar object.

<br/>

## Advanced Guide

Interface for Example
```typescript
export interface Group {
  id: string
  people: Person[]
}

export interface Person {
  name: string
  age: number
  description?: string
}
```

Create RhineVar object
```typescript
export interface Group {
  id: string
  people: Person[]
}

export interface Person {
  name: string
  age: number
  description?: string
}
```

Event System
```typescript
// Basic subscription for changes in the direct properties of the current node
const subscriber: Callback = (key, value, oldValue, type) => {
  console.log('group.subscribe', key, type, ': ', oldValue, '->', value)
}
group.subscribe(subscriber)  // Subscribe
group.unsubscribe(subscriber)  // Unsubscribe
group.unsubscribeAll()  // Unsubscribe all from the current node

// Subscribe to changes for a specific property
group.subscribeKey('id', (key, value, oldValue, type) => {
  console.log('group.subscribeKey', key, type, ': ', oldValue, '->', value)
})

// Subscribe to changes in all properties and their descendants
group.subscribeDeep((path, value, oldValue, type) => {
  console.log('group.subscribeDeep', path, type, ': ', oldValue, '->', value)
})

// Subscriptions can be added to any object or array
group.people[1].subscribe(() => {
  // xxx
})
```

Operation
```typescript
// Access or modify it just like in JavaScript
console.log('The first person\'s name:', group.people[0].name)
/**
 * The first person's name: Henry
 */

console.log('Changing group id to group-2')
group.id = 'group-2'
/**
 * Changing group id to group-2
 * group.subscribeKey id update :  group-1 -> group-2
 * group.subscribeDeep ['id'] update :  group-1 -> group-2
 */

console.log('Deleting the description property of the first person')
delete group.people[0].description
/**
 * Deleting the description property of the first person
 * group.subscribeDeep ['people', 0, 'description'] delete :  A young man. -> undefined
 */
```

```typescript
// Operate on a RhineVar like an Array
console.log('Current number of people in group:', group.people.length)
/**
 * Current number of people in group: 2
 */

console.log('Adding a new member, Jessica')
group.people.push({name: 'Jessica', age: 19})
/**
 * Adding a new member, Jessica
 * group.subscribeDeep ['people', 2] add :  undefined -> Proxy(RhineVarItem){xxx}
 */
```

Additional
```typescript
// Use .json() to print data without proxy information more clearly
console.log('Current people data:', group.people.json())
/**
 * Current people data: [{…}, {…}, {…}]
 */

// Note, when assigning a new object with " = " in TypeScript, there may be type-checking issues. You can use "as" to modify the type.
group.people[1] = {name: 'Jessica', age: 19} as ProxiedRhineVarItem<Person>  // You can also use "as any"
/**
 * group.subscribeDeep ['people', 1] delete :  {name: 'Emily', age: 22} -> undefined
 * group.subscribeDeep ['people', 1] add :  undefined -> Proxy(RhineVarItem){}
 */
```

<br/>

## Event System

Subscriptions can be added at any point on RhineVar and its internal nodes. Examples of how to use subscriptions can be found in the "Subscribing to events" section above. There are three types of subscriptions, as shown below.

| Type   | Subscribe Function          | Unsubscribe Function          | Unsubscribe All Function             | Callback Type       |
|------|---------------|-----------------|--------------------|--------------|
| Base | subscribe     | unsubscribe     | unsubscribeAll     | Callback     |
| Key  | subscribeKey  | unsubscribeKey  | unsubscribeAllKey  | Callback     |
| Deep | subscribeDeep | unsubscribeDeep | unsubscribeAllDeep | DeepCallback |

Subscription and unsubscription functions require a corresponding callback function.

```
Base: Subscribe to direct changes in the properties of the current node  
Key: Subscribe to changes in a specific property under the current node  
Deep: Subscribe to changes in all properties and their descendants
```

### Callback

The callback function for subscription events provides the following information, typically the first four are commonly used.

| Parameter                | Type                                            | Description        |
|-------------------|-----------------------------------------------|-----------|
| key               | keyof T                                       | The key of the changed property |
| value             | T[keyof T] \| ProxiedRhineVarItem<T[keyof T]> | The value after the change     |
| oldValue          | T[keyof T]                                    | The value before the change     |
| type              | ChangeType                                    | The event type      |
| nativeEvent       | YMapEvent<any> \| YArrayEvent<any>            | The native Yjs event   |
| nativeTransaction | Transaction                                   | The native Yjs transaction   |

### DeepCallback

与 Callback 的唯一区别是 key 变为 path。其他属性不再重复列出。

| 属性   | 类型                   | 描述                     |
|------|----------------------|------------------------|
| path | (string \| number)[] | 变化属性的路径，从订阅的节点到变化的目标属性 |

### ChangeType

An enum representing the event type, as shown below.

| 属性     | 值      | 可触发对象          | 描述       |
|--------|--------|----------------|----------|
| Add    | add    | YMap \| YArray | Triggered when a new property is added  | 
| Update | update | YMap           | Triggered when a property value is updated | 
| Delete | delete | YMap \| YArray | Triggered when a property is removed  | 
| Sync   | sync   | RhineConnector | Triggered during the first connection  | 

Note: Due to the collaborative algorithm of Yjs using Quill's Delta protocol, updates to array elements will not trigger the Update event. Instead, Delete and Add will be triggered in combination.

<br/>

## More Functions

Additional common methods for RhineVar objects and their internal nodes. Examples of usage can be found in the sections above.

### json(): T

Converts the data to JSON format.

```typescript
state.json()
```

### afterSynced(callback: () => void): void

Callback triggered after the first data synchronization.

```typescript
state.afterSynced(() => {

})
```

### waitSynced(): Promise\<void\>

A Promise that triggers after the first data synchronization.

```typescript
await state.waitSynced()
```

### isRoot(): boolean

Determines if the current node is the root node.

```typescript
state.isRoot()
```

### root(): RhineVar

Gets the root node.

```typescript
state.root()
```

### parent(): RhineVar | null

Gets the parent node.

```typescript
state.parent()
```

### frozenJson(): T

Even after the Yjs object is removed from the context, the last data can still be retrieved through this function.

```typescript
state.frozenJson()
```

<br/>


## Server
We provide a simple server example located in the /test/server directory of this project. The server is fully compatible with all Yjs WebSocket servers and will support more in the future.
```
git clone https://github.com/RhineAI-Lab/rhine-var.git
cd test/server
yarn install
yarn start
```
By default, it runs on port 6600, and you can connect to it via ws://localhost:6600/<room-id>, where <room-id> can be any string. A room ID corresponds to a RhineVar object.

For more information on server development, refer to: https://docs.yjs.dev/ecosystem/connection-provider/y-websocket

<br/>
