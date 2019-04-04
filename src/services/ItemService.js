// this file export an object with a method attach to it: register
import Api from './api'

export default {
  createItem (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('createItem', credentials)
  },
  getItems (credentials) {
    // this makes a get request to the register endpoint on the express server using the credentials passed
    return Api().get('getItems', credentials)
  },
  editItem (credentials) {
    // this makes a put request to the register endpoint on the express server using the credentials passed
    return Api().put('editItem', credentials)
  },
  deleteItem (clientId) {
    // this makes a delete request to the register endpoint on the express server using the credentials passed
    return Api().delete(clientId + '/item')
  }
}
