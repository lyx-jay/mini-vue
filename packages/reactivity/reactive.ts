import { activeEffectFn } from './effect'

type Reactive = (data: any) => any

const bucketMap = new WeakMap()

export const createReactiveObj: Reactive = function (data) {
  return new Proxy(data, {
    // key 就是属性名称
    get(target, key) {
      if (!activeEffectFn) {
        return target[key]
      }
      // data 对应的 map 对象
      let depsMap = bucketMap.get(data)
      if (!depsMap) {
        bucketMap.set(data, depsMap = new Map())
      }
      // key 对应的set，set就是副作用函数集合
      let deps = depsMap.get(key)
      if (!deps) {
        depsMap.set(key, deps = new Set())
      }
      deps.add(activeEffectFn)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      const depsMap = bucketMap.get(target)
      if (!depsMap) return
      const deps = depsMap.get(key)
      deps && deps.forEach(fn => fn())
      return true
    },
  })
}