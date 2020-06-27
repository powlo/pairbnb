<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Recipes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <RecipeItem v-for="recipe of recipes" :key="recipe.id" :recipe="recipe"></RecipeItem>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import RecipeItem from './RecipeItem.vue';

export default {
  components: {
    RecipeItem
  },
  computed: {
    recipes() {
      return this.$store.getters.getAllRecipes;
    }
  }
};
</script>

<style lang="scss" scoped></style>
