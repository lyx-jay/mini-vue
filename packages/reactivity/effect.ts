// export interface ActiveEffect {
//   deps: any[],
//   fn: Function
// }

export interface EffectFn {
  (): void;
  deps: any[]
}

export let activeEffect:EffectFn
export function cleanup(effectFn:any) {
  effectFn.deps.forEach(deps => {
    deps.delete(effectFn)
  })
  // 将数组长度置为0
  effectFn.deps.length = 0
}

export const effect = (fn: Function) => {
  const effectFn: EffectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    fn()
  }
  effectFn.deps = []
  effectFn()

}