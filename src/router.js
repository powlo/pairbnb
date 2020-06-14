import Vue from 'vue';
import { IonicVueRouter } from '@ionic/vue';

Vue.use(IonicVueRouter);
export default new IonicVueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: { name: 'recipes' },
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: () => import(/* webpackChunkName: "recipes" */ './components/RecipesPage.vue'),
    },
  ],
});
