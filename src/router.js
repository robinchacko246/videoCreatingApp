import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Upload from './views/Upload.vue'
import Gallery from './views/Gallery.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: Gallery
    }

  ]
})
