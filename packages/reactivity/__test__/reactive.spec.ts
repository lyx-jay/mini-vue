import {it, expect} from 'vitest'
import { createReactiveObj } from '../reactive'

it('reactive-basic', () => {
  const p = createReactiveObj({
    a: 1
  })
  expect(p.a).toBe(1)
})