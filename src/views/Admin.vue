<template>
  <div data-app>
    <div class='mt-5'>
      <AdminMenu @changePage='setPage'></AdminMenu>
    </div>
    <v-container class='text-center'>
      <NewInvoice @AfterUpload='currentPage = $event' v-if='currentPage === "NewInvoice"'></NewInvoice>
      <EditInvoice v-else-if='currentPage === "EditInvoice"'></EditInvoice>
    </v-container>
  </div>
</template>

<script>
import NewInvoice from '../components/NewInvoice.vue'
import AdminMenu from '../components/AdminMenu.vue'
import EditInvoice from '../components/EditInvoice.vue'
import { ref } from 'vue'
export default {
  name: 'Admin',
  components: { EditInvoice, AdminMenu, NewInvoice },
  emits: ['changePage'],
  setup() {
    const currentPage = ref('NewInvoice')
    return { currentPage }
  },
  methods: {
    setPage(page) {
      this.currentPage = page
    }
  }
}
</script>

<style scoped>

</style>