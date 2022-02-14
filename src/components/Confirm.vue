<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
    >
      <v-card>
        <v-card-title class="text-h5">
          Silme İşlemi Onayı
        </v-card-title>
        <v-card-text class='text-center'>{{item.sene}} senesi ve {{item.donem}}. dönemine ait tüm kayıtlar ve ilgili dosya silinecek </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="deleteConfirmation(false)"
          >
            Hayır
          </v-btn>
          <v-btn
            color="error"
            text
            @click="deleteConfirmation(true)"
          >
            Evet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'Confirm',
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
  methods:{
    deleteConfirmation(value){
      this.$emit('delete-confirmation', value);
    }
  }
}
</script>

<style scoped>

</style>