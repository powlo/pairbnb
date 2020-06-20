import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import Vue from 'vue';
import Ionic from '@ionic/vue';

import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

Vue.use(Ionic);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
