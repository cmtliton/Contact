import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
  state: {
  	headers: [
      {text: 'Id', value: 'id'},
      {text: 'Name', value: 'name'},
      {text: 'Address', value: 'address'},
      {text: 'Mobile No', value: 'mobileno'},
      {text: 'Actions', value: 'name', sortable: false, align: 'left'}
      ],
     persons: []
  }
})
