<template>
  <v-row>
    <v-overlay :model-value='overlay' class='align-center justify-center'>
      <v-progress-circular
        indeterminate
        size='64'
      ></v-progress-circular>
    </v-overlay>
    <v-col v-if='error'>
      <h2>Hata</h2>
      <p class='err'>{{ error }}</p>
    </v-col>
    <v-col cols='12'>
      <label for='standard-select' class='text-center'>Tür seç</label>
      <div class='select mt-1' style='--select-border: gray; --select-focus: gray'>
        <select name='tur' @change='setTur' v-model='giderTuru' id='standard-select'>
          <option v-for='t in tur' :value='t'>{{ t }}</option>
        </select>
        <span class='focus'></span>
      </div>
    </v-col>
    <v-col cols='12'>
      <h3>Yüklenecek Dosyayı Seçiniz</h3>
      <v-file-input
        ref='uploadfileinput'
        class='mt-1'
        accept='application/pdf'
        placeholder='Yüklenecek dosyayı seçin'
        prepend-icon='mdi-camera'
        label='Dosya'
        @change='setImage'
      >
      </v-file-input>
    </v-col>
    <v-col cols='12'>
      <h3>Dönem(Ay)</h3>
      <v-text-field
        v-model='donem'
        hide-details
        single-line
        type='number'
      />
    </v-col>
    <v-col cols='12'>
      <h3>Sene</h3>
      <v-text-field
        v-model='sene'
        hide-details
        single-line
        type='number'
      />
    </v-col>
    <v-col cols='12'>
      <h3>Toplam Tutar</h3>
      <v-text-field
        v-model='tutar'
        hide-details
        single-line
        type='number'
      />
    </v-col>
    <v-col cols='12'>
      <v-btn
        color='blue darken-1'
        text
        @click='submit'
      >
        Kaydet
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'NewInvoice',
  setup() {
    const overlay = ref(false)
    const error = ref(null)
    const sampleFile = ref(null)
    const giderTuru = ref('otomat')
    const donem = ref(new Date().getMonth() + 1)
    const sene = ref(new Date().getFullYear())
    const tutar = ref()
    const formisOk = computed(() => {
      return (
        sampleFile.value &&
        donem.value &&
        sene.value &&
        tutar.value
      )
    })
    const tur = ['otomat', 'diger']
    return { sampleFile, giderTuru, donem, sene, tutar, tur, error, overlay,formisOk }
  },
  methods: {
    setImage(e) {
      this.sampleFile = e.target.files[0]
    },
    async submit() {
      if (!this.formisOk) {
        this.error = 'Tüm alanları doldurmanız gerekli.'
        window.scrollTo(0, 0)
        setTimeout(() => {
          this.error = null
        }, 3000)
        return
      }
      this.overlay = true
      const headers = {
        Authorization: `Bearer ${this.$cookies.get('auth')}`
      }
      const formData = new FormData()
      formData.append('file', this.sampleFile, 'sampleFile')
      formData.append('giderTuru', this.giderTuru)
      formData.append('donem', this.donem)
      formData.append('sene', this.sene)
      formData.append('tutar', this.tutar)
      this.$appAxios.post(`${import.meta.env.VITE_SITE_API_URL}additem`, formData, { headers })
        .then(() => {
          this.overlay = false
          this.$refs.uploadfileinput.click() // reset file input
          this.donem = new Date().getMonth() + 1
          this.sene = new Date().getFullYear()
          this.tutar = null
          alert('Başarılı')
          window.scrollTo(0, 0)
        })
        .catch(err => {
          this.overlay = false
          this.error = err
          alert('Hata')
        })
    },
    setTur(e) {
      this.giderTuru = e.target.value
    }
  }
}
</script>

<style lang='scss'>
select {

  appearance: none;
  background-color: transparent;
  border: none;
  padding: 0 1em 0 0;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;


  z-index: 1;


  &::-ms-expand {
    display: none;
  }

  outline: none;
}

.select {
  display: grid;
  grid-template-areas: "select";
  align-items: center;
  position: relative;

  select,
  &::after {
    grid-area: select;
  }

  min-width: 15ch;

  border: 1px solid var(--select-border);
  border-radius: 0.25em;
  padding: 0.25em 0.5em;

  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1.1;

  // Optional styles
  // remove for transparency
  background-color: #fff;
  background-image: linear-gradient(to top, #f9f9f9, #fff 33%);

  // Custom arrow
  &:not(.select--multiple)::after {
    content: "";
    justify-self: end;
    width: 0.8em;
    height: 0.5em;
    background-color: var(--select-arrow);
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
  }
}

select:focus + .focus {
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border: 2px solid var(--select-focus);
  border-radius: inherit;
}

label {
  font-size: 1.125rem;
  font-weight: 500;
}
.err{
  background-color: red;
}
.select + label {
  margin-top: 2rem;
}
</style>