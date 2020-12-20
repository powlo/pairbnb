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
      // NB we won't be able to update place if we come directly to the edit page.
      return fetch(`https://udemy-ionic-982b7.firebaseio.com/offered-places/${place.id}.json`, {
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
      return fetch(`https://udemy-ionic-982b7.firebaseio.com/offered-places/${id}.json`)
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
      return fetch('https://udemy-ionic-982b7.firebaseio.com/offered-places.json')
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
