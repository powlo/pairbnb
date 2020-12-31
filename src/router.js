import Vue from 'vue';
import { IonicVueRouter } from '@ionic/vue';
import store from './store';

Vue.use(IonicVueRouter);

const router = new IonicVueRouter({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/auth',
      name: 'login',
      component: () => import('@/components/AuthPage')
    },
    {
      path: '/bookings',
      component: () => import('@/components/BookingsPage')
    },
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
        },
        {
          path: 'offers/new',
          name: 'offer-new',
          components: {
            offerRoute: () => import('@/components/NewOfferPage.vue')
          }
        },
        {
          path: 'offers/edit/:placeId',
          name: 'offer-edit',
          components: {
            offerRoute: () => import('@/components/EditOfferPage.vue')
          }
        }
      ]
    },
    { path: '/', redirect: 'places/tabs/discover' }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !store.getters.userIsAuthenticated) next({ name: 'login' });
  else next();
});

export default router;
