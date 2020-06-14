import Vue from "vue";
import Ionic from "@ionic/vue";
import App from "./App.vue";
import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";

Vue.config.productionTip = false;

Vue.use(Ionic);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
