<template>
  <div>
    <TotalPopup :dialog='TotalPopupDialog' :item='totalPrice'></TotalPopup>
    <List @total='showTotal'></List>
  </div>
</template>

<script>
import List from '../components/List.vue'
import TotalPopup from '../components/TotalPopup.vue'
import {ref} from 'vue';
export default {
  name: 'Home',
  components:{
    TotalPopup,
    List,
  },
  setup(){
    const TotalPopupDialog = ref(false)
    const totalPrice = ref({})
    return {TotalPopupDialog,totalPrice}
  },
  emits: ['total'],
  methods:{
    showTotal(total){
      const {item} = total
      const itemTotal = total.currentList.filter(e => e.daire === item.daire).reduce((acc, cur) => +acc + +cur.tutar, 0)
      this.totalPrice = {
        daire: item.daire,
        borc: +itemTotal,
      }
      this.TotalPopupDialog = true
    }
  }
}
</script>

<style scoped>

</style>