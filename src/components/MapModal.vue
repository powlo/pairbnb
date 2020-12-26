<template>
  <!-- possibly don't want ion-page here. -->
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Pick Location</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="onCancel">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="map"></div>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  created() {
    this.getGoogleMaps().catch(err => {
      console.error(err);
    });
  },
  methods: {
    onCancel() {
      // TODO: pass a data object to dismiss.
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
        script.src = 'https://maps.googleapis.com/maps/api/js?key=abc123';
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

<style lang="scss" scoped></style>
