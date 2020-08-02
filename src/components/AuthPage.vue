<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Authenticate</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-button color="primary" @click="onLogin">Login</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  methods: {
    onLogin() {
      this.$store.commit('login');
      this.$router.push('/places/tabs/discover');
    }
  }
};
</script>

<style lang="scss" scoped></style>
