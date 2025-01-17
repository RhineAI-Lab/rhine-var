import {Text as YText} from "yjs";

export function rhineText(defaultValue: string) {
  const yText = new YText()
  yText.insert(0, defaultValue)
  return yText
}
