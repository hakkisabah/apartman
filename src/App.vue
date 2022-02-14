<template>
  <v-app id='inspire'>
    <v-app-bar app>
      <v-col class='col-md-12 text-center'>
        <h3>{{ apartmanAdi }} Apartmanı</h3>
      </v-col>
      <v-divider></v-divider>
      <v-col>
        <v-btn
          v-if='store.getters.isAdmin && store.getters.isLogin'
          color='primary'
          @click='isAdmin()'
        >{{ store.getters.isAdmin && route.path === '/' ? 'Yönetim Paneli' : 'Anasayfa'}}
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          v-if='store.getters.isLogin'
          color='error'
          class='justify-end'
          @click='logout'
        >Çıkış
        </v-btn>
      </v-col>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const store = useStore()
    const apartmanAdi = import.meta.env.VITE_AP_ADI
    return {
      apartmanAdi,
      store,
      route
    }
  },
  methods: {
    isAdmin() {
      if (this.store.getters.isAdmin && this.route.path === '/'){
        this.$router.push('/admin')
      } else if (this.store.getters.isAdmin && this.route.path === '/admin'){
        this.$router.push('/')
      }else {
        this.$router.push('/login')
      }
    },
    logout() {
      this.store.commit('setAdmin', false)
      this.store.commit('setLogin', false)
      this.$cookies.remove('auth')
      this.$router.push('/')
      if (this.route.path === '/'){
        window.location.reload() // tam logout için gerekli
      }
    }
  }
}
</script>
