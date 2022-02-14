<template>
  <v-row>
    <v-col
      cols="12"
      sm="6"
      offset-sm="3"
      class='text-center'
    >
      <span class="text-h5">İşlemler</span>
      <v-card class='pt-5 pb-5'>
        <div class="d-flex justify-space-around">
          <v-btn
            color="success"
            plain
            @click='changePage("NewInvoice")'
          >
            Yeni Kayıt
          </v-btn>

          <v-btn
            color="grey"
            plain
            @click='changePage("EditInvoice")'
          >
            Düzenleme
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'AdminMenu',
  methods:{
    changePage(page){
      this.$emit('changePage', page)
    }
  }
}
</script>

<style scoped>

</style>