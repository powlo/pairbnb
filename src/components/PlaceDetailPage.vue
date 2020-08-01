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
export default {
  methods: {
    onBookPlace() {
      console.log('Booked');
    }
  }
};
</script>

<style lang="scss" scoped></style>
