<template>
  <v-row justify='space-around'>
    <v-col cols='auto'>
      <v-dialog
        v-model='dialog'
        transition='dialog-bottom-transition'
      >
        <v-card>
          <v-col v-if='error'>
            <h2>Hata</h2>
            <p>{{ error }}</p>
          </v-col>
          <v-card-text class='text-center'>Şifre : Kapı otomatı ile aynıdır.</v-card-text>
          <v-card-text class='text-center'>ya da</v-card-text>
          <v-card-text class='text-center'>Yönetici şifrenizi giriniz</v-card-text>
          <v-form
            @submit.prevent='login()'
            ref='form'
          >
            <v-text-field
              v-model='password'
              label='Şifre giriniz'
              required
            ></v-text-field>
            <v-card-actions class='justify-end'>
              <v-btn
                type='submit'
                color='success'
                @click='login()'
                :disabled='disabled'
              >
                Giriş
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import { ref } from 'vue'
import {useRouter} from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'LoginPopup',
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const disabled = ref(false)
    const router = useRouter()
    const store = useStore()
    const password = ref('')
    const error = ref('')
    if (store.getters.isLogin){
      if (store.getters.isAdmin){
        router.push('/admin')
      }else {
        router.push('/')
      }
    }
    return {
      password,
      error,
      store,
      disabled,
    }
  },
  methods: {
    login() {
      this.disabled = true
      this.$appAxios.post('user/login', {
        password: this.password
      }).then(response => {
        if (response.data.status === 'success'){
          this.disabled = false
          this.$cookies.set('auth',response.data.token)
          this.store.commit('setAdmin',response.data.user === 'admin')
          this.store.commit('setLogin',true)
          this.$emit('dialog-callback', false)
          this.$router.push(response.data.user === 'admin' ? '/admin' : '/')
        }else {
          this.disabled = false
          this.error = 'Şifre yanlış'
        }
      }).catch(error => {
        this.disabled = false
        this.error = error
      })
    }
  }
}
</script>

<style scoped>

</style>