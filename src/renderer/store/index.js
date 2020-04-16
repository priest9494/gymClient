import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const subsModule = {
  namespaced: true,
  state: {
    isAddOperation: false,
    isEditOperation: false
  },
  getters: {
    isAddOperation: state => {
      return state.isAddOperation
    },
    isEditOperation: state => {
      return state.isEditOperation
    }
  },
  mutations: {
    setIsAddOperation (state, value) {
      state.isAddOperation = value
    },
    setIsEditOperation (state, value) {
      state.isEditOperation = value
    }
  }
}

const clientsModule = {
  namespaced: true,
  state: {
    isAddOperation: false,
    isPictureTaken: false,
    isEditOperation: false,
    isVideoShow: false,
    pictureFromDatabase: '',
    clientPhoto: ''
  },
  getters: {
    pictureFromDatabase: state => {
      return state.pictureFromDatabase
    },
    clientPhoto: state => {
      return state.clientPhoto
    },
    isAddOperation: state => {
      return state.isAddOperation
    },
    isPictureTaken: state => {
      return state.isPictureTaken
    },
    isEditOperation: state => {
      return state.isEditOperation
    },
    isVideoShow: state => {
      return !state.isPictureTaken
    }
  },
  mutations: {
    setClientPhoto (state, value) {
      state.clientPhoto = value
    },
    setPictureFromDatabase (state, value) {
      state.pictureFromDatabase = value
    },
    setIsAddOperation (state, value) {
      state.isAddOperation = value
    },
    setIsEditOperation (state, value) {
      state.isEditOperation = value
    },
    setIsPictureTaken (state, value) {
      state.isPictureTaken = value
    }
  }
}

export const store = new Vuex.Store({
  modules: {
    clientsFrame: clientsModule,
    subsFrame: subsModule
  }
})
