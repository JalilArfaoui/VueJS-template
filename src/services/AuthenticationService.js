// this file export an object with a method attach to it: register
import Api from './api'

export default {
  fetchUsers () {
    return Api().get('', { params: { cmd: 'query', fcn: 'list', args: 'user' } })
  },
  fetchUser (name) {
    return Api().get('', { params: { cmd: 'query', fcn: 'user', args: name } })
  },
  register (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('register', credentials)
  },
  login (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('login', credentials)
  },
  findByEmail (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('findByEmail', credentials)
  },
  registerName (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('registerName', credentials)
  },
  registerPwd (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('registerPwd', credentials)
  },
  confirmUser (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('confirmUser', credentials)
  },
  verifyHash (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('verifyHash', credentials)
  },
  resetHash (credentials) {
    return Api().post('resetHash', credentials)
  }
}

// AuthenticationService.register({
//   email: 'testing@gmail.com',
//   password: '123456'
// })
