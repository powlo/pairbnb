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
      <div v-if="isLoading" class="ion-text-center">
        <ion-spinner color="primary"></ion-spinner>
      </div>
      <ion-grid v-else>
        <ion-row>
          <ion-col
            v-if="!loadedBookings || loadedBookings.length <= 0"
            size-md="6"
            offset-md="3"
            class="ion-text-center"
          >
            <p>No bookings found!</p>
          </ion-col>
          <ion-col v-else size-md="6" offset-md="3">
            <ion-list>
              <ion-item-sliding
                v-for="(booking, idx) in loadedBookings"
                :key="booking.id"
                ref="slidingBooking"
              >
                <!-- add slideBooking id -->
                <ion-item>
                  <ion-avatar>
                    <ion-img :src="booking.imageURL"></ion-img>
                  </ion-avatar>
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
  data() {
    return {
      isLoading: false
    };
  },
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
  },
  mounted() {
    this.isLoading = true;
    this.$store.dispatch('fetchBookings').then(() => {
      this.isLoading = false;
    });
  }
};
</script>

<style lang="scss" scoped></style>
