<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Recipes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item
          v-for="recipe of recipes"
          :key="recipe.id"
          @click="$router.push(`./recipes/${recipe.id}`)"
        >
          <ion-avatar slot="start">
            <ion-img :src="recipe.imageUrl"></ion-img>
          </ion-avatar>
          <ion-label>{{ recipe.title }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  computed: {
    recipes() {
      return this.$store.getters.getAllRecipes;
    }
  }
};
</script>

<style lang="scss" scoped></style>
