<template>
  <div class="ion-page">
    <ion-tabs>
      <ion-tab tab="discover" :routes="['discover', 'discover-details']" :to="{ name: 'discover' }">
        <ion-vue-router name="discoverRoute"></ion-vue-router>
      </ion-tab>

      <ion-tab tab="offers">
        <ion-vue-router name="offerRoute"></ion-vue-router>
      </ion-tab>

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="discover">
          <ion-icon name="search" />
          <ion-label>Discover</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="offers" :to="{ name: 'offers' }">
          <ion-icon name="card" />
          <ion-label>Offers</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </div>
</template>

<script>
import { search, card } from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({
  'ios-search': search.ios,
  'md-search': search.md,
  'ios-card': card.ios,
  'md-card': card.md
});
export default {
  name: 'PlacesPage',
  props: {}
};
</script>
