import {Array as YArray} from "yjs";
import {isNative} from "@/core/native/native.utils";
import {Native} from "@/core/native/native.type";
import RhineVarBase from "@/core/var/rhine-var-base.class";
import {ensureNative, ensureNativeOrBasic} from "@/core/utils/var.utils";
import {error} from "@/utils/logger";

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

export function convertArrayProperty<T>(name: string, target: YArray<any>, object: RhineVarBase<any>) {
  
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
    return (...items: any[]): number => {
      for (let i = 0; i < items.length; i++) {
        items[i] = ensureNativeOrBasic(items[i])
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
    return (...items: any[]): number => {
      for (let i = 0; i < items.length; i++) {
        items[i] = ensureNativeOrBasic(items[i])
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
    return (start: number, end?: number): RhineVarBase<any>[] => {
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
    return (start: number, deleteCount: number, ...items: any[]) => {
      const removed = []
      for (let i = start; i < start + deleteCount; i++) {
        let item = target.get(i)
        removed.push(isNative(item) ? (item as Native).toJSON() : item)
      }
      target.delete(start, deleteCount)
      if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          items[i] = ensureNativeOrBasic(items[i])
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
      if (i < 0 || i >= target.length) return undefined as any
      return get(i)
    }
  } else if (name === 'with') {
    return (i: number, value: T[keyof T]): RhineVarBase<any> => {
      if (i < 0) i = target.length + i
      if (i < 0 || i >= target.length) throw 'RangeError: Unexpect index ' + i + ' in RhineVarArray(' + target.length + ')'
      return object
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
  } else if (name === 'filter') {
    return (callback: (item: T[keyof T]) => boolean): T[keyof T][] => {
      let result: T[keyof T][] = []
      for (let i = 0; i < target.length; i++) {
        let item = get(i)
        if (callback(item)) result.push(item)
      }
      return result
    }
  } else if (name === 'some') {
    return (callback: (item: T[keyof T]) => boolean): boolean => {
      for (let i = 0; i < target.length; i++) {
        if (callback(get(i))) return true
      }
      return false
    }
  } else if (name === 'every') {
    return (callback: (item: T[keyof T]) => boolean): boolean => {
      for (let i = 0; i < target.length; i++) {
        if (!callback(get(i))) return false
      }
      return true
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
  } else if (name === 'entries') {
    return (): IterableIterator<[number, T[keyof T]]> => {
      let i = 0;
      return {
        next() {
          if (i < target.length) {
            return {value: [i, get(i++)], done: false}
          } else {
            return {value: undefined, done: true}
          }
        },
        [Symbol.iterator]() {
          return this
        }
      }
    }
  } else if (name === 'keys') {
    return (): IterableIterator<number> => {
      let i = 0
      return {
        next() {
          if (i < target.length) {
            return { value: i++, done: false }
          } else {
            return { value: undefined, done: true }
          }
        },
        [Symbol.iterator]() {
          return this;
        },
      }
    }
  } else if (name === 'values') {
    return (): IterableIterator<T[keyof T]> => {
      let i = 0
      return {
        next() {
          if (i < target.length) {
            return {value: get(i++), done: false}
          } else {
            return {value: undefined, done: true}
          }
        },
        [Symbol.iterator]() {
          return this
        },
      }
    }
  } else if (RHINE_VAR_ARRAY_UNSUPPORTED_PROPERTIES.has(name)) {
    return () => {
      error('Unsupported method "' + name + '" in RhineVarArray. Please call json() to convert to a native JS Array object before proceeding.')
    }
  }
}

export const RHINE_VAR_ARRAY_SUPPORTED_PROPERTIES = new Set<string | symbol>([
  'length',
  'push',
  'pop',
  'unshift',
  'shift',
  'slice',
  'splice',
  'forEach',
  'map',
  'indexOf',
  'includes',
  'at',
  'with',
  'join',
  'filter',
  'some',
  'every',
  'find',
  'findIndex',
  'findLast',
  'findLastIndex',
  'entries',
  'keys',
  'values',
])

export const RHINE_VAR_ARRAY_UNSUPPORTED_PROPERTIES = new Set<string | symbol>([
  'contact',
  'copyWithin',
  'flat',
  'flatMap',
  'reduce',
  'reduceRight',
  'reverse',
  'sort',
  'toReversed',
  'toSorted',
  'toSpliced',
])

