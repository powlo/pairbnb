<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/recipes"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ loadedRecipe.title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="onDelete">
            <ion-icon name="trash" slot="icon-only"> </ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-grid class="ion-no-padding">
        <ion-row>
          <ion-col class="ion-no-padding">
            <ion-img :src="loadedRecipe.imageUrl"></ion-img>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <h1 class="ion-text-center">
              {{ loadedRecipe.title }}
            </h1>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-list>
              <ion-item v-for="ig of loadedRecipe.ingredients" :key="ig.id">
                {{ ig }}
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
      // NB the loaded recipe is data only, instead of a computed, so when it
      // is deleted it doesn't trigger a rerender of a not found object.
      loadedRecipe: this.$store.getters.getRecipe(this.$route.params.id)
    };
  },
  methods: {
    onDelete() {
      this.$ionic.alertController
        .create({
          header: 'Are you sure?',
          message: 'Do you really want to delete this recipe?',
          buttons: [
            { text: 'Cancel', role: 'cancel' },
            {
              text: 'Delete',
              handler: () => {
                this.$store.commit('deleteRecipe', this.loadedRecipe.id);
                this.$router.push('/recipes');
              }
            }
          ]
        })
        .then(alertCtrl => alertCtrl.present());
    }
  }
};
</script>

<style lang="scss" scoped></style>
