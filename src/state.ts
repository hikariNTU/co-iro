import { atom } from "jotai";
import { getRandomColor } from "./utils";

export const supportAtom = atom(true);
export const currentColorAtom = atom<string>(getRandomColor());
export const historyColorAtom = atom<
  {
    id: string;
    color: string;
  }[]
>([]);
