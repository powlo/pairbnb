<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Your Bookings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size-md="6" offset-md="3">
            <ion-list>
              <ion-item-sliding
                v-for="(booking, idx) in loadedBookings"
                :key="booking.id"
                ref="slidingBooking"
              >
                <!-- add slideBooking id -->
                <ion-item>
                  <ion-label>
                    <h5>{{ booking.title }}</h5>
                    <p>Guests: {{ booking.guestNumber }}</p>
                  </ion-label>
                </ion-item>
                <ion-item-options>
                  <ion-item-option color="danger" @click="onCancelBooking(booking.id, idx)">
                    <ion-icon name="trash" slot="icon-only"></ion-icon>
                  </ion-item-option>
                </ion-item-options>
              </ion-item-sliding>
            </ion-list>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  computed: {
    loadedBookings() {
      return this.$store.state.bookings;
    }
  },
  methods: {
    onCancelBooking(bookingId, idx) {
      this.$refs.slidingBooking[idx].close();
      this.$ionic.loadingController
        .create({
          message: 'Cancelling...'
        })
        .then(loadingEl => {
          loadingEl.present();
        });
      // An observable to which you don't observe will never execute.
      this.$store.dispatch('cancelBooking', bookingId).then(() => {
        this.$ionic.loadingController.dismiss();
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
