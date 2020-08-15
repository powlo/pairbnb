<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/places/tabs/offers"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ place.title }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-button
        class="ion-margin"
        color="primary"
        @click="$router.push(`/places/tabs/offers/${place.id}`)"
        >Edit</ion-button
      >
    </ion-content>
  </ion-page>
</template>
<script>
export default {
  computed: {
    place() {
      return this.$store.getters.getPlace(this.$route.params.placeId);
    }
  }
};
</script>
