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
      <ValidationObserver v-slot="{ invalid }" ref="validator">
        <form @submit.prevent="onBookPlace">
          <ion-grid>
            <ion-row>
              <ion-col size-sm="6" offset-sm="3">
                <ValidationProvider rules="required">
                  <ion-item>
                    <ion-label position="floating">First Name</ion-label>
                    <ion-input-vue v-model="firstName" type="text" required></ion-input-vue>
                  </ion-item>
                </ValidationProvider>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size-sm="6" offset-sm="3">
                <ValidationProvider rules="required">
                  <ion-item>
                    <ion-label position="floating">Last Name</ion-label>
                    <ion-input-vue v-model="lastName" type="text" required></ion-input-vue>
                  </ion-item>
                </ValidationProvider>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size-sm="6" offset-sm="3">
                <ion-item>
                  <ion-label position="floating">Number Of Guests</ion-label>
                  <ion-select-vue v-model="guestNumber">
                    <ion-select-option value="1">1</ion-select-option>
                    <ion-select-option value="2">2</ion-select-option>
                    <ion-select-option value="3">3</ion-select-option>
                  </ion-select-vue>
                </ion-item>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size-sm="3" offset-sm="3">
                <ValidationProvider rules="required" vid="startVid">
                  <ion-item>
                    <ion-label position="floating">From</ion-label>
                    <ion-datetime-vue
                      display-format="MMM DD YYYY"
                      picker-format="YY MMM DD"
                      :min="selectedPlace.availableFrom.toISOString()"
                      :max="selectedPlace.availableTo.toISOString()"
                      v-model="startDate"
                      required
                    ></ion-datetime-vue>
                  </ion-item>
                </ValidationProvider>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size-sm="3">
                <ValidationProvider rules="required|greaterThan:@startVid">
                  <ion-item>
                    <ion-label position="floating">To</ion-label>
                    <ion-datetime-vue
                      display-format="MMM DD YYYY"
                      picker-format="YY MMM DD"
                      :min="selectedPlace.availableFrom.toISOString()"
                      :max="selectedPlace.availableTo.toISOString()"
                      v-model="endDate"
                      required
                    ></ion-datetime-vue>
                  </ion-item>
                </ValidationProvider>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size-sm="6" offset-sm="3">
                <ion-button type="submit" color="primary" expand="block" :disabled="invalid"
                  >Book!</ion-button
                >
              </ion-col>
            </ion-row>
          </ion-grid>
        </form>
      </ValidationObserver>
    </ion-content>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

extend('required', { ...required, message: 'This field is required' });

extend('greaterThan', {
  params: ['target'],
  validate(value, { target }) {
    const valueDate = new Date(value);
    const targetDate = new Date(target);
    return valueDate > targetDate;
  },
  message: 'Password confirmation does not match'
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: {
    selectedPlace: Object,
    selectedMode: String
  },
  data() {
    return {
      firstName: null,
      lastName: null,
      guestNumber: 2,
      startDate: null,
      endDate: null
    };
  },
  methods: {
    onCancel() {
      this.$ionic.modalController.dismiss(null, 'cancel');
    },
    onBookPlace() {
      this.$ionic.modalController.dismiss(
        {
          bookingData: {
            firstName: this.firstName,
            lastName: this.lastName,
            guestNumber: this.guestNumber,
            startDate: this.startDate,
            endDate: this.endDate
          }
        },
        'confirm'
      );
    }
  },
  created() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() +
          Math.random() *
            (new Date(this.startDate).getTime() +
              6 * 24 * 60 * 60 * 1000 -
              new Date(this.startDate).getTime())
      ).toISOString();
    }
  }
};
</script>
