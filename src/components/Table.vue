<template>
<div>
  <v-table
    fixed-header
    height='300x'
    v-if='desserts.length > 0'
  >
    <thead>
    <tr>
      <th class='text-center'>
        <h3>Dönem</h3>
      </th>
      <th class='text-center'>
        <h3>Sene</h3>
      </th>
      <th class='text-center'>
        <h3>Daire</h3>
      </th>
      <th class='text-center'>
        <h3>Gider Türü</h3>
      </th>
      <th class='text-center'>
        <h3>Tutar</h3>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
      v-for='item in desserts'
      :key='item.invoiceId'
      @click='selectInvoice(item,$event)'
      style='cursor:pointer;'
    >
      <td class='text-center'>{{ item.donem }}
        <a class='text-decoration-none' :href="getItemFileLink(item.invoiceId)"
        >
          <v-icon
            small
            ref='download'
          >
            mdi-download
          </v-icon>
        </a>

      </td>
      <td class='text-center'>{{ item.sene }}</td>
      <td class='text-center'>{{ item.daire }}</td>
      <td class='text-center'>{{ item.giderTuru }}</td>
      <td class='text-center'>{{ item.tutar }}
        <v-icon
          small
          :color="+item.odeme > 0 ?'teal':'error'"
        >
          {{ +item.odeme > 0 ? 'mdi-check' : 'mdi-alert-circle' }}
        </v-icon>
      </td>
    </tr>
    </tbody>
  </v-table>
  <div v-else class='text-center mt-5'>
    <h3>{{whichList}}</h3>
  </div>
</div>
</template>

<script>
import { computed } from 'vue';
export default {
  name: 'Table',
  props: {
    desserts: {
      type: Array,
      required: true
    },
    isPaid:{
      type: Boolean,
      required: true
    },
  },
  setup(props){
    const whichList = computed(()=> `${props.isPaid ? 'Ödenmiş' : 'Ödenmemiş'} listesi boş, değiştirmek için geçiş tuşunu kullanınız.`)
    return {
      whichList
    }
  },
  methods:{
    selectInvoice(item, event){
      // Exclude download icon
      const isDownload = event.target.className.split(' ').includes('mdi-download')
      if (!isDownload) {
        this.$emit('edit', item)
      }
    },
    getItemFileLink(invoiceId){
      const item = this.desserts.find(item => item.invoiceId === invoiceId)
      return`${import.meta.env.VITE_FILE_URL_BASE}${item.giderTuru}-${item.donem}-${item.sene}.pdf`.toLowerCase()
    },
  },
}
</script>

<style scoped>

</style>