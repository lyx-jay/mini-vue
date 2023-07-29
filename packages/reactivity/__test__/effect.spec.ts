import { expect, it, vi } from 'vitest'
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
  const counter = createReactiveObj({ num: 1 , ok: true})
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