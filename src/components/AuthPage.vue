<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ isLogin ? 'Login' : 'Signup' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ValidationObserver v-slot="{ handleSubmit, invalid }" ref="validator">
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
                  <ValidationProvider rules="required|min:6" v-slot="{ errors }">
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
                <ion-button type="submit" color="primary" expand="block" :disabled="invalid">{{
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

// Use 'as' to avoid scope conflict with authenticate()
import { required, email as emailRule, min } from 'vee-validate/dist/rules';

extend('email', { ...emailRule, message: 'Should be a valid email address' });
extend('min', { ...min, message: 'Should at least be 6 characters long' });
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
      this.authenticate(this.email, this.password);
    },
    authenticate(email, password) {
      const loginOrSignup = this.isLogin ? 'login' : 'signup';
      this.isLoading = true;
      this.$ionic.loadingController
        .create({
          keyboardClose: true,
          message: 'Logging in...'
        })
        .then(loadingEl => {
          loadingEl.present();
          this.$store
            .dispatch(loginOrSignup, { email, password })
            .then(() => {
              this.isLoading = false;
              loadingEl.dismiss();
              this.$router.push('/places/tabs/discover');
            })
            .catch(err => {
              loadingEl.dismiss();
              // NB dangers of leaking information about what users exist.
              let message = 'Could not sign you up, please try again.';
              if (err.message === 'EMAIL_EXISTS') {
                message = 'This email address already exists!';
              } else if (err.message === 'EMAIL_NOT_FOUND') {
                message = 'Email address could not be found.';
              } else if (err.message === 'INVALID_PASSWORD') {
                message = 'This password is not correct';
              }
              this.showAlert(message);
            });
        });
    },
    showAlert(message) {
      this.$ionic.alertController
        .create({
          header: 'Authentication failed',
          message,
          buttons: ['OK']
        })
        .then(alertEl => alertEl.present());
    }
  }
};
</script>

<style lang="scss" scoped></style>
