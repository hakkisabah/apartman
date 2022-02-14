import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import { appAxios } from './utils/appAxios'
import VueCookies from 'vue3-cookies'
import store from './store'

loadFonts()

const app = createApp(App)
  .use(vuetify)
  .use(router)
  .use(VueCookies)
  .use(store)
app.provide('$appAxios', appAxios); // for use in setup()
app.config.globalProperties.$appAxios = appAxios
app.mount('#app')
