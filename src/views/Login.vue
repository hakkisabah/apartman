<template>
  <LoginPopup @dialogCallback='dialog = $event' :dialog='dialog'></LoginPopup>
</template>

<script>
import LoginPopup from '../components/LoginPopup.vue'
import { ref } from 'vue'

export default {
  name: 'Login',
  components: { LoginPopup },
  emits: ['dialogCallback', 'dialog'],
  setup() {
    const dialog = ref(true)
    return {
      dialog
    }
  },
}
</script>

<style scoped>

</style>