<template>
  <v-row>
    <v-card class='mx-auto mb-3' max-width='270' max-height='360'>
      <v-col
        cols='12'
        sm='12'
        md='12'
      >
        <v-row class='text-center'>
          <v-radio-group
            v-model='currentSearchType'
            column
          >
            <v-radio
              label='Sene'
              color='red'
              value='sene'
            ></v-radio>
            <v-radio
              label='Daire'
              color='blue'
              value='daire'
            ></v-radio>
          </v-radio-group>
          <v-radio-group
            v-model='currentSearchType'
            column>
            <v-radio
              label='Gider Türü'
              color='grey'
              value='giderTuru'
            ></v-radio>
            <v-radio
              label='Tutar'
              color='green'
              value='tutar'
            ></v-radio>
          </v-radio-group>
          <v-radio
            label='hepsi'
            color='success'
            v-model='currentSearchType'
            value='all'
          ></v-radio>
        </v-row>
      </v-col>
      <v-card-text>Arama türü olarak {{currentSearchType === 'all' ?'hepsi':currentSearchType}} seçili spesifik arama için seçim yapabilirsiniz</v-card-text>
    </v-card>
    <v-card class='mx-auto mb-3' max-width='270' max-height='360'>
      <v-card-text class='text-center'>
        {{unpaidList.length > 0 ? `Şu an toplam ${unpaidList.length} adet ödenmemiş ortak gider bulunmaktadır.`:`Ödenmemiş ortak gider bulunmamaktadır.`}}
      </v-card-text>
      <v-card-text class='text-center'>Not : Fatura görüntülemeyi değiştirebilmek için ilk önce arama kutusunun içeriğini boşaltınız </v-card-text>
    </v-card>
    <v-card class='mx-auto mb-3' max-width='270' max-height='360'>
      <v-card-text class='mb-2'>Arama</v-card-text>
      <v-row justify='center'>
        <v-col
          cols='12'
          sm='12'
          md='12'
        >
          <v-text-field
            v-model='currentSearch'
            label='Arama yap'
            @keyup='onChange()'
          ></v-text-field>
        </v-col>
        <v-col
          cols='8'
          sm='8'
          md='8'
        >
          <v-switch
            @change='emitSide()'
            v-model='selectedIsPaid'
            :label="`${selectedIsPaid ? 'Ödenmiş' : 'Ödenmemiş'} Fatura`"
            :disabled='currentSearch.length > 0'
          ></v-switch>
        </v-col>
        <v-card-text class='text-center'>Şu an {{`${selectedIsPaid ? 'Ödenmiş' : 'Ödenmemiş'} Faturaları`}} görüntülüyorsunuz </v-card-text>
      </v-row>
    </v-card>
  </v-row>
</template>

<script>
import { ref, watch,computed } from 'vue'

export default {
  name: 'Search',
  props: {
    currentList: {
      type: Array,
      required: true
    },
    unpaidList: {
      type: Array,
      required: true
    },
  },
  setup(props, context) {
    const currentSearch = ref('')
    const searchResult = ref([])
    const currentSearchType = ref('daire')
    const selectedIsPaid = ref(false)
    const unpaid = computed(()=> props.currentList.filter(item => !item.odeme))
    watch(currentSearchType, () => {
      // reset search result when search type changes
      currentSearch.value = ''
      searchResult.value = []
      context.emit('currentSearch', '')
      context.emit('searchResult', [])
    })
    return {
      currentSearch,
      searchResult,
      currentSearchType,
      selectedIsPaid
    }
  },
  methods: {
    emitSide() {
      // reset search result when current side changes
      this.$emit('selectedIsPaid', this.selectedIsPaid)
      this.$emit('currentSearch', '')
      this.$emit('searchResult', [])
      this.currentSearch = ''
    },
    onChange() {
      this.searchResult = [] // reset search result
      if (this.currentSearchType === 'all') {
        for (let i = 0; i < this.currentList.length; i++) {
          for (let key in this.currentList[i]) {
            if (key !== 'invoiceId') {
              if (this.currentList[i][key].toString().indexOf(this.currentSearch.toLowerCase()) !== -1) {
                this.searchResult.push(this.currentList[i])
              }
            }
          }
        }
        this.searchResult = Array.from(new Set(this.searchResult)) // remove duplicates
      } else if (this.currentSearchType === 'sene') {
        this.searchResult = this.currentList.filter(item => item.sene.toString().toLowerCase().includes(this.currentSearch.toLowerCase()))
      } else if (this.currentSearchType === 'daire') {
        this.searchResult = this.currentList.filter(item => item.daire.toString().toLowerCase().includes(this.currentSearch.toLowerCase()))
      } else if (this.currentSearchType === 'giderTuru') {
        this.searchResult = this.currentList.filter(item => item.giderTuru.toString().toLowerCase().includes(this.currentSearch.toLowerCase()))
      } else if (this.currentSearchType === 'tutar') {
        this.searchResult = this.currentList.filter(item => item.tutar.toString().toLowerCase().includes(this.currentSearch.toString().toLowerCase()))
      }
      this.$emit('currentSearch', this.currentSearch)
      this.$emit('searchResult', this.searchResult)
    }
  }
}
</script>

<style scoped>

</style>