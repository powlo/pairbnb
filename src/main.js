import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import Vue from 'vue';
import Ionic from '@ionic/vue';

import { trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import App from './App.vue';
import router from './router';
import store from './store';
import OfferItemComponent from './components/OfferItemComponent.vue';
import dateFilter from './filters';
// @ionic/vue will addIcons that it needs,
// we need to do the same.
addIcons({
  'ios-trash': trash.ios,
  'md-trash': trash.md
});

Vue.config.productionTip = false;

Vue.use(Ionic);

Vue.component('app-offer-item', OfferItemComponent);

Vue.filter('date', dateFilter);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

defineCustomElements(window);
