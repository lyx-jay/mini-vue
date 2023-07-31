import { describe, expect, it, vi } from 'vitest'
import { effect } from '../effect'
import { createReactiveObj } from '../reactive'

it('effect-obj contains one property', () => {

  let dummy: number
  const counter = createReactiveObj({ num: 1 })
  const spyFn = vi.fn(() => { dummy = counter.num })

  effect(spyFn)
  expect(dummy).toBe(1)
  expect(spyFn).toHaveBeenCalledTimes(1)

  counter.num = 2
  expect(dummy).toBe(2)
  expect(spyFn).toHaveBeenCalledTimes(2)

})

it('set a noexisted property in reactive obj', () => {

  let dummy: number = 0
  const counter = createReactiveObj({ num: 1 })
  const spyFn = vi.fn(() => {
    dummy = counter.num
  })

  effect(spyFn)
  expect(dummy).toBe(1)
  expect(spyFn).toHaveBeenCalledTimes(1)

  counter.ok = true
  expect(dummy).toBe(1)
  expect(spyFn).toHaveBeenCalledTimes(1)

})


it('分支切换', () => {

  let dummy: number = 0
  const counter = createReactiveObj({ num: 1, ok: true })
  const spyFn = vi.fn(() => {
    dummy = counter.ok ? counter.num : dummy
  })

  effect(spyFn)
  expect(dummy).toBe(1)
  expect(spyFn).toHaveBeenCalledTimes(1)

  counter.ok = false
  expect(spyFn).toHaveBeenCalledTimes(2)

  counter.num = 2
  expect(spyFn).toHaveBeenCalledTimes(2)

})

describe('嵌套effect', () => {
  let dummy1: number = -1
  let dummy2: number = -2

  const counter = createReactiveObj({ num1: 1, num2: 2 })

  const spyFn2 = vi.fn(function effect2() {
    dummy2 = counter.num2
  })

  const spyFn1 = vi.fn(function effect1() {
    effect(spyFn2)
    dummy1 = counter.num1
  })

  it('init', () => {
    effect(spyFn1)

    expect(spyFn1).toHaveBeenCalledTimes(1)
    expect(spyFn2).toHaveBeenCalledTimes(1)
  })

  it('外层嵌套函数执行', () => {
    counter.num1 = 3
    expect(spyFn1).toHaveBeenCalledTimes(2)
    expect(spyFn2).toHaveBeenCalledTimes(2)
  })

  it('内层嵌套函数执行', () => {
    counter.num2 = 3
    expect(spyFn1).toHaveBeenCalledTimes(2)
    expect(spyFn2).toHaveBeenCalledTimes(4)
  })
})


it('无限循环effect执行', () => {

  const counter = createReactiveObj({ num: 1 })
  const spyFn = vi.fn(() => {
    counter.num++
  })

  effect(spyFn)
  expect(spyFn).toHaveBeenCalledTimes(1)

})


describe('调度执行', () => {
  const counter = createReactiveObj({ num: 1 })
  const spyFn1 = vi.fn(() => {
    console.log('[info]:', '副作用函数执行', `num: ${counter.num}`)
  })
  const spyFn2 = vi.fn(() => {
    console.log('对照函数执行了')
  })
  // it('副作用函数执行时机', () => {
  //   effect(spyFn1)
  //   expect(spyFn1).toHaveBeenCalledTimes(1)

  //   counter.num++
  //   spyFn2()
  // })

  it('副作用函数执行时机', () => {
    effect(spyFn1, {
      scheduler: (fn) => {
        setTimeout(fn);
      }
    })
    counter.num++
    spyFn2()
  })
})
