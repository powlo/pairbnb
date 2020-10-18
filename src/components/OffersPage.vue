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
            <ion-list>
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
  computed: {
    offers() {
      return this.$store.state.places;
    }
  }
};
</script>

<style lang="scss" scoped></style>
