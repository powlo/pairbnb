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
              <ion-item
                v-for="place in loadedPlaces"
                :key="place.id"
                @click="$router.push(`/places/tabs/discover/${place.id}`)"
                detail
              >
                <ion-thumbnail slot="start">
                  <ion-img :src="place.imageURL"></ion-img>
                </ion-thumbnail>
                <ion-label>
                  <h2>{{ place.title }}</h2>
                  <p>{{ place.description }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<script>
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({
  'ios-add': add.ios,
  'md-add': add.md
});

export default {
  data() {
    return {
      loadedPlaces: [
        {
          id: 'p1',
          title: 'Manhatten Mansion',
          description: 'In the heart of New York City',
          imageURL: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
          price: 149.99
        },

        {
          id: 'p2',
          title: "L'Amour Toujour",
          description: 'A romantic place in Paris',
          imageURL: 'https://images.unsplash.com/photo-1471623600634-4d04cfc56a27',
          price: 189.99
        },

        {
          id: 'p3',
          title: 'The Foggy Palace',
          description: 'Not your average city trip',
          imageURL: 'https://images.unsplash.com/photo-1531383339897-f369f6422e40',
          price: 99.99
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
