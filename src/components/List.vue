<template>
  <div class='mt-5 mb-5'>
    <v-overlay :model-value="overlay" class="align-center justify-center">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <Search @selectedIsPaid='selectedIsPaid = $event'
            :current-list='currentList'
            :unpaidList='odenmemis'
            @currentSearch='currentSearch = $event'
            @searchResult='searchResult = $event'></Search>
  </div>
  <Table @total='$emit("total",{currentList, item:$event})' @edit='$emit("edit",$event)' :desserts='currentSearch.length > 0 ? searchResult:currentList' :is-paid='selectedIsPaid'></Table>
</template>

<script>
import { ref, computed } from 'vue'
import Table from './Table.vue'
import Search from './Search.vue'

export default {
  name: 'List',
  components: { Table, Search },
  emits: ['edit', 'selectedIsPaid', 'currentSearch', 'searchResult', 'total'],
  setup() {
    const overlay = ref(true)
    const currentSearch = ref('')
    const searchResult = ref([])
    const selectedIsPaid = ref(false)
    const currentSearchType = ref('all')
    const odenmemis = ref([])
    const odenmis = ref([])
    const currentList = computed(() => selectedIsPaid.value ? odenmis.value : odenmemis.value)
    return {
      odenmemis,
      odenmis,
      currentSearch,
      searchResult,
      currentSearchType,
      currentList,
      selectedIsPaid,
      overlay,
    }
  },
  async mounted() {
    const headers = {
      Authorization: `Bearer ${this.$cookies.get("auth")}`
    }
    await this.$appAxios.get('getitems',{headers}).then(res => {
      this.overlay = false
      this.odenmemis = res.data.filter(item => +item.odeme < 1)
      this.odenmis = res.data.filter(item => +item.odeme > 0)
    })
  }
}
</script>

<style scoped>

</style>