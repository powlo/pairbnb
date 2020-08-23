<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ isLogin ? 'Login' : 'Signup' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ValidationObserver v-slot="{ handleSubmit }" ref="validator">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <ion-grid>
            <ion-row>
              <ion-col size-sm="6" offset-sm="3">
                <ion-list>
                  <ValidationProvider rules="required|email" v-slot="{ errors }">
                    <ion-item>
                      <ion-label position="floating">Email</ion-label>
                      <ion-input-vue v-model="email"></ion-input-vue>
                    </ion-item>
                    <ion-item v-if="errors.length > 0" lines="none">
                      <ion-label>{{ errors[0] }}</ion-label>
                    </ion-item>
                  </ValidationProvider>
                  <ValidationProvider rules="required|length:6" v-slot="{ errors }">
                    <ion-item>
                      <ion-label position="floating">Password</ion-label>
                      <ion-input-vue v-model="password"></ion-input-vue>
                    </ion-item>
                    <ion-item v-if="errors.length > 0" lines="none">
                      <ion-label>{{ errors[0] }}</ion-label>
                    </ion-item>
                  </ValidationProvider>
                </ion-list>
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-grid>
            <ion-row>
              <ion-col size-sm="6" offset-sm="3">
                <ion-button
                  type="button"
                  color="primary"
                  fill="clear"
                  expand="block"
                  @click="onSwitchAuthMode"
                  >Switch to {{ isLogin ? 'Signup' : 'Login' }}</ion-button
                >
                <ion-button type="submit" color="primary" expand="block">{{
                  isLogin ? 'Log in' : 'Sign up'
                }}</ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </form>
      </ValidationObserver>
    </ion-content>
  </ion-page>
</template>

<script>
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';

import { required, email, length } from 'vee-validate/dist/rules';

extend('email', { ...email, message: 'Should be a valid email address' });
extend('length', { ...length, message: 'Should at least be 6 characters long' });
extend('required', { ...required, message: 'This field is required' });

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      isLoading: false,
      isLogin: true,
      email: null,
      password: null
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
    },
    onSwitchAuthMode() {
      this.isLogin = !this.isLogin;
      this.$refs.validator.reset();
      this.email = null;
      this.password = null;
    },
    onSubmit() {
      console.log(this.email, this.password);
      if (this.isLogin) {
        // Send a request to login
      } else {
        // Send a request to signup
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
