<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Discover Places</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-segment value="all" @ionChange="onFilterUpdate($event)">
        <ion-segment-button value="all">All Places</ion-segment-button>
        <ion-segment-button value="bookable">Bookable Places</ion-segment-button>
      </ion-segment>
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-sm="8" offset-sm="2" class="ion-text-center">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ loadedPlaces[0].title }}</ion-card-title>
                <ion-card-subtitle>${{ loadedPlaces[0].price }} / Night</ion-card-subtitle>
              </ion-card-header>
              <ion-img :src="loadedPlaces[0].imageURL"></ion-img>
              <ion-card-content>
                <p>{{ loadedPlaces[0].description }}</p>
              </ion-card-content>
              <div class="ion-text-end">
                <ion-button
                  fill="clear"
                  color="primary"
                  @click="$router.push(`/places/tabs/discover/${loadedPlaces[0].id}`)"
                  >More</ion-button
                >
              </div>
            </ion-card>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" size-sm="8" offset-sm="2">
            <ion-list>
              <ion-item
                v-for="place of loadedPlaces.slice(1)"
                :key="place.title"
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
  },
  methods: {
    onFilterUpdate(event) {
      console.log(event.detail);
    }
  }
};
</script>
<style lang="scss" scoped></style>
