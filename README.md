# mini-vue

 - [ ] Reactivity
    - [x] reactive
      - [x] 依赖收集与派发更新通知
    - [x] effect
        - [x] 基础effect, 响应式数据变化，重新执行 effect 函数
        - [x] 分支切换与cleanup。当一个响应式数据不被使用，无论其值怎么变化，都不会引起副作用函数重新执行
    - [ ] 调度器
    - [ ] 计算属性-computed
    - [ ] watch


## 知识点

1. 声明一个具有其他属性的函数类型
```ts
interface Fn {
  (): void;
  deps: []
}
const fn: Fn = () => {

}
// fn 是一个函数，同时 fn 上挂载着一个 deps 属性
```

2. set 无限循环问题
在遍历 set 集合的过程中，如果一个值已经被访问过了，但是该值被删除并重新添加到集合中，如果此时遍历还没有结束，那么该值会重新访问。

解决的方法就是构造另外一个 set 集合并遍历它。