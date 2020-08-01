import Vue from 'vue';
import { IonicVueRouter } from '@ionic/vue';

Vue.use(IonicVueRouter);

export default new IonicVueRouter({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/places/tabs',
      component: () => import('@/components/PlacesPage.vue'),
      children: [
        {
          path: 'discover',
          name: 'discover',
          components: {
            discoverRoute: () => import('@/components/DiscoverPage.vue')
          }
        },
        {
          path: 'discover/:placeId',
          name: 'discover-details',
          components: {
            discoverRoute: () => import('@/components/PlaceDetailPage.vue')
          }
        },
        {
          path: 'offers',
          name: 'offers',
          components: {
            offerRoute: () => import('@/components/OffersPage.vue')
          }
        }
      ]
    },
    { path: '/', redirect: 'places/tabs/discover' }
  ]
});
