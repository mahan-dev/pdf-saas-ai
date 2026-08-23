import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToAscii = (inputString: string) => {
  // * Remove non ascii characters

  return inputString.replace(/[^\x00-\x7f]+/g, "");
};
