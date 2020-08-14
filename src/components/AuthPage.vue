<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Authenticate</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input></ion-input>
        </ion-item>
      </ion-list>
      <!-- <div class="ion-text-center">
        <ion-spinner color="primary" v-if="isLoading"></ion-spinner>
      </div> -->
      <ion-button color="primary" @click="onLogin">Login</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    onLogin() {
      this.$store.commit('login');
      this.isLoading = true;
      this.$ionic.loadingController
        .create({
          keyboardClose: true,
          message: 'Logging in...'
        })
        .then(loadingEl => {
          loadingEl.present();
          setTimeout(() => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.$router.push('/places/tabs/discover');
          }, 1500);
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
