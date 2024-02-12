import { atom } from "jotai"

export const supportAtom = atom(true)
export const currentColorAtom = atom<string | undefined>(undefined)
export const historyColorAtom = atom<
  {
    id: string
    color: string
  }[]
>([])
