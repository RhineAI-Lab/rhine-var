import {Array as YArray} from "yjs";
import RhineVar from "@/core/proxy/RhineVar";
import {ensureNative} from "@/core/utils/DataUtils";
import {isNative} from "@/core/native/NativeUtils";
import {Native} from "@/core/native/Native";

/**
 * 提供类似于JS原生Array的函数 通过函数名 返回同时用于操作YArray和RhineVar的模拟函数
 *
 * @param name 函数名/属性名
 * @param target 目标YArray
 * @param object 目标RhineVar
 *
 *
 * 添加元素类型: push
 * 若输入元素未经过代理将自动代理 若输入元素为Native类型将Native代理
 *
 * 删除元素并返回类型: pop shift
 * 从Native和RhineVar中删除对应元素 返回该元素 因该元素已不存在于RhineVar中 所以会自动转为json
 *
 */

export function convertArrayProperty<T>(name: string, target: YArray<any>, object: RhineVar<T>) {
  
  const get = (i: number) => {
    if (i in object) {
      return Reflect.get(object, i)
    } else {
      return target.get(i)
    }
  }
  
  if (name === 'length') {
    return target.length
  } if (name === 'push') {
    return (...items: (T[keyof T] | RhineVar<T[keyof T]>)[]): number => {
      for (let i = 0; i < items.length; i++) {
        items[i] = ensureNative(items[i])
      }
      target.push(items)
      return target.length
    }
  } else if (name === 'pop') {
    return (): T[keyof T] | undefined => {
      if (target.length === 0) return undefined
      let key = target.length - 1
      let item = target.get(key)
      target.delete(key)
      if (isNative(item)) {
        return (item as Native).toJSON() as T[keyof T]
      }
      return item as T[keyof T]
    }
  } else if (name === 'unshift') {
    return (...items: (T[keyof T] | RhineVar<T[keyof T]>)[]): number => {
      for (let i = 0; i < items.length; i++) {
        items[i] = ensureNative(items[i])
      }
      target.unshift(items)
      return target.length
    }
  } else if (name === 'shift') {
    return (): T[keyof T] | undefined => {
      if (target.length === 0) return undefined
      let key = 0
      let item = target.get(key)
      target.delete(key)
      if (isNative(item)) {
        return (item as Native).toJSON() as T[keyof T]
      }
      return item as T[keyof T]
    }
  } else if (name === 'slice') {
    return (start: number, end?: number): RhineVar<T[keyof T]>[] => {
      if (end === undefined) end = target.length
      if (start < 0) start = target.length + start
      if (end < 0) end = target.length + end
      if (start < 0) start = 0
      if (end > target.length) end = target.length
      let result = []
      for (let i = start; i < end; i++) {
        result.push(get(i))
      }
      return result
    }
  } else if (name === 'splice') {
    return (start: number, deleteCount: number, ...items: (T[keyof T] | RhineVar<T[keyof T]>)[]) => {
      const removed = []
      for (let i = start; i < start + deleteCount; i++) {
        let item = target.get(i)
        removed.push(isNative(item) ? (item as Native).toJSON() : item)
      }
      target.delete(start, deleteCount)
      if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          items[i] = ensureNative(items[i])
        }
        target.insert(start, items)
      }
      return removed
    }
  } else if (name === 'forEach') {
    return (callback: (value: T[keyof T], index: number, arr: YArray<any>) => void) => {
      return target.forEach((yValue, yIndex, yArray) => {
        callback(get(yIndex), yIndex, yArray)
      })
    }
  } else if (name === 'map') {
    return <R>(callback: (value: T, index: number, arr: YArray<any>) => R) => {
      const result: R[] = []
      target.forEach((yValue, yIndex, yArray) => {
        result.push(callback(get(yIndex), yIndex, yArray))
      })
      return result
    }
  } else if (name === 'indexOf') {
    return (item: T[keyof T]) => {
      for (let i = 0; i < target.length; i++) {
        if (get(i) === item) return i
      }
      return -1
    }
  } else if (name === 'includes') {
    return (item: T[keyof T]) => {
      for (let i = 0; i < target.length; i++) {
        if (get(i) === item) return true
      }
      return false
    }
  } else if (name === 'at') {
    return (i: number): T[keyof T] => {
      if (i < 0) i = target.length + i
      if (i < 0) return undefined as any
      if (i >= target.length) return undefined as any
      return get(i)
    }
  } else if (name === 'join') {
    return (str: string = ','): string => {
      let result = ''
      for (let i = 0; i < target.length; i++) {
        if (i > 0) result += str
        let item = target.get(i)
        if (isNative(item)) {
          result += (item as Native).toJSON()
        } else {
          result += item
        }
      }
      return result
    }
  } else if (name === 'find') {
    return (callback: (item: T[keyof T]) => boolean): T[keyof T] | undefined => {
      for (let i = 0; i < target.length; i++) {
        let item = get(i)
        if (callback(item)) return item
      }
      return undefined
    }
  } else if (name === 'findIndex') {
    return (callback: (item: T[keyof T]) => boolean): number => {
      for (let i = 0; i < target.length; i++) {
        if (callback(get(i))) return i
      }
      return -1
    }
  } else if (name === 'findLast') {
    return (callback: (item: T[keyof T]) => boolean): T[keyof T] | undefined => {
      for (let i = target.length - 1; i >= 0; i--) {
        let item = get(i)
        if (callback(item)) return item
      }
      return undefined
    }
  } else if (name === 'findLastIndex') {
    return (callback: (item: T[keyof T]) => boolean): number => {
      for (let i = target.length - 1; i >= 0; i--) {
        if (callback(get(i))) return i
      }
      return -1
    }
  }
}
