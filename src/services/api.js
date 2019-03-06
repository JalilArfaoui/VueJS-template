import axios from 'axios'
import store from './../store/store.js'
import NProgress from 'nprogress'

export default () => {
  var token = store.state.token
  const instance = axios.create({
    baseURL: process.env.VUE_APP_SERVER_PORT,
    timeout: 300000, // usually 3sec but as admins can upload video, extend it to 300sec
    headers: { 'x-auth': token }
  })

  // before a request is made start the nprogress
  instance.interceptors.request.use(config => {
    NProgress.start()
    return config
  })

  // before a response is returned stop nprogress
  instance.interceptors.response.use(response => {
    NProgress.done()
    return response
  })

  return instance
}
