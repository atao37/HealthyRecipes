import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: ()=>import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: ()=>import('../views/Home.vue'),
    redirect: '/recipes',
    children: [
      {
        path: '/recipes',
        name: 'recipes',
        component: () => import('../views/Recipes.vue')
      },
      {
        path: '/messages',
        name: 'messages',
        component: () => import('../views/Messages.vue')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('../views/User.vue')
      },
      {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/Admin.vue')
      }
    ] 
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
