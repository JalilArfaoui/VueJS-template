import axios from 'axios'
import store from './../store/store.js'

export default () => {
  var token = store.state.token
  return axios.create({
    baseURL: process.env.VUE_APP_SERVER_PORT,
    timeout: 3000,
    headers: { 'x-auth': token }
  })
}

// export default {
//   function (credentials) {
//     // this makes a post request to the register endpoint on the express server using the credentials passed
//     return axios.create({
//         baseURL: process.env.SERVER_PORT,
//         timeout: 1000,
//         headers: {'x-auth': store.state.token}
//       })
//   }
