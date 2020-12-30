import Vue from 'vue';
import Vuex from 'vuex';
import environment from './environments/environment';

Vue.use(Vuex);

const baseUrl = `https://${environment.firebaseProjectId}.firebaseio.com`;

export default new Vuex.Store({
  state: {
    isAuthenticated: true,
    userId: 'abc',
    places: [],
    bookings: []
  },
  getters: {
    getUserId(state) {
      return state.userId;
    }
  },
  actions: {
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
    fetchBookings({ commit, state }) {
      return fetch(`${baseUrl}/bookings.json?orderBy="userId"&equalTo="${state.userId}"`)
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
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
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
