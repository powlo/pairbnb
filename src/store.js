import Vue from 'vue';
import Vuex from 'vuex';
import environment from './environments/environment';

Vue.use(Vuex);

const baseUrl = `https://${environment.firebaseProjectId}.firebaseio.com`;

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
    signup({ commit }, { email, password }) {
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
            return resData;
          }
        });
    },
    login({ commit }, { email, password }) {
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
            commit('SET_USER_DATA', resData);
          }
        });
    },
    addPlace({ commit }, p) {
      const place = { ...p };
      return fetch(`${baseUrl}/offered-places.json`, {
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
    updatePlace({ commit }, place) {
      // NB we won't be able to update place if we come directly to the edit page.
      return fetch(`${baseUrl}/offered-places/${place.id}.json`, {
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
    getPlace({ commit }, id) {
      return fetch(`${baseUrl}/offered-places/${id}.json`)
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
    fetchPlaces({ commit }) {
      return fetch(`${baseUrl}/offered-places.json`)
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
    addBooking({ commit }, b) {
      const booking = { ...b };
      return fetch(`${baseUrl}/bookings.json`, {
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
    cancelBooking({ commit }, bookingId) {
      return fetch(`${baseUrl}/bookings/${bookingId}.json`, {
        method: 'delete'
      }).then(() => {
        commit('CANCEL_BOOKING', bookingId);
      });
    },
    fetchBookings({ commit, getters }) {
      return fetch(`${baseUrl}/bookings.json?orderBy="userId"&equalTo="${getters.userId}"`)
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
      const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
      const user = {
        id: userData.localId,
        email: userData.email,
        token: userData.idToken,
        tokenExpiration: expirationTime
      };
      state.user = user;
    },
    LOGOUT(state) {
      state.user = null;
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
