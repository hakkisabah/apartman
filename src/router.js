import { createRouter, createWebHistory } from 'vue-router'
import Admin from './views/Admin.vue'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import { useCookies } from 'vue3-cookies'
import { appAxios } from './utils/appAxios'
import store from './store'

const routes = [
  {
    path: '/',
    component: Home,
    beforeEnter:async (to,from,next)=>{
      const checkedAuth = await checkAuth('user')
      if (!checkedAuth && to.path !== '/login') next('/login')
      else next()
    }
  },
  {
    path: '/admin',
    component: Admin,
    beforeEnter:async (to,from,next)=>{
      const checkedAuth = await checkAuth('admin')
      if (!checkedAuth && to.path !== '/login') next('/login')
      else next()
    }
  },
  {
    path: '/login',
    component: Login
  }
]
const { cookies } = useCookies()
const headers = {}
const router = createRouter({
  routes,
  history: createWebHistory()
})
const checkAuth = async (user) => {
  const cookie = cookies.get('auth')
  if (cookie) {
    headers.Authorization = `Bearer ${cookie}`
    try {
      const { data } = await appAxios.post('user/verifytoken',{user},{ headers })
      if (data.status === 'success') {
        store.commit('setAdmin',data.user === 'admin')
        store.commit('setLogin',true)
        return true
      }else {
        cookies.remove('auth')
        return false
      }
    } catch (error) {
      cookies.remove('auth')
      return false
    }
  } else {
    return false
  }
}

export default router