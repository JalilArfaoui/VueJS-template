// this file export an object with a method attach to it: register
import Api from './api'

export default {
  createClient (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('createClient', credentials)
  },
  getClients (credentials) {
    // this makes a get request to the register endpoint on the express server using the credentials passed
    return Api().get('getClients', credentials)
  },
  editClient (credentials) {
    // this makes a put request to the register endpoint on the express server using the credentials passed
    return Api().put('editClient', credentials)
  },
  deleteClient (clientId) {
    // this makes a put request to the register endpoint on the express server using the credentials passed
    return Api().delete(clientId + '/client')
  },
  register (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('register', credentials)
  },
  registerAdmin (credentials) {
    return Api().post('registerAdmin', credentials)
  },
  getUsers (company) {
    // this makes a get request to the register endpoint on the express server using the credentials passed
    return Api().get('getUsers/' + company)
  },
  editUser (credentials) {
    // this makes a put request to the register endpoint on the express server using the credentials passed
    return Api().put('editUser', credentials)
  },
  deleteUser (userId) {
    // this makes a put request to the register endpoint on the express server using the credentials passed
    return Api().delete(userId + '/user')
  },
  createCoach (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('createCoach', credentials)
  },
  getCoachs (credentials) {
    // this makes a get request to the register endpoint on the express server using the credentials passed
    return Api().get('getCoachs', credentials)
  },
  editCoach (credentials) {
    // this makes a put request to the register endpoint on the express server using the credentials passed
    return Api().put('editCoach', credentials)
  },
  deleteCoach (coachId) {
    // this makes a put request to the register endpoint on the express server using the credentials passed
    return Api().delete(coachId + '/coach')
  },
  avatarUpload (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('avatarUpload', credentials, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
