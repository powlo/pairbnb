<template>
  <div class="picker">
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
import { Plugins, Capacitor } from '@capacitor/core';
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
    createPlace(lat, lng) {
      this.isLoading = true;
      const pickedLocation = {
        lat,
        lng,
        address: null,
        staticMapImageUrl: null
      };
      this.getAddress(lat, lng).then(address => {
        pickedLocation.address = address;
        const staticMapImageUrl = this.getMapImage(lat, lng, 14);
        pickedLocation.staticMapImageUrl = staticMapImageUrl;
        this.selectedLocationImage = staticMapImageUrl;
        this.isLoading = false;
        this.$emit('input', pickedLocation);
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
    },
    locateUser() {
      if (!Capacitor.isPluginAvailable('Geolocation')) {
        this.showErrorAlert();
        return;
      }
      this.isLoading = true;
      Plugins.Geolocation.getCurrentPosition()
        .then(geoPosition => {
          const coordinates = {
            lat: geoPosition.coords.latitude,
            lng: geoPosition.coords.longitude
          };
          this.createPlace(coordinates.lat, coordinates.lng);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
          this.showErrorAlert();
        });
    },
    onPickLocation() {
      this.$ionic.actionSheetController
        .create({
          header: 'Please choose',
          buttons: [
            {
              text: 'Auto-locate',
              handler: () => {
                this.locateUser();
              }
            },
            {
              text: 'Pick on map',
              handler: () => {
                this.openMap();
              }
            },
            { text: 'Cancel', role: 'cancel' }
          ]
        })
        .then(actionEl => {
          actionEl.present();
        });
    },
    openMap() {
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
          const coordinates = {
            lat: modalData.data.lat,
            lng: modalData.data.lng
          };
          this.createPlace(coordinates.lat, coordinates.lng);
        });
    },
    showErrorAlert() {
      this.$ionic.alertController
        .create({
          header: 'Could not fetch location.',
          message: 'Please use the map to pick a location',
          buttons: ['OK']
        })
        .then(alert => {
          alert.present();
        });
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
