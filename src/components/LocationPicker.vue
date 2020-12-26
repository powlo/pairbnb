<template>
  <div>
    <ion-spinner v-if="isLoading" color="primary"></ion-spinner>
    <ion-img
      v-if="!isLoading && selectedLocationImage"
      @click="onPickLocation"
      :src="selectedLocationImage"
      class="location-image"
    ></ion-img>
    <ion-button v-if="!isLoading && !selectedLocationImage" color="primary" @click="onPickLocation">
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
  data() {
    return {
      isLoading: false,
      selectedLocationImage: null
    };
  },
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
          if (!modalData || !modalData.data) return;

          this.isLoading = true;
          const pickedLocation = {
            lat: modalData.data.lat,
            lng: modalData.data.lng,
            address: null,
            staticMapImageUrl: null
          };
          this.getAddress(modalData.data.lat, modalData.data.lng).then(address => {
            pickedLocation.address = address;
          });
          const staticMapImageUrl = this.getMapImage(modalData.data.lat, modalData.data.lng, 14);
          pickedLocation.staticMapImageUrl = staticMapImageUrl;
          this.selectedLocationImage = staticMapImageUrl;
          this.isLoading = false;
        });
    },
    getAddress(lat, lng) {
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
    },
    getMapImage(lat, lng, zoom) {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:C%7C${lat},${lng}
    &key=${environment.googleMapsAPIKey}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.picker {
  width: 30rem;
  max-width: 80%;
  height: 20rem;
  max-height: 30vh;
  border: 1px solid var(--ion-color-primary);
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.location-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
