

export function replaceTop<T extends string>(stack: T[], screen: T): T[] {
  if (stack.length === 0) return [screen];
  if (stack[stack.length - 1] === screen) return stack;
  return [...stack.slice(0, -1), screen];
}
