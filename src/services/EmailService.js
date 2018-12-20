// this file export an object with a method attach to it: register
import Api from './api'

export default {
  sendEmail (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('sendEmail', credentials)
  },
  sendAuthEmail (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('sendAuthEmail', credentials)
  },
  sendResetPwdEmail (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('sendResetPwdEmail', credentials)
  }
}

// AuthenticationService.register({
//   email: 'testing@gmail.com',
//   password: '123456'
// })
