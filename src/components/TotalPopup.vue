<template>
  <v-row justify='space-around'>
    <v-col cols='auto'>
      <v-dialog
        v-model='dialog'
        transition='dialog-bottom-transition'
      >
        <v-card>
          <v-card-header class='text-center'><h2>Daire {{item.daire}}</h2></v-card-header>
          <hr>
          <v-card-header-text class='text-center'><h3>{{item.daire}}. dairenin toplam <u>{{item.borc}} TL</u>  tutarında ödenmemiş borcu bulunmaktadır.</h3></v-card-header-text>
            <v-card-actions class='justify-end'>
              <v-btn
                color='primary'
                @click='dialog = false'
              >
                Kapat
              </v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'TotalPopup',
  props:{
    dialog: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: {}
    }
  },
}
</script>

<style scoped>

</style>