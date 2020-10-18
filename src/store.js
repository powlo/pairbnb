import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: true,
    places: [
      {
        id: 'p1',
        title: 'Manhatten Mansion',
        description: 'In the heart of New York City',
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        price: 149.99,
        availableFrom: new Date('2020-01-01'),
        availableTo: new Date('2020-12-31')
      },
      {
        id: 'p2',
        title: "L'Amour Toujour",
        description: 'A romantic place in Paris',
        imageUrl: 'https://images.unsplash.com/photo-1471623600634-4d04cfc56a27',
        price: 189.99,
        availableFrom: new Date('2020-03-01'),
        availableTo: new Date('2020-11-30')
      },
      {
        id: 'p3',
        title: 'The Foggy Palace',
        description: 'Not your average city trip',
        imageUrl: 'https://images.unsplash.com/photo-1531383339897-f369f6422e40',
        price: 99.99,
        availableFrom: new Date('2020-06-01'),
        availableTo: new Date('2021-01-31')
      }
    ],
    bookings: [
      {
        id: 'xyz',
        placedId: 'p2',
        placeTitle: 'Manhatten Mansion',
        guestNumber: 2,
        userId: 'abc'
      }
    ]
  },
  getters: {
    getPlace(state) {
      // NB how we return a *function* here.
      return id => state.places.find(place => place.id === id);
    }
  },
  actions: {
    addPlace({ commit }, place) {
      return new Promise(resolve => {
        setTimeout(() => {
          commit('ADD_PLACE', place);
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
    ADD_PLACE(state, place) {
      state.places.push(place);
    }
  }
});
