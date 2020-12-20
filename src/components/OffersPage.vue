<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>My Offers</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="$router.push('/places/tabs/offers/new')"
            ><ion-icon name="add" slot="icon-only"></ion-icon
          ></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-sm="8" offset-sm="2">
            <div v-if="isLoading" class="ion-text-center">
              <ion-spinner color="primary"></ion-spinner>
            </div>
            <div v-if="!isLoading && offers.length <= 0" class="ion-text-center">
              <p>No offers found! Please create one first</p>
              <ion-button color="primary" @click="$router.push('/places/tabs/offers/new')"
                >Offer New Place</ion-button
              >
            </div>
            <ion-list v-if="!isLoading && offers.length > 0">
              <ion-item-sliding v-for="offer of offers" :key="offer.id">
                <app-offer-item :offer="offer"></app-offer-item>
                <ion-item-options>
                  <ion-item-option
                    color="secondary"
                    @click="router.push('/places/tabs/offers/edit/' + offer.id)"
                  >
                    <ion-icon name="create" slot="icon-only"></ion-icon>
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
import { add, create } from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({
  'ios-add': add.ios,
  'md-add': add.md,
  'ios-create': create.ios,
  'md-create': create.md
});

export default {
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    offers() {
      return this.$store.state.places;
    }
  },
  beforeCreate() {
    // We want to fetch places from backend whenever this view becomes active.
    // NB componets are created and destroyed by the router, so beforeCreate
    // gets called when the user comes *back* to the page for example from
    // the new offer page. This isn't good (nothing changed) so it would be
    // better to use ionic's DidEnter WillEnter type methods.
    this.isLoading = true;
    this.$store.dispatch('fetchPlaces').then(() => {
      this.isLoading = false;
    });
  }
};
</script>

<style lang="scss" scoped></style>
