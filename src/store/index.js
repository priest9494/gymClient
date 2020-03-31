import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const subsModule = {
    namespaced: true,
    state: {
        isAddOperation: false,
        isEditOperation: false
    },
    getters: {
        isAddOperation: state => {
            console.log('get isAddOperation: ' + state.isAddOperation)
            return state.isAddOperation
        },
        isEditOperation: state => {
            console.log('get isEditOperation: ' + state.isAddOperation)
            return state.isEditOperation
        }
    },
    mutations: {
        setIsAddOperation(state, value) {
            console.log('isAddOperation state changed: ' + value)
            state.isAddOperation = value
        },
        setIsEditOperation(state, value) {
            console.log('isEditOperation state changed: ' + value)
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
            //console.log('get isAddOperation: ' + state.isAddOperation)
            return state.isAddOperation
        },
        isPictureTaken: state => {
            //console.log('get isPictureTaken: ' + state.isPictureTaken)
            return state.isPictureTaken
        },
        isEditOperation: state => {
            //console.log('get isEditOperation: ' + state.isEditOperation)
            return state.isEditOperation
        },
        isVideoShow: state => {
            //console.log('get isVideoShow: ' + !state.isPictureTaken)
            return !state.isPictureTaken
        }
    },
    mutations: {
        setClientPhoto(state, value) {
            if(!value) {
                //console.log('client photo removed')
            }
            state.clientPhoto = value
        },
        setPictureFromDatabase(state, value) {
            state.pictureFromDatabase = value
        },
        setIsAddOperation (state, value) {
            //console.log('isAddOperation state changed: ' + value)
            state.isAddOperation = value
        },
        setIsEditOperation (state, value) {
            //console.log('isEditOperation state changed: ' + value)
            state.isEditOperation = value
        },
        setIsPictureTaken (state, value) {
            //console.log('isPictureTaken state changed: ' + value)
            state.isPictureTaken = value
        }
    }
}

export const store = new Vuex.Store({
    modules: {
        clientsFrame: clientsModule,
        subsFrame: subsModule
    }
});