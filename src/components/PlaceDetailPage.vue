<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/places/tabs/discover"></ion-back-button>
        </ion-buttons>
        <ion-title>place-detail</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-button color="primary" class="ion-margin" @click="onBookPlace">Book</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import CreateBookingComponent from './CreateBookingComponent.vue';

export default {
  methods: {
    onBookPlace() {
      console.log('Booking');
      this.$ionic.modalController
        .create({
          component: CreateBookingComponent,
          componentProps: {
            propsData: {
              selectedPlace: this.$store.getters.getPlace(this.$route.params.placeId)
            }
          }
        })
        .then(modalEl => {
          // nb we could use awaits here.
          modalEl.present();
          return modalEl.onDidDismiss();
        })
        .then(resultData => {
          console.log(resultData);
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
