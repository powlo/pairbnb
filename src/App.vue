<template>
  <div id="app">
    <ion-app>
      <ion-menu side="start" content-id="main">
        <ion-header>
          <ion-toolbar>
            <ion-title>PairBnB</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-menu-toggle>
              <ion-item lines="none" @click="push('/places/tabs/discover')">
                <ion-icon name="business" slot="start"></ion-icon>
                <ion-label>Discover Places</ion-label>
              </ion-item>
            </ion-menu-toggle>
            <ion-menu-toggle>
              <ion-item lines="none" @click="push('/bookings')">
                <ion-icon name="checkbox-outline" slot="start"></ion-icon>
                <ion-label>Your Bookings</ion-label>
              </ion-item>
            </ion-menu-toggle>
            <ion-menu-toggle>
              <ion-item lines="none" @click="onLogOut" button>
                <ion-icon name="exit" slot="start"></ion-icon>
                <ion-label>Log Out</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-vue-router id="main" />
    </ion-app>
  </div>
</template>
<script>
import { business, checkboxOutline, exit } from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({
  'ios-business': business.ios,
  'md-business': business.md,
  'ios-checkbox-outline': checkboxOutline.ios,
  'md-checkbox-outline': checkboxOutline.md,
  'ios-exit': exit.ios,
  'md-exit': exit.md
});
export default {
  methods: {
    push(path) {
      // Router will complain with 'Error: Avoided redundant navigation to
      // current location: "/xy/z"'. So check before pushing.
      // NB route vs router.
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },
    onLogOut() {
      this.$store.commit('logout');
      this.$router.push({ name: 'login' });
    }
  }
};
</script>
<style lang="scss">
@import '@/theme/variables.scss';
</style>
