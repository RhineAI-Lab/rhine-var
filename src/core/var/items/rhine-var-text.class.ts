import RhineVarBase from "@/core/var/rhine-var-base.class";
import { NativeType } from "@/core/native/native-type.enum";

export default class RhineVarText extends RhineVarBase implements Iterable<string> {

  type: NativeType.Text = NativeType.Text

  value: string = ""

  length: number = 0

  set(value: string) {
  }

  get(start: number, end: number): string {
    return ""
  }

  insert(value: string, index: number) {

  }

  delete(start: number, end: number) {

  }

  clear() {

  }

  charAt(index: number): string {
    return ""
  }

  charCodeAt(index: number): number {
    return 0
  }

  concat(...strings: string[]): string {
    return ""
  }

  indexOf(searchValue: string, fromIndex?: number): number {
    return 0
  }

  lastIndexOf(searchValue: string, fromIndex?: number): number {
    return 0
  }

  match(regexp: RegExp): RegExpMatchArray | null {
    return null
  }

  replace(searchValue: string | RegExp, replaceValue: string): string {
    return ""
  }

  search(regexp: RegExp): number {
    return 0
  }

  slice(start?: number, end?: number): string {
    return ""
  }

  split(separator: string | RegExp, limit?: number): string[] {
    return []
  }

  substr(start: number, length?: number): string {
    return ""
  }

  substring(start: number, end?: number): string {
    return ""
  }

  toLowerCase(): string {
    return ""
  }

  toUpperCase(): string {
    return ""
  }

  trim(): string {
    return ""
  }

  trimStart(): string {
    return ""
  }

  trimEnd(): string {
    return ""
  }

  padStart(targetLength: number, padString?: string): string {
    return ""
  }

  padEnd(targetLength: number, padString?: string): string {
    return ""
  }

  includes(searchString: string, position?: number): boolean {
    return false
  }

  startsWith(searchString: string, position?: number): boolean {
    return false
  }

  endsWith(searchString: string, position?: number): boolean {
    return false
  }

  repeat(count: number): string {
    return ""
  }

  valueOf(): string {
    return ""
  }

  toString(): string {
    return ""
  }

  toLocaleString(): string {
    return ""
  }

  [Symbol.iterator](): IterableIterator<string> {
    return {} as IterableIterator<string>
  }

}
