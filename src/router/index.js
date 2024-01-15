/**
 * 路由配置中心，router/index.js，这个文件夹方式和文件名需要在有vue router的项目中固定下来
 * >>>>createRouter<<<<方法是核心中的核心，其中包含了Router的所有配置和关键信息
 */

import { createRouter, createWebHistory } from "vue-router";
import sourceData from "@/data.json";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";

let defaultNotFound = function (to) {
  return {
    name: "notfound",
    params: { pathMatch: to.path.split("/").slice(1) },
    query: to.query,
    hash: to.hash,
  };
};

// 页面得分统计
// 每个页面都有单独的分数，这个总分用于统计用户点击了多少页面，一共获取了多少分
// 每个页面的分数放在各自的meta中
let totalScore = 0;

// routes是router对象中的核心
// 因为改的多，优先级又高，所以都单独拿出来
// 重点: routes中的内容，会被预先编译，提取重点。比如很多的动态路径，在router对象声明时，会被解析出所有具体的值
const routes = [
  { path: "/", name: "home", component: Home, meta: { score: 1 } }, // 标准写法
  { path: "/about", name: "about", component: About, meta: { score: 2 } },
  // path可正则，pathMatch是正则语法，.*代表0个以上未知字符
  // 这个正则语法，可以匹配到所有没有出现在预期url路径中的url
  // 比如，/china就会被导到notfound，但是/brazil又能被导到brazil页面
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    // vue-router懒加载，表示这个组件仅在对应url出现后才会请求该组件的资源
    component: () => import("@/views/NotFound.vue"),
    meta: { score: 0 },
  },
  {
    path: "/destination/:country",
    component: () => import("@/views/CountryModel.vue"),
    // 路由参数的回调，如果你需要对路由中间的参数(比如url中?后面的部分，或者restful写法)进行修改，那这就是入口
    // 注意，这里不是用来指定参数，或者传参的地方，仅是对目前已有的参数进行逻辑修改
    props: (route) => ({ ...route.params }),
    meta: { score: 3 },
    // 导航守卫，这里路由守卫是针对单个url的
    beforeEnter(to, from) {
      console.log(`[beforeEnter] country is ${to.params.country}`);
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
        meta: { score: 4 },
        beforeEnter(to, from) {
          console.log(`[beforeEnter] country is ${to.params.country}`);
          // const country = to.params.country;
          // const travelPoint = to.params.travelPoint;
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
  history: createWebHistory(), // 另还有createWebHashHistory，区别在#和部署
  routes, // 看上面const routes = [] 的单独声明
  linkActiveClass: "nav-active", // 潜在的css耦合，NavigatorView.vue中->#nav a.nav-active
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

router.beforeEach((to, from) => {
  // 这里没有必要的业务要做，只是标明全局守卫的地方
  console.log(`[router beforeEach] 全局前置守卫`);
  // 下面这个return语句，true代表通过，反之为false，不通过
  // 不通过是指URL会变，但是页面不会跳转过去
  // 如果始终为true，那直接注释也没试
  return true;
});

router.beforeResolve((to, from) => {
  const { score = 0 } = to.meta;
  totalScore += score;
  // 这里没有必要的业务要做，只是标明全局守卫的地方
  console.log(`[router beforeResolve] 加${score}分，当前总分: ${totalScore}`);
  // 下面这个return语句，true代表通过，反之为false，不通过
  // 不通过是指URL会变，但是页面不会跳转过去
  // 如果始终为true，那直接注释也没试
  return true;
});

export default router;
