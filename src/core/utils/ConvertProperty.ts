import {Array as YArray} from "yjs";
import RhineVar from "@/core/proxy/RhineVar";
import {ensureRhineVar} from "@/core/utils/DataUtils";
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

export function convertArrayProperty<T>(name: string, target: YArray<T>, object: RhineVar<T>) {
  if (name === 'length') {
    return target.length
  } if (name === 'push') {
    return (item: T | RhineVar<T>): number => {
      item = ensureRhineVar(item)
      if (item instanceof RhineVar) {
        target.push([item.native as T])
      } else {
        target.push([item])
      }
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
