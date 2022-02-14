<template>
  <EditDialog
    @isDialogOpen='isDialogOpen = $event'
    :dialog='isDialogOpen'
    :item='selectedItem'
    v-if='isDialogOpen'></EditDialog>
  <List v-if='!isDialogOpen' @edit='dialog'></List>
</template>

<script>
import { ref } from 'vue'
import EditDialog from './EditDialog.vue'
import Search from './Search.vue'
import List from './List.vue'

export default {
  name: 'EditInvoice',
  components: { Search, EditDialog, List },
  emits:['edit','isDialogOpen'],
  setup() {
    const isDialogOpen = ref(false)
    const selectedItem = ref({})
    return {
      isDialogOpen,
      selectedItem
    }
  },
  methods: {
    dialog(item) {
      this.selectedItem = item
      this.isDialogOpen = true
    }
  }
}
</script>

<style scoped>

</style>