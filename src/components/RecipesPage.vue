<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title>Recipes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item v-for="recipe of recipes" :key="recipe.id">
          <ion-avatar slot="start">
            <ion-img :src="recipe.imageUrl"></ion-img>
          </ion-avatar>
          <ion-label>{{ recipe.title }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipes: [
        {
          id: 'r1',
          title: 'Schnitzel',
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/2/22/Breitenlesau_Krug_Br%C3%A4u_Schnitzel.JPG',
          ingredients: ['French Fries', 'Pork Meat', 'Salad'],
        },
        {
          id: 'r2',
          title: 'Spaghetti',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Spaghetti_puttanesca.jpg',
          ingredients: ['Spaghetti', 'Meat', 'Tomatoes'],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
