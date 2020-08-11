<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ selectedPlace.title }}</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="onCancel">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-text-center ion-padding">
      <p>{{ selectedPlace.description }}</p>
      <ion-button color="primary" @click="onBookPlace">Book!</ion-button>
    </ion-content>
  </div>
</template>

<script>
export default {
  props: {
    selectedPlace: Object
  },
  methods: {
    onCancel() {
      this.$ionic.modalController.dismiss(null, 'cancel');
    },
    onBookPlace() {
      this.$ionic.modalController.dismiss({ message: 'This is a dummy message' }, 'confirm');
    }
  }
};
</script>
