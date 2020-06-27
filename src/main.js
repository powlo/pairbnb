import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import Vue from 'vue';
import Ionic from '@ionic/vue';

import { trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import App from './App.vue';
import router from './router';
import store from './store';

// @ionic/vue will addIcons that it needs,
// we need to do the same.
addIcons({
  'ios-trash': trash.ios,
  'md-trash': trash.md
});

Vue.config.productionTip = false;

Vue.use(Ionic);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
