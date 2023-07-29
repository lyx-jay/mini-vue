import { EffectFn, activeEffect, effect } from './effect'

type Reactive = (data: any) => any

const bucketMap = new WeakMap()

/**
 * 依赖收集
 * @param target 被调用的对象
 * @param key key
 * @returns 
 */
function track(target: any, key: string | symbol) {
  if (!activeEffect) {
    return target[key]
  }
  // data 对应的 map 对象
  let depsMap = bucketMap.get(target)
  if (!depsMap) {
    bucketMap.set(target, depsMap = new Map())
  }
  // key 对应的set，set就是副作用函数集合
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, deps = new Set())
  }
  activeEffect.deps.push(deps)
  deps.add(activeEffect)
}
/**
 * 触发副作用函数执行
 */
function trigger(target: any, key: string | symbol, value: any) {
  target[key] = value
  const depsMap = bucketMap.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  
  const effectsToRun = new Set(effects)
  effectsToRun.forEach((effectFn: EffectFn) => effectFn())
}

export const createReactiveObj: Reactive = function (data) {
  return new Proxy(data, {
    // key 就是属性名称
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      trigger(target, key, value)
      return true
    },
  })
}