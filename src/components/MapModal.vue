<template>
  <!-- possibly don't want ion-page here. -->
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="onCancel">{{ closeButtonText }}</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="map" ref="map"></div>
    </ion-content>
  </ion-page>
</template>

<script>
import environment from '../environments/environment';

export default {
  props: {
    center: { default: () => ({ lat: 52.2053, lng: 0.1218 }) },
    selectable: { default: true },
    title: { default: 'Pick Location' },
    closeButtonText: { default: 'Cancel' }
  },
  data() {
    return {
      clickListener: null,
      googleMaps: null
    };
  },
  created() {
    this.getGoogleMaps()
      .then(googleMaps => {
        this.googleMaps = googleMaps;
        const mapEl = this.$refs.map;
        const map = new googleMaps.Map(mapEl, {
          center: this.center,
          zoom: 16
        });

        // Use the google maps API to listen for when the map is done
        // (ie now idle). When it is, set a visible class on the map.
        googleMaps.event.addListenerOnce(map, 'idle', () => {
          mapEl.classList.add('visible');
        });
        if (this.selectable) {
          this.clickListener = map.addListener('click', event => {
            const selectedCoords = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            this.$ionic.modalController.dismiss(selectedCoords);
          });
        } else {
          const marker = new googleMaps.Marker({
            position: this.center,
            map,
            title: 'Picked Location'
          });
          marker.setMap(map);
        }
      })
      .catch(err => {
        console.error(err);
      });
  },
  destroyed() {
    if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  },
  methods: {
    onCancel() {
      this.$ionic.modalController.dismiss();
    },
    getGoogleMaps() {
      // If googlemaps alread exists then return it.
      const win = window;
      const googleModule = win.google;
      if (googleModule && googleModule.maps) {
        return Promise.resolve(googleModule.maps);
      }
      return new Promise((resolve, reject) => {
        // We use a promise because squirting stuff into the dom, that in turn
        // makes http requests, takes time.
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPIKey}`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.onload = () => {
          const loadedGoogleModule = win.google;
          if (loadedGoogleModule && loadedGoogleModule.maps) {
            resolve(loadedGoogleModule.maps);
          } else {
            reject(Error('Google maps sdk not available'));
          }
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.map {
  position: absolute;
  height: 100%;
  width: 100%;

  background-color: transparent;

  opacity: 0;
  transition: opacity 150ms ease-in;
}

.map.visible {
  opacity: 1;
}
</style>
