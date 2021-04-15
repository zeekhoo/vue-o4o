import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  key: 'okta-o4o',
  storage: window.localStorage
})

const store = new Vuex.Store({
  state: {
    o4oToken: ""
  },
  getters: {
    o4oToken: state => {
      console.log("Vuex: gettters.o4oToken", state.o4oToken);
      return state.o4oToken;
    }
  },
  mutations: {
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION,
    setO4oToken: (state, payload) => {
      console.log("vuex: mutations.setO4oToken", payload);
      state.o4oToken = payload;
    },
    logout: (state) => {
      state.o4oToken = "";
    }
  },
  // actions: {
  //     setO4oToken: ({commit}, payload) => {
  //         console.log('do commit setO4oToken');
  //         commit('setO4oToken', payload);
  //     }
  // },
  plugins: [vuexLocal.plugin]
});

export default store;