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
import environment from '../environments/environment';

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
        .then(modalData => {
          if (!modalData) throw Error('No data.');
          return this.getaddress(modalData.data.lat, modalData.data.lng);
        })
        .then(address => {
          console.log(address);
        });
    },
    getaddress(lat, lng) {
      return fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsAPIKey}`
      )
        .then(response => {
          if (!response.ok) {
            throw Error(`${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(geoData => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            throw Error('No data.');
          }
          return geoData.results[0].formatted_address;
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
