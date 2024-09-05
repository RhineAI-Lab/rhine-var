import {Array as YArray} from "yjs";

export function convertArrayProperty<T>(target: YArray<T>, name: string) {
  if (name === 'length') {
    return target.length
  } if (name === 'push') {
    return (item: T) => target.push([item])
  } else if (name === 'pop') {
    return () => {
      let item = target.get(target.length - 1)
      target.delete(target.length - 1)
      return item
    }
  } else if (name === 'shift') {
    return () => {
      let item = target.get(0)
      target.delete(0)
      return item
    }
  } else if (name === 'unshift') {
    return (...items: T[]) => {
      target.unshift(items)
      return target.length
    }
  } else if (name === 'slice') {
    return (start: number, end?: number) => {
      return target.slice(start, end)
    }
  } else if (name === 'splice') {
    return (start: number, deleteCount: number, ...items: T[]) => {
      const removed = target.slice(start, start + deleteCount)
      target.delete(start, deleteCount)
      if (items.length > 0) {
        target.insert(start, items)
      }
      return removed
    }
  } else if (name === 'forEach') {
    return (callback: (value: T, index: number, arr: YArray<any>) => void) => {
      return target.forEach(callback)
    }
  } else if (name === 'map') {
    return (callback: (value: T, index: number, arr: YArray<any>) => void) => {
      return target.map(callback)
    }
  } else if (name === 'indexOf') {
    return (item: T) => {
      for (let i = 0; i < target.length; i++) {
        if (target.get(i) === item) return i
      }
      return -1
    }
  } else if (name === 'includes') {
    return (item: T) => {
      for (let i = 0; i < target.length; i++) {
        if (target.get(i) === item) return true
      }
      return false
    }
  }
}