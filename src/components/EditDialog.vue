<template>
  <v-overlay :model-value='overlay' class='align-center justify-center'>
    <v-progress-circular
      indeterminate
      size='64'
    ></v-progress-circular>
  </v-overlay>
  <h2>"{{ item.daire }}" numaralı daireye işlem yapmaktasınız</h2>
  <hr>
  <v-col v-if='error'>
    <h2>Hata</h2>
    <p>{{ error }}</p>
  </v-col>
  <v-card class='text-center'>
    <v-col cols='12' class='mt-3'>
      <label for='standard-select' class='text-center'>Tür seç</label>
      <div class='select mt-1' style='--select-border: gray; --select-focus: gray'>
        <select name='tur' @change='setTur' v-model='item.giderTuru' id='standard-select'
                :disabled='fileLocked'>
          <option v-for='t in tur' :value='t'>{{ t }}</option>
        </select>
        <span class='focus'></span>
      </div>
    </v-col>
    <v-col cols='12'>
      <div v-if='fileLockedBefore'>
        <h4>Şu an "{{ currentItemFileName }}" isimli dosya yüklü</h4>
        <h4>Yükleme yapmak için <strong @click='openFileInput()' style='cursor: pointer'>tıklayınız</strong>
        </h4>
        <h4>NOT: Yükleme yapmadan donem, sene ve tür bilgileri açılmaz.</h4>
      </div>
      <div v-else>
        <h3>Yüklenecek Dosyayı Seçiniz</h3>
        <v-file-input
          class='mt-1'
          accept='application/pdf'
          placeholder='Yüklenecek dosyayı seçin'
          prepend-icon='mdi-camera'
          label='Dosya'
          @change='setImage'
          :disabled='fileLockedBefore'
        ></v-file-input>
      </div>
    </v-col>
    <v-col cols='12'>
      <h3>Dönem(Ay)</h3>
      <v-text-field
        v-model='item.donem'
        hide-details
        single-line
        type='number'
        :disabled='fileLocked'
      />
    </v-col>
    <v-col cols='12'>
      <h3>Sene</h3>
      <v-text-field
        v-model='item.sene'
        hide-details
        single-line
        type='number'
        :disabled='fileLocked'
      />
    </v-col>
    <v-col cols='12'>
      <h3>Toplam Tutar</h3>
      <v-text-field
        v-model='item.tutar'
        hide-details
        single-line
        type='number'
      />
    </v-col>
    <v-col cols='12' sm='12' md='12'>
      <v-row>
        <v-card-actions>
          <v-col cols='1' class='mx-auto'>
            <v-checkbox
              v-model='odemeDurum'
              :label="`Ödeme : ${odemeDurum ? 'Ödenmiş' : 'Ödenmemiş'}`"
            ></v-checkbox>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols='4' sm='4' md='4'>
            <v-btn
              class='mb-3'
              color='error'
              text
              @click='deleteConfirmation = true'
            >
              Sil
            </v-btn>
            <v-btn
              class='mb-3'
              color='blue-darken-1'
              text
              @click='$emit("isDialogOpen", false)'
            >
              Kapat
            </v-btn>
            <v-btn
              class='mb-3'
              color='success'
              text
              @click='updateItem()'
            >
              Kaydet
            </v-btn>
          </v-col>
        </v-card-actions>
        <Confirm v-if='deleteConfirmation' @delete-confirmation='donemSil' :item='item' :dialog='deleteConfirmation'></Confirm>
      </v-row>
    </v-col>
  </v-card>
</template>

<script>
import { ref, watchEffect } from 'vue'
import Confirm from './Confirm.vue'

export default {
  name: 'EditDialog',
  components: { Confirm },
  props: {
    item: {
      type: Object,
      required: true
    },
    dialog: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  emits: ['isDialogOpen'],
  setup(props) {
    const deleteConfirmation = ref(false)
    const overlay = ref(false)
    const odemeDurum = ref(+props.item.odeme > 0 ? true : false)
    const fileLocked = ref(true)
    const fileLockedBefore = ref(true)
    const error = ref('')
    const tur = ['otomat', 'diger']
    const currentItemFileName = `${props.item.giderTuru}-${props.item.donem}-${props.item.sene}.pdf`.toLowerCase()
    watchEffect(() => {
      if (!props.dialog) {
        fileLocked.value = true
      }
    })
    return { tur, error, currentItemFileName, fileLocked, odemeDurum, fileLockedBefore, overlay,deleteConfirmation }
  },
  methods: {
    donemSil(confirmation){
      this.deleteConfirmation = false
      if (confirmation){
        this.overlay = true
        const headers = {
          Authorization: `Bearer ${this.$cookies.get('auth')}`
        }
        const vm = this
        this.$appAxios.post(`${import.meta.env.VITE_SITE_API_URL}deleteitem`, {invoiceId:this.item.invoiceId}, { headers })
          .then(() => {
            this.overlay = false
            alert('Başarılı')
            setTimeout(() => {
              vm.$emit('isDialogOpen', false)
            }, 500)
          })
          .catch(err => {
            this.overlay = false
            this.error = err
            alert('Hata')
            window.scrollTo(0, 0)
          })
      }
    },
    updateItem() {
      this.overlay = true
      const headers = {
        Authorization: `Bearer ${this.$cookies.get('auth')}`
      }
      const vm = this
      const formData = new FormData()
      if (this.item.sampleFile) {
        formData.append('file', this.item.sampleFile, 'sampleFile') // if new file is selected
      } else {
        formData.append('sampleFile', '') // we need to send an empty property if no file is selected
      }
      formData.append('invoiceId', this.item.invoiceId)
      formData.append('giderTuru', this.item.giderTuru)
      formData.append('donem', this.item.donem)
      formData.append('sene', this.item.sene)
      formData.append('daire', this.item.daire)
      formData.append('tutar', this.item.tutar)
      formData.append('odeme', this.odemeDurum ? 1 : 0)
      this.$appAxios.post(`${import.meta.env.VITE_SITE_API_URL}updateitem`, formData, { headers })
        .then(() => {
          this.overlay = false
          alert('Başarılı')
          setTimeout(() => {
            vm.$emit('isDialogOpen', false)
          }, 500)
        })
        .catch(err => {
          this.overlay = false
          this.error = err
          alert('Hata')
          window.scrollTo(0, 0)
        })
    },
    openFileInput() {
      this.fileLockedBefore = false
    },
    setImage(e) {
      this.item.sampleFile = e.target.files[0]
      this.fileLocked = false
    },
    setTur(e) {
      this.item.giderTuru = e.target.value
    }
  }
}
</script>

<style>
.v-overlay-scroll-blocked {
  padding-inline-end: 0 !important;
}
</style>