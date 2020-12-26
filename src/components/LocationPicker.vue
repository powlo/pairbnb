<template>
  <div>
    <ion-button color="primary" @click="onPickLocation">
      <ion-icon name="map" slot="start"></ion-icon>
      <ion-label>Select Location</ion-label>
    </ion-button>
  </div>
</template>

<script>
import { map } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import MapModal from './MapModal.vue';

addIcons({
  'ios-map': map.ios,
  'md-map': map.md
});

export default {
  methods: {
    onPickLocation() {
      this.$ionic.modalController
        .create({
          component: MapModal
        })
        .then(modal => {
          modal.present();
          return modal.onDidDismiss();
        })
        .then(modal => {
          console.log(modal.data);
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
