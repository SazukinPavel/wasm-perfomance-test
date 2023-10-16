import { createRouter, createWebHashHistory } from 'vue-router'

const MainView = import('@/views/Main.vue')

const routes = [{ path: '/', component: MainView }]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
