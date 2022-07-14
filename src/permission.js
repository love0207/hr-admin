import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
const whiteList = ['/login', '/404'] // 白名单
// to 去哪 from 来自哪里 next放行
// 前置路由守卫
router.beforeEach((to, from, next) => {
  NProgress.start() // 开启进度效果
  const token = store.state.user.token
  if (token) { // 如果有token
    if (to.path === '/login') {
      NProgress.done()
      next('/')// 再去login页面，直接跳转到‘/’
    } else {
      if (!store.state.user.userInfo.id) { // 判断当没有这个数据时，才发ajax
        store.dispatch('user/getInfo')// 发ajax拿数据
      }
      next()// 去其它页面，直接放行
    }
  } else { // 没有token
    if (whiteList.includes(to.path)) { // 去白名单页面   includes看whitList是否包含
      next()// 放行
    } else { // 去其他页面
      next('login')// 跳转到login页面
    }
  }
})
// 后置路由守卫
router.afterEach(() => {
  // 结束进度效果
  NProgress.done()
})
