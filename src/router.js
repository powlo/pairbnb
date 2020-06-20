import Vue from 'vue';
import { IonicVueRouter } from '@ionic/vue';

// Something is duff with the router. We have to modify the target component to make it appear.
// NB routes don't work like they seem to in Angular. "Children" are expected to be embedded
// within the parent component, ie the parent declares a <ion-vue-router>
Vue.use(IonicVueRouter);
export default new IonicVueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: { name: 'recipes' }
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: () => import(/* webpackChunkName: "recipes" */ './components/RecipesPage.vue')
    },
    {
      path: '/recipes/:id',
      name: 'recipeDetail',
      component: () =>
        import(/* webpackChunkName: "recipeDetail" */ './components/RecipeDetailPage.vue')
    }
  ]
});
