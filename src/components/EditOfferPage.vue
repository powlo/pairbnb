<template>
  <ValidationObserver v-slot="{ invalid }" ref="validator">
    <form @submit.prevent="onSubmit">
      <ion-page>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button :default-href="`/places/tabs/offers/${place.id}`"></ion-back-button>
            </ion-buttons>
            <ion-title>Edit Offer</ion-title>
            <ion-buttons slot="primary">
              <ion-button @click="onEditOffer" :disabled="invalid">
                <ion-icon name="checkmark" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div v-if="isLoading" class="ion-text-center">
            <ion-spinner color="primary"></ion-spinner>
          </div>
          <ion-grid v-if="!isLoading">
            <ion-row>
              <ion-col size-sm="6" offset-sm="3">
                <ValidationProvider rules="required" v-slot="{ errors }">
                  <ion-item>
                    <ion-label position="floating">Title</ion-label>
                    <ion-input-vue type="text" v-model="place.title"></ion-input-vue>
                  </ion-item>
                  <ion-item class="ion-invalid" v-if="errors.length > 0" lines="none">
                    <ion-label>{{ errors[0] }}</ion-label>
                  </ion-item>
                </ValidationProvider>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size-sm="6" offset-sm="3">
                <ValidationProvider rules="required|max:120" v-slot="{ errors }">
                  <ion-item>
                    <ion-label position="floating">Short Description</ion-label>
                    <ion-textarea-vue rows="3" v-model="place.description"></ion-textarea-vue>
                  </ion-item>
                  <ion-item v-if="errors.length > 0" lines="none">
                    <ion-label>{{ errors[0] }}</ion-label>
                  </ion-item>
                </ValidationProvider>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-content>
      </ion-page>
    </form>
  </ValidationObserver>
</template>
<script>
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
import { required, max } from 'vee-validate/dist/rules';
import { checkmark } from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({
  'ios-checkmark': checkmark.ios,
  'md-checkmark': checkmark.md
});

extend('required', { ...required, message: 'This field is required' });
extend('max', { ...max, message: '{_field_} field must have at least {length} characters' });

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      isLoading: false,
      place: {}
    };
  },
  methods: {
    onEditOffer() {
      this.$ionic.loadingController
        .create({
          message: 'Updating place...'
        })
        .then(loadingEl => {
          loadingEl.present();
        });
      this.$store.dispatch('updatePlace', this.place).then(() => {
        this.$refs.validator.reset();
        this.$ionic.loadingController.dismiss();
        this.$router.push('/places/tabs/offers');
      });
    }
  },
  created() {
    this.isLoading = true;
    const id = this.$route.params.placeId;
    this.$store
      .dispatch('getPlace', id)
      .then(place => {
        this.isLoading = false;
        this.place = place;
      })
      .catch(() => {
        this.isLoading = false;
        this.$ionic.alertController
          .create({
            header: 'An error occured...',
            message: 'Place could not be fetched. Please try agin later.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.$router.push('/places/tabs/offers/');
                }
              }
            ]
          })
          .then(alertEl => {
            alertEl.present();
          });
      });
  }
};
</script>
<style lang="scss" scoped>
ion-item {
  // Strange that this isn't set by default on :host. Raise bug on vue?
  // Look at whether we also need to add ion-touched, ion-dirty etc.
  // to get the same styling as in angular.
  // We can add ion-touched etc via the validation state:
  // https://logaretm.github.io/vee-validate/guide/state.html#css-classes
  // However this blats out ionic's own classes. Come back later.
  --highlight-height: 2px;
}
</style>
