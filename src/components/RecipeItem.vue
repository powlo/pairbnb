<template>
  <ion-item @click="$router.push(`./recipes/${recipe.id}`)">
    <ion-avatar slot="start">
      <ion-img :src="recipe.imageUrl"></ion-img>
    </ion-avatar>
    <ion-label>{{ recipe.title }}</ion-label>
  </ion-item>
</template>
<script>
export default {
  props: {
    recipe: Object
  }
};
</script>
