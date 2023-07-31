
export interface EffectFn {
  (): void;
  deps: any[],
  options?: EffectOptions
}

export interface EffectOptions {
  scheduler?: (fn: EffectFn) => void
}

export let activeEffectStack: EffectFn[] = []
export let activeEffect: EffectFn
export function cleanup(effectFn: any) {
  effectFn.deps.forEach(deps => {
    deps.delete(effectFn)
  })
  // 将数组长度置为0
  effectFn.deps.length = 0
}

export const effect = (fn: Function, options?: EffectOptions) => {
  const effectFn: EffectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    activeEffectStack.push(effectFn)
    fn()
    activeEffectStack.pop()
    activeEffect = activeEffectStack[activeEffectStack.length - 1]
  }
  effectFn.deps = []
  effectFn.options = options
  effectFn()
}