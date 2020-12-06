<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/places/tabs/discover"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ place.title }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-grid class="ion-no-padding">
        <ion-row>
          <ion-col size-sm="6" offset-sm="3" class="ion-no-padding">
            <ion-img :src="place.imageURL"></ion-img>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size-sm="6" offset-sm="3" class="ion-text-center ion-padding">
            <p>{{ place.description }}</p>
          </ion-col>
        </ion-row>
        <ion-row v-if="isBookable">
          <ion-col size-sm="6" offset-sm="3" class="ion-text-center">
            <ion-button color="primary" class="ion-margin" @click="onBookPlace">Book</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import CreateBookingComponent from './CreateBookingComponent.vue';

export default {
  computed: {
    place() {
      return this.$store.getters.getPlace(this.$route.params.placeId);
    },
    isBookable() {
      return this.place.userId !== this.$store.state.userId;
    }
  },
  methods: {
    onBookPlace() {
      this.$ionic.actionSheetController
        .create({
          header: 'Choose an action',
          buttons: [
            {
              text: 'Select Date',
              handler: () => {
                this.openBookingModal('select');
              }
            },
            {
              text: 'Random Date',
              handler: () => {
                this.openBookingModal('random');
              }
            },
            { text: 'Cancel', role: 'cancel' }
          ]
        })
        .then(actionSheelEl => {
          actionSheelEl.present();
        });
    },
    openBookingModal(mode) {
      this.$ionic.modalController
        .create({
          component: CreateBookingComponent,
          componentProps: {
            propsData: {
              selectedPlace: this.place,
              selectedMode: mode
            }
          }
        })
        .then(modalEl => {
          // nb we could use awaits here.
          modalEl.present();
          return modalEl.onDidDismiss();
        })
        .then(resultData => {
          if (resultData.role === 'confirm') {
            this.$ionic.loadingController
              .create({
                message: 'Booking place...'
              })
              .then(loadingEl => {
                loadingEl.present();
              });
            const data = resultData.data.bookingData;
            this.$store
              .dispatch('addBooking', {
                id: this.place.id,
                title: this.place.title,
                imageURL: this.place.imageURL,
                firstName: data.firstName,
                lastName: data.lastName,
                guestNumber: data.guestNumber,
                startDate: data.startDate,
                endDate: data.endDate
              })
              .then(() => this.$ionic.loadingController.dismiss());
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
