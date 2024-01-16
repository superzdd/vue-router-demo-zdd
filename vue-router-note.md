# Vue Router 纯实现笔记

本笔记从纯实现的角度，记录`Vue Router`在使用中最核心的几个内容，其他细节部分不展开描述

> 下文简称`router`,`Router`或者路由，`Vue Router`写起来太长，尽量节约时间

## Vue Router 的实现架构

### 汇总

要使用`router`，在项目中要实现四个东西，缺一不可：

- [`router`安装](#2.1)
- [`router`对象](#2.2)

  - [router 的配置](#2.2.1)
  - [router 属性 history](#2.2.2)
  - [router 属性 routes](#2.2.3)
  - [router 属性 props](#2.2.4)
  - [router 属性导航守卫](#2.2.5)
  - [router 属性 meta 元信息](#2.2.6)

- [router-link & router-view](#2.3)

### <h3 id="2.1">Vue Router 安装</h3>

`router`不包含在`vue`脚手架项目中，要先安装

```bash
npm i vue-router@4 --save
```

安装完成后，可以在 package.json 文件中，看到`router`的版本信息

```json
// package.json中
"dependencies": {
    "vue": "^3.3.11",
    "vue-router": "^4.2.5"
  },
```

### <h3 id="2.2">Vue Router 对象</h3>

`router`对象，要全局唯一，内含所有路由配置，且被全局`Vue`显示引用。一般引用会发生在`@/main.js`中。

```js
// 全局Vue引用如下：
// @/main.js
import router from "@/router/index.js";
createApp(App).use(router).mount("#app"); // .use(router)是关键
```

```js
// @/router/index.js
// router定义如下：
import { createRouter, createWebHistory } from "vue-router"; // createRouter是关键API

const router = createRouter({
  /* 配置略，后面细讲 */
});

export default router; // router导出，这个名字在main.js中要用
```

#### <h4 id="2.2.1">router 的配置</h4>

先放出项目整个 router 结构，只谈目前用到过的配置，后面会对重点属性进行讲解

```js
const router = createRouter({
  history: createWebHistory(), // 另还有createWebHashHistory，区别在#和部署
  routes, // 看上面const routes = [] 的单独声明
  linkActiveClass: "nav-active", // 潜在的css耦合，@/components/NavigatorView中->#nav a.nav-active
  scrollBehavior(to, from, savedPosition) {
    // router已经配置好的页面滚动事件
    return (
      savedPosition ||
      new Promise((resolve) => {
        setTimeout(
          () =>
            resolve({
              top: 0,
              behavior: "smooth",
            }),
          300
        );
      })
    );
  },
});
```

#### <h4 id="2.2.2">router 属性 history</h4>

`history`共有两种，分别是

- `createWebHistory`，简称 `常规模式`
- `createWebHashHistory`，简称 `hash模式`

两者命名上`createWebHashHistory`多了个`hash`，仅在 URL 表现上有明显的区别，其他地方没有不同：

`createWebHashHistory`会在 URL 中，**自动加入`#`**，且无法删除，比如：

```js
// 基于 https://example.com/folder
// 给出一个 `https://example.com/folder#` 的 URL
createWebHashHistory();
```

##### 两种 History 模式的选择

先说结论：

- 对于独立开发者，推荐`hash模式`。
- 对于大型项目，推荐`常规模式`。
- 其他情况下随意切换，无所谓。

选择主要取决于`#`以及部署这两点上：

1. `hash模式`的`#`会给网站带来歧义，甚至用户会对其产生不信任感。但这也取决于网站的类型以及用户是否敏感，所以只有大型项目，门户网站对此类有严格要求。

2. `常规模式`必须对后台进行额外配置，这对于很多没有后台经验的小伙伴是很不方便的，而`hash模式`就没有这个烦恼，可以直接使用，对网站部署很便利。

如果你想快速部署网站，想立马看到效果（也可能后台没完成开发），而且网站类型也不是特别严肃的，用户也不介意，那`hash模式`是一个很好的方案，甚至是长期方案。

[history 官方文档参考](https://router.vuejs.org/zh/api/interfaces/RouterOptions.html#Properties-history)

#### <h4 id="2.2.3">router 属性 routes</h4>

`routes`是`router`对象的**核心**，其中所有页面的路由配置，是最复杂，修改最频繁的部分。正因如此，`routes`通常被设计在`index.js`的最上方，单独放一块区域，即方便修改，也避免耦合。

```js
// @/router/index.js
// 下面是完整的routes

// 独立的routes配置
// routes是router对象中的核心
// 因为改的多，优先级又高，所以都单独拿出来
// 重点: routes中的内容，会被预先编译，提取重点。比如很多的动态路径，在router对象声明时，会被解析出所有具体的值
const routes = [
  { path: "/", name: "home", component: Home }, // 标准写法
  { path: "/about", name: "about", component: About },
  // path可正则，pathMatch是正则语法，.*代表0个以上未知字符
  // 这个正则语法，可以匹配到所有没有出现在预期URL路径中的URL
  // 比如，/china就会被导到notfound，但是/brazil又能被导到brazil页面
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    // vue-router懒加载，表示这个组件仅在对应URL出现后才会请求该组件的资源
    component: () => import("@/views/NotFound.vue"),
  },
  {
    path: "/destination/:country",
    // 注意前两个标准写法有name属性，但这个动态路由就没有name
    component: () => import("@/views/CountryModel.vue"),
    // 路由参数的回调函数，如果你需要对路由中间的参数(比如URL中restful写法)进行修改，那这就是入口
    // 注意，这里不是用来指定参数，或者传参的地方，仅是对目前已有的参数进行逻辑修改
    // 至于URL中有?的写法，目前我也不清楚是怎么拿的
    props: (route) => ({ ...route.params }),
    // 导航守卫，这里路由守卫是针对单个URL的
    beforeEnter(to, from) {
      console.log(`[country beforeEnter] country is ${to.params.country}`);
      const exist = sourceData.destinations.find(
        (ele) => ele.slug === to.params.country
      );
      if (!exist) {
        return defaultNotFound(to);
      }
    },
    children: [
      {
        path: ":travelPoint",
        name: "experience.show",
        component: () => import("@/views/TravelPointModel.vue"),
        beforeEnter(to, from) {
          console.log(
            `[travel point beforeEnter] country is ${to.params.country}`
          );
          //   const country = to.params.country;
          //   const travelPoint = to.params.travelPoint;

          const { country, travelPoint } = to.params;
          const exist = sourceData.destinations.find(
            (ele) => ele.slug === country
          );
          if (!exist) {
            return defaultNotFound(to);
          }
          const existExp = exist.experiences.find(
            (ele) => ele.slug === travelPoint
          );
          if (!existExp) {
            return defaultNotFound(to);
          }
        },
        props: (route) => ({ ...route.params }),
      },
    ],
  },
];

const router = createRouter({
  routes,
  /** 其他配置，不重要 */
});
```

#### <h4 id="2.2.4">router 属性 props</h4>

比如 URL 路径为

```txt
URL路径
http://localhost:5173/destination/brazil/iguacu-falls
```

那在这个项目的 Country 和 TravelPoint 组件中，分别获取到的 props 为

```txt
[TravelPoint] mounted: {"country":"brazil","travelPoint":"iguacu-falls","routeParams":{"country":"brazil","travelPoint":"iguacu-falls"}}

[Country] mounted: {"country":"brazil","routeParams":{"country":"brazil","travelPoint":"iguacu-falls"}}
```

可以在上述例子中，看到`params`已经帮我们处理好了对象结构（），这都是由于在`routes`声明中所给到的输入：

```json
{
  "path": "/destination/:country",
  "children": [
    {
      "path": ":travelPoint"
    }
  ]
}
```

#### <h4 id="2.2.5">router 属性导航守卫</h4>

导航守卫是 `router` 的一个功能，由于守卫的加入，使得内部信息流转变得十分方便。

守卫可以是全局的，也可以是针对每一个组件的（组件的配置在`route`里）。

1. 全局守卫用法如下:

```js
// 全局前置守卫
router.beforeEach((to, from) => {
  // 最终，全局守卫会用这里的逻辑
  console.log(`[router beforeEach] bbb`);
  return true; // 这里的return不要忘记了，最好加上
});

// --> 注意，加在下面这个地方是不会生效的
const router = createRouter({
  beforeEach(to, from) {
    console.log(`[router beforeEach] aaa`);
    return true;
  },
});
```

2. 组件守卫用法如下：

```js
const routes = [
  {
    // 一级路由的beforeEnter
    beforeEnter(to, from) {
      const exist = sourceData.destinations.find(
        (ele) => ele.slug === to.params.country
      );
      if (!exist) {
        return defaultNotFound(to);
      }
    },
    children: [
      {
        // 二级路由的beforeEnter
        beforeEnter(to, from) {
          const { country, travelPoint } = to.params;
          const exist = sourceData.destinations.find(
            (ele) => ele.slug === country
          );
          if (!exist) {
            return defaultNotFound(to);
          }
        },
      },
    ],
  },
];
```

3. 导航守卫事件们
   导航守卫的事件有很多，比如：

- 全局守卫

  - beforeEach
  - beforeResolve
  - afterEach

- 组件守卫

  - beforeEnter

- 组件内部守卫

  - beforeRouteEnter
  - beforeRouteUpdate
  - beforeRouteLeave

  守卫又有全局的，也有组件内部的，那所有守卫的调用顺序是怎样的呢？
  详见:

[完整的导航解析流程](https://router.vuejs.org/zh/guide/advanced/navigation-guards#%E5%AE%8C%E6%95%B4%E7%9A%84%E5%AF%BC%E8%88%AA%E8%A7%A3%E6%9E%90%E6%B5%81%E7%A8%8B)

#### <h4 id="2.2.6">router 属性 meta 元信息</h4>

`meta`元信息是一种路由专用的信息，可以轻松地附在每一个路由上。
下方代码展示了一个对所有页面打分的示例：

```js
// 页面得分统计
// 每个页面都有单独的分数，这个总分用于统计用户点击了多少页面，一共获取了多少分
// 每个页面的分数放在各自的meta中
let totalScore = 0;

// 主要看meta
const routes = [
  { path: "/", name: "home", component: Home, meta: { score: 1 } },
  { path: "/about", name: "about", component: About, meta: { score: 2 } },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
    meta: { score: 0 },
  },
  {
    path: "/destination/:country",
    component: () => import("@/views/CountryModel.vue"),
    meta: { score: 3 },
    children: [
      {
        path: ":travelPoint",
        name: "experience.show",
        component: () => import("@/views/TravelPointModel.vue"),
        meta: { score: 4 },
      },
    ],
  },
];

router.beforeResolve((to, from) => {
  // 在全局守卫中，将待进入页面的score进行加和
  const { score = 0 } = to.meta;
  totalScore += score;
  console.log(`[router beforeResolve] 加${score}分，当前总分: ${totalScore}`);
  return true;
});
```

### <h3 id="2.3"> router-view & router-link</h3>

关于这两个 html 组件，因为总是配合在一起，所以并在一起说。

- `<router-link>`标签，该标签负责跳转 URL，点击后 URL 就会变化
- `<router-view>`标签，该标签负责响应 URL 的变化，一般一个 URL 只有一个`router-view`对应。

- 项目一旦使用了`router`，那`<router-link>`和`<router-view>`几乎一定会在页面里**同时出现**。

最基础的用法：就是一个`router-link`对应一个`router-view`

深入理解的话，以下这个结论是重点：

```
URL ≠ route.path
即，
一个router-link对应一个router-view
一个URL可对应多个router-link,对应多个router-view
```

从技术实现上：

- `router-link`-->`route.path`上，而每一个`route.path`，其实是`path + child.path + grandson.path`组合到一起的。
- `router-view`-->`route.component`上，从`view`->`component`，即`页面`->`组件`，模糊了一整个 URL 必须渲染一整个页面的概念。

最终：

一个 URL 渲染一个视图被 VueRouter 转化为：

```
一个URL->对应多个Path->渲染多个component
```

下面是项目中的实际例子及代码片段：

```js
// @/router/index.js

// 下面这个URL链接，可以激活两个router-view组件
// http://localhost:xxxx/destination/brazil/iguacu-falls
const routes = [
  {
    // 响应http://localhost:xxxx/destination/brazil/
    path: "/destination/:country",
    component: () => import("@/views/CountryModel.vue"),
    children: [
      {
        // 响应完整链接http://localhost:xxxx/destination/brazil/iguacu-falls
        path: ":travelPoint",
        name: "experience.show",
        component: () => import("@/views/TravelPointModel.vue"),
      },
    ],
  },
];
```

```html
<!-- @/App.vue -->
<!-- App.vue已经是最外层，在这一层里，渲染第一层的router-view -->
<template>
  <!-- NavigatorView里是router-link -->
  <NavigatorView />
  <div>
    <!-- 下面这一行，就是router-view的全部了，非常简单 -->
    <!-- 这一行会映射到CountryModel组件 -->
    <router-view></router-view>
  </div>
</template>

<!-- @/components/NavigatorView.vue -->
<!-- 这里面是一堆APP.vue里用到的router-link -->
<template>
  <div id="nav" class="banner">
    <router-link class="logo" to="/">Home</router-link>
    <router-link
      v-for="item in destinations"
      :key="item.name"
      :to="`/destination/${item.slug}`"
      >{{ item.name }}</router-link
    >
    <router-link to="/about">About</router-link>
  </div>
</template>

<!-- @/views/CountryModel.vue -->
<!-- 下方代码主要体现两个作用 -->
<!-- 1. 渲染APP.vue中所对应的router-link链接 -->
<!-- 2. 准备下一层的router-link和router-view -->
<template>
  <!-- container里面渲染Country的相关内容 -->
  <div class="container">
    <!-- 详细页面内容省略。。。 -->
    <!-- 准备下一层的router-link和router-view -->
    <router-link
      v-for="exp in destination.experiences"
      :key="exp.slug"
      :to="{
            name: 'experience.show',
            params: { country: country.slug, travelPoint: exp.slug },
          }"
      ><CountryDetail :exp="exp"></CountryDetail>
    </router-link>
    <router-view></router-view>
  </div>
</template>
```

## Router 能带来什么好处?

`router`带来的好处，是当网站 URL 在变化时，页面可以瞬间响应 URL 变化。这点相比传统页面进步了很多，使得整个网站的体验能更接近 APP 应用。传统页面则不一样，一旦 URL 地址刷新，页面就会变白，然后重新渲染，这是因为 URL 变了，所有的资源要重新请求并下载资源。

其实`Vue`原本不需要使用路由，而且`Vue`本身属于 SPA(Single Page Application)，即所有的内容其实都可以只呈现在一个 URL 里面，当前许多手机 H5 也是一样的，把所有功能做在一个页面里就行了。而且手机 H5 属于轻量级功能，整个页面的逻辑串起来很简单，所有内容都放在一个页面里，每次都从头体验效果反而很好。但对于大型网站来讲就不够了，大型网站内容多信息杂，如果不分门别类放好，那同时从一个入口进去会出现很大的问题，比如入口流量拥挤，操作流程拉长，消耗冗余网络资源等等，所以为了契合大型网站的使用方式，路由随即产生。不仅如此，路由加入的无刷新的操作模式将极大得改善整个门户的操作体验，用户不再需要等待页面变白这样的刷新形式，整体体验上也更接近与应用程序，这点对于 HTML 的泛用性是很重要的。

**Q**: `router`乍看起来，和`slot`想要实现的效果差不多，但为什么还要有`router`?

**A**: 因为`router`有一个很重要的功能，是 slot 无法替代的：

- `router`能响应 URL 地址的变化，相当于对比`slot`,`router`已经封装了对 URL 的处理逻辑。
- 这个对于 URL 地址逻辑的出现，使`router`在概念上，更偏向于一个网站的所有页面，而`slot`只能偏向于某一个页面。
