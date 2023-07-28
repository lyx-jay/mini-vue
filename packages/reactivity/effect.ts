export let activeEffectFn: Function | null

export const effect = (fn: Function) => {
  activeEffectFn = fn
  fn()
}