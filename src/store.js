import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: true,
    userId: 'abc',
    places: [
      {
        id: 'p1',
        title: 'Manhatten Mansion',
        description: 'In the heart of New York City',
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        price: 149.99,
        availableFrom: new Date('2020-01-01'),
        availableTo: new Date('2020-12-31'),
        userId: 'abc'
      },
      {
        id: 'p2',
        title: "L'Amour Toujour",
        description: 'A romantic place in Paris',
        imageUrl: 'https://images.unsplash.com/photo-1471623600634-4d04cfc56a27',
        price: 189.99,
        availableFrom: new Date('2020-03-01'),
        availableTo: new Date('2020-11-30'),
        userId: 'abc'
      },
      {
        id: 'p3',
        title: 'The Foggy Palace',
        description: 'Not your average city trip',
        imageUrl: 'https://images.unsplash.com/photo-1531383339897-f369f6422e40',
        price: 99.99,
        availableFrom: new Date('2020-06-01'),
        availableTo: new Date('2021-01-31'),
        userId: 'xyz'
      }
    ],
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
    CREATE_BOOKING(state, booking) {
      state.bookings.push(booking);
    },
    CANCEL_BOOKING(state, bookingId) {
      const index = state.bookings.map(p => p.id).indexOf(bookingId);
      state.bookings.splice(index, 1);
    }
  }
});
