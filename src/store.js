import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: true,
    userId: 'abc',
    places: [],
    bookings: []
  },
  getters: {
    getPlace(state) {
      return id => {
        return state.places.find(p => p.id === id);
      };
    },
    getUserId(state) {
      return state.userId;
    }
  },
  actions: {
    addPlace({ commit }, p) {
      // return new Promise(resolve => {
      //   setTimeout(() => {
      //     commit('CREATE_PLACE', place);
      //     resolve();
      //   }, 1000);
      // });
      const place = { ...p };
      return fetch('https://udemy-ionic-982b7.firebaseio.com/offered-places.json', {
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
      return new Promise(resolve => {
        setTimeout(() => {
          commit('UPDATE_PLACE', place);
          resolve();
        }, 1000);
      });
    },
    fetchPlaces({ commit }) {
      return fetch('https://udemy-ionic-982b7.firebaseio.com/offered-places.json')
        .then(response => {
          if (!response.ok) {
            throw Error(`${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          commit('CLEAR_PLACES');
          Object.keys(data).forEach(id => {
            const place = data[id];
            place.id = id;
            place.availableFrom = new Date(place.availableFrom);
            place.availableTo = new Date(place.availableTo);
            commit('CREATE_PLACE', place);
          });
        });
    },

    addBooking({ commit }, booking) {
      return new Promise(resolve => {
        setTimeout(() => {
          commit('CREATE_BOOKING', booking);
          resolve();
        }, 1000);
      });
    },
    cancelBooking({ commit }, bookingId) {
      return new Promise(resolve => {
        setTimeout(() => {
          commit('CANCEL_BOOKING', bookingId);
          resolve();
        }, 1000);
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
      state.places = [];
    },
    CREATE_BOOKING(state, booking) {
      state.bookings.push(booking);
    },
    CANCEL_BOOKING(state, bookingId) {
      const index = state.bookings.map(p => p.id).indexOf(bookingId);
      state.bookings.splice(index, 1);
    }
  }
});
