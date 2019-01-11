// this file export an object with a method attach to it: register
import Api from './api'

export default {
  createFirstLevel (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('createFirstLevel', credentials)
  },
  getFirstLevels (credentials) {
    // this makes a get request to the register endpoint on the express server using the credentials passed
    return Api().get('getFirstLevels', credentials)
  },
  editFirstLevel (credentials) {
    // this makes a put request to the register endpoint on the express server using the credentials passed
    return Api().put('editFirstLevel', credentials)
  },
  deleteFirstLevel (clientId) {
    // this makes a put request to the register endpoint on the express server using the credentials passed
    return Api().delete(clientId + '/firstlevel')
  },
  createSecondLevel (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('createSecondLevel', credentials)
  },
  // getSecondLevels (credentials) {
  //   // this makes a get request to the register endpoint on the express server using the credentials passed
  //   return Api().get('getSecondLevels', credentials)
  // },
  editSecondLevel (credentials) {
    // this makes a put request to the register endpoint on the express server using the credentials passed
    return Api().put('editSecondLevel', credentials)
  },
  deleteSecondLevel (clientId) {
    // this makes a put request to the register endpoint on the express server using the credentials passed
    return Api().delete(clientId + '/secondlevel')
  },
  createItem (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('createItem', credentials)
  },
  // getItems (credentials) {
  //   // this makes a get request to the register endpoint on the express server using the credentials passed
  //   return Api().get('getItems', credentials)
  // },
  editItem (credentials) {
    // this makes a put request to the register endpoint on the express server using the credentials passed
    return Api().put('editItem', credentials)
  },
  deleteItem (clientId) {
    // this makes a put request to the register endpoint on the express server using the credentials passed
    return Api().delete(clientId + '/item')
  }
}
