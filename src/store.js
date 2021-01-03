import Vue from 'vue';
import Vuex from 'vuex';
import { Plugins } from '@capacitor/core';
import environment from './environments/environment';

Vue.use(Vuex);

const baseUrl = `https://${environment.firebaseProjectId}.firebaseio.com`;

let activeLogoutTimer;

function storeAuthData(userId, email, token, tokenExpirationDate) {
  const data = JSON.stringify({
    userId,
    email,
    token,
    tokenExpirationDate
  });
  Plugins.Storage.set({
    key: 'authData',
    value: data
  });
}

export default new Vuex.Store({
  state: {
    isAuthenticated: true,
    user: null,
    places: [],
    bookings: []
  },
  getters: {
    userId(state) {
      return state.user && state.user.id;
    },
    userIsAuthenticated(state, getters) {
      return !!getters.userToken;
    },
    userToken(state) {
      if (!state.user || state.user.tokenExpiration <= new Date()) {
        return null;
      }
      return state.user.token;
    }
  },
  actions: {
    /* eslint-disable-next-line no-unused-vars */
    signup({ commit, dispatch }, { email, password }) {
      return fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
        {
          method: 'post',
          body: JSON.stringify({ email, password, returnSecureToken: true })
        }
      )
        .then(response => {
          return response.json();
        })
        .then(resData => {
          if (resData.error) {
            throw new Error(resData.error.message);
          } else {
            const tokenDuration = +resData.expiresIn * 1000;
            const user = {
              id: resData.localId,
              email: resData.email,
              token: resData.idToken,
              tokenExpiration: new Date(new Date().getTime() + tokenDuration)
            };
            dispatch('autoLogout', tokenDuration);
            commit('SET_USER_DATA', user);
          }
        });
    },
    login({ commit, dispatch }, { email, password }) {
      return fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        {
          method: 'post',
          body: JSON.stringify({ email, password, returnSecureToken: true })
        }
      )
        .then(response => {
          return response.json();
        })
        .then(resData => {
          if (resData.error) {
            throw new Error(resData.error.message);
          } else {
            const tokenDuration = +resData.expiresIn * 1000;
            const user = {
              id: resData.localId,
              email: resData.email,
              token: resData.idToken,
              tokenExpiration: new Date(new Date().getTime() + tokenDuration)
            };
            dispatch('autoLogout', tokenDuration);
            commit('SET_USER_DATA', user);
          }
        });
    },
    autoLogin({ commit, dispatch }) {
      return Plugins.Storage.get({ key: 'authData' }).then(storedData => {
        if (!storedData || !storedData.value) {
          throw new Error('No stored data.');
        }
        const parsedData = JSON.parse(storedData.value);
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        const tokenDuration = expirationTime - new Date();
        if (tokenDuration <= 0) {
          throw new Error('Expired token.');
        }
        const user = {
          id: parsedData.userId,
          email: parsedData.email,
          token: parsedData.token,
          tokenExpiration: expirationTime
        };
        dispatch('autoLogout', tokenDuration);
        commit('SET_USER_DATA', user);
      });
    },
    autoLogout({ commit }, duration) {
      if (activeLogoutTimer) {
        clearTimeout(activeLogoutTimer);
      }
      activeLogoutTimer = setTimeout(() => {
        commit('LOGOUT');
      }, duration);
    },
    addPlace({ commit, getters }, p) {
      const place = { ...p };
      return fetch(`${baseUrl}/offered-places.json?auth=${getters.userToken}`, {
        method: 'post',
        body: JSON.stringify(place)
      })
        .then(response => {
          if (!response.ok) {
            throw Error(`${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          place.id = data.name;
          commit('CREATE_PLACE', place);
        });
    },
    updatePlace({ commit, getters }, place) {
      // NB we won't be able to update place if we come directly to the edit page.
      return fetch(`${baseUrl}/offered-places/${place.id}.json?auth=${getters.userToken}`, {
        method: 'PUT',
        body: JSON.stringify(place),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (!response.ok) {
          throw Error(`${response.status} ${response.statusText}`);
        }
        commit('UPDATE_PLACE', place);
      });
    },
    getPlace({ commit, getters }, id) {
      return fetch(`${baseUrl}/offered-places/${id}.json?auth=${getters.userToken}`)
        .then(response => {
          if (!response.ok) {
            throw Error(`${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          commit('CLEAR_PLACES');
          const place = data;
          place.availableFrom = new Date(place.availableFrom);
          place.availableTo = new Date(place.availableTo);
          commit('CREATE_PLACE', place);
          return { ...place };
        });
    },
    fetchPlaces({ commit, getters }) {
      return fetch(`${baseUrl}/offered-places.json?auth=${getters.userToken}`)
        .then(response => {
          if (!response.ok) {
            throw Error(`${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          commit('CLEAR_PLACES');
          if (!data) return;
          Object.keys(data).forEach(id => {
            const place = data[id];
            place.id = id;
            place.availableFrom = new Date(place.availableFrom);
            place.availableTo = new Date(place.availableTo);
            commit('CREATE_PLACE', place);
          });
        });
    },
    addBooking({ commit, getters }, b) {
      const booking = { ...b };
      return fetch(`${baseUrl}/bookings.json?auth=${getters.userToken}`, {
        method: 'post',
        body: JSON.stringify(booking)
      })
        .then(response => {
          if (!response.ok) {
            throw Error(`${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          booking.id = data.name;
          commit('CREATE_BOOKING', booking);
        });
    },
    cancelBooking({ commit, getters }, bookingId) {
      return fetch(`${baseUrl}/bookings/${bookingId}.json?auth=${getters.userToken}`, {
        method: 'delete'
      }).then(() => {
        commit('CANCEL_BOOKING', bookingId);
      });
    },
    fetchBookings({ commit, getters }) {
      return fetch(
        `${baseUrl}/bookings.json?auth=${getters.userToken}&orderBy="userId"&equalTo="${getters.userId}"`
      )
        .then(response => {
          if (!response.ok) {
            throw Error(`${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          commit('CLEAR_BOOKINGS');
          if (!data) return;
          Object.keys(data).forEach(id => {
            const booking = data[id];
            booking.id = id;
            booking.startDate = new Date(booking.startDate);
            booking.endDate = new Date(booking.endDate);
            commit('CREATE_BOOKING', booking);
          });
        });
    }
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      // Need to move this out.
      // const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
      state.user = userData;
      storeAuthData(
        userData.id,
        userData.email,
        userData.token,
        userData.tokenExpiration.toISOString()
      );
    },
    LOGOUT(state) {
      state.user = null;
      if (activeLogoutTimer) {
        clearTimeout(activeLogoutTimer);
      }
      Plugins.Storage.remove({
        key: 'authData'
      });
    },
    CREATE_PLACE(state, place) {
      state.places.push(place);
    },
    UPDATE_PLACE(state, place) {
      const existingPlace = state.places.find(p => p.id === place.id);
      Object.assign(existingPlace, place);
    },
    CLEAR_PLACES(state) {
      state.places.splice(0);
    },
    CREATE_BOOKING(state, booking) {
      state.bookings.push(booking);
    },
    CANCEL_BOOKING(state, bookingId) {
      const index = state.bookings.map(p => p.id).indexOf(bookingId);
      state.bookings.splice(index, 1);
    },
    CLEAR_BOOKINGS(state) {
      // We have to do this .splice() to empty the array while
      // maintaining Vue reactivity. Could also use Vue.set.
      state.bookings.splice(0);
    }
  }
});
