// this file export an object with a method attach to it: register
import Api from './api'

export default {
  createMedia (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('createMedia', credentials)
  },
  getMedias (credentials) {
    // this makes a get request to the register endpoint on the express server using the credentials passed
    return Api().get('getMedias', credentials)
  },
  getMediaById (credentials) {
    // this makes a get request to the register endpoint on the express server using the credentials passed
    return Api().put('getMediaById', credentials)
  },
  editMedia (credentials) {
    // this makes a put request to the register endpoint on the express server using the credentials passed
    return Api().put('editMedia', credentials)
  },
  deleteMedia (mediaId) {
    // this makes a put request to the register endpoint on the express server using the credentials passed
    return Api().delete(mediaId + '/media')
  },
  mediaUpload (credentials) {
    // this makes a post request to the register endpoint on the express server using the credentials passed
    return Api().post('mediaUpload', credentials, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
