import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    recipes: [
      {
        id: 'r1',
        title: 'Schnitzel',
        imageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/2/22/Breitenlesau_Krug_Br%C3%A4u_Schnitzel.JPG',
        ingredients: ['French Fries', 'Pork Meat', 'Salad']
      },
      {
        id: 'r2',
        title: 'Spaghetti',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Spaghetti_puttanesca.jpg',
        ingredients: ['Spaghetti', 'Meat', 'Tomatoes']
      }
    ]
  },
  mutations: {
    deleteRecipe(state, id) {
      const index = state.recipes.findIndex(r => r.id === id);
      state.recipes.splice(index, 1);
    }
  },
  getters: {
    getAllRecipes(state) {
      // doesn't achieve much but is kept here to stay in line with Agnular behaviour.
      return state.recipes;
    },
    getRecipe(state) {
      // NB how we return a *function* here.
      return id => state.recipes.find(recipe => recipe.id === id);
    }
  }
});
