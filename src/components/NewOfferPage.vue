<template>
  <ValidationObserver v-slot="{ invalid }" ref="validator">
    <form>
      <ion-page>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/places/tabs/offers"></ion-back-button>
            </ion-buttons>
            <ion-title>New Offer</ion-title>
            <ion-buttons slot="primary">
              <ion-button @click="onCreateOffer" :disabled="invalid">
                <ion-icon name="checkmark" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <ion-grid>
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
            <ion-row>
              <ion-col size-sm="6" offset-sm="3">
                <ion-item>
                  <ion-label position="floating">Price</ion-label>
                  <ion-input-vue type="number" v-model="place.price"></ion-input-vue>
                </ion-item>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size-sm="3" offset-sm="3">
                <ion-item>
                  <ion-label position="floating">Available From</ion-label>
                  <ion-datetime-vue
                    min="2020-01-01"
                    max="2022-12-31"
                    v-model="place.dateFrom"
                  ></ion-datetime-vue>
                </ion-item>
              </ion-col>
              <ion-col size-sm="3">
                <ion-item>
                  <ion-label position="floating">Available to</ion-label>
                  <ion-datetime-vue
                    min="2020-01-02"
                    max="2022-12-31"
                    v-model="place.dateTo"
                  ></ion-datetime-vue>
                </ion-item>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size-sm="6" offset-sm="3">
                <ValidationProvider rules="required">
                  <app-location-picker v-model="place.location"></app-location-picker>
                </ValidationProvider>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size-sm="6" offset-sm="3">
                <ValidationProvider rules="required" ref="imagepicker">
                  <app-image-picker @imagePick="onImagePicked"></app-image-picker>
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
import LocationPicker from './LocationPicker.vue';
import ImagePicker from './ImagePicker.vue';
import environment from '../environments/environment';

addIcons({
  'ios-checkmark': checkmark.ios,
  'md-checkmark': checkmark.md
});

extend('required', { ...required, message: 'This field is required' });
extend('max', { ...max, message: '{_field_} field must have at least {length} characters' });

function base64toBlob(base64Data, contentType) {
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; sliceIndex += 1) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; i += 1, offset += 1) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType || '' });
}

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    'app-location-picker': LocationPicker,
    'app-image-picker': ImagePicker
  },
  data() {
    return {
      place: {}
    };
  },
  mounted() {
    // A cheap way to force initial validation state.
    this.$refs.imagepicker.validate(null);
  },
  methods: {
    onCreateOffer() {
      const baseUrl = `https://us-central1-${environment.firebaseProjectId}.cloudfunctions.net`;
      this.$ionic.loadingController
        .create({
          message: 'Creating place...'
        })
        .then(loadingEl => {
          loadingEl.present();
        });

      // formData is an api for creating forms and submitting forms in js.
      // https://developer.mozilla.org/en-US/docs/Web/API/FormData
      const uploadData = new FormData();
      uploadData.append('image', this.place.image);
      return fetch(`${baseUrl}/storeImage`, {
        method: 'post',
        headers: { Authorization: `Bearer ${this.$store.getters.userToken}` },
        body: uploadData
      })
        .then(response => {
          if (!response.ok) {
            throw Error(`${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(uploadRes => {
          return this.$store.dispatch('addPlace', {
            title: this.place.title,
            description: this.place.description,
            imageURL: uploadRes.imageUrl,
            price: +this.place.price,
            availableFrom: new Date(this.place.dateFrom),
            availableTo: new Date(this.place.dateTo),
            location: this.place.location,
            userId: this.$store.getters.userId
          });
        })
        .then(() => {
          this.$refs.validator.reset();
          this.$router.push('/places/tabs/offers');
        })
        .finally(() => {
          this.$ionic.loadingController.dismiss();
        });
    },
    onLocationPicked(location) {
      this.place.location = location;
    },
    onImagePicked(imageData) {
      // NB this copies behaviour in existing angular code. However
      // it might make validation easier if we shift this function
      // down into the image-picker and then emit a value from there.
      this.$refs.imagepicker.validate(imageData).then(({ valid }) => {
        if (!valid) return;
        let imageFile;
        if (typeof imageData === 'string') {
          try {
            const typePattern = /^data:(image\/(?:jpeg|png));base64,/;
            const contentMatch = imageData.match(typePattern);
            if (!contentMatch) throw Error('Unknown content type.');
            const rawData = imageData.replace(typePattern, '');
            const contentType = contentMatch[1];
            imageFile = base64toBlob(rawData, contentType);
          } catch (err) {
            console.error(err);
            return;
          }
        } else {
          imageFile = imageData;
        }
        // this.$refs.provider.syncValue(null);
        this.place.image = imageFile;
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
