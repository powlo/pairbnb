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
      <ion-segment value="all" @ionChange="filter = $event.detail.value">
        <ion-segment-button value="all">All Places</ion-segment-button>
        <ion-segment-button value="bookable">Bookable Places</ion-segment-button>
      </ion-segment>
      <ion-grid v-if="isLoading">
        <ion-row>
          <ion-col size="12" size-sm="8" offset-sm="2" class="ion-text-center">
            <ion-spinner color="primary"></ion-spinner>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-grid v-if="!isLoading && (!relevantPlaces || relevantPlaces.length <= 0)">
        <ion-row>
          <ion-col size="12" size-sm="8" offset-sm="2" class="ion-text-center">
            <p>There are no bookable places right now, please come back later.</p>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-grid v-if="!isLoading && relevantPlaces.length > 0">
        <ion-row>
          <ion-col size="12" size-sm="8" offset-sm="2" class="ion-text-center">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ relevantPlaces[0].title }}</ion-card-title>
                <ion-card-subtitle>${{ relevantPlaces[0].price }} / Night</ion-card-subtitle>
              </ion-card-header>
              <ion-img :src="relevantPlaces[0].imageURL"></ion-img>
              <ion-card-content>
                <p>{{ relevantPlaces[0].description }}</p>
              </ion-card-content>
              <div class="ion-text-end">
                <ion-button
                  fill="clear"
                  color="primary"
                  @click="$router.push(`/places/tabs/discover/${relevantPlaces[0].id}`)"
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
                v-for="place of relevantPlaces.slice(1)"
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
      filter: 'all',
      isLoading: false
    };
  },
  computed: {
    relevantPlaces() {
      const isShown = place => this.filter === 'all' || place.userId !== this.$store.getters.userId;
      return this.$store.state.places.filter(isShown);
    }
  },
  mounted() {
    this.isLoading = true;
    this.$store.dispatch('fetchPlaces').then(() => {
      this.isLoading = false;
    });
  }
};
</script>
<style lang="scss" scoped></style>
