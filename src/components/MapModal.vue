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
  methods: {
    onCancel() {
      // TODO: pass a data object to dismiss.
      this.$ionic.modalController.dismiss();
    }
  }
};
</script>

<style lang="scss" scoped></style>
