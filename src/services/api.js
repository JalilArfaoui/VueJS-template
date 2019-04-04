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

  // before a request is made, start the nprogress loading bar
  instance.interceptors.request.use(config => {
    NProgress.start()
    // NProgress.set(0.4) // To set a progress percentage, call .set(n), where n is a number between 0..1
    // NProgress.inc() // To increment the progress bar, just use .inc(). This increments it with a random amount. This will never get to 100%: use it for every image load (or similar).If you want to increment by a specific value, you can pass that as a parameter
    // NProgress.configure({ ease: 'ease', speed: 500 }) // Adjust animation settings using easing (a CSS easing string) and speed (in ms). (default: ease and 200)
    // NProgress.configure({ trickleSpeed: 800 }) // Adjust how often to trickle/increment, in ms.
    NProgress.configure({ showSpinner: false }) // Turn off loading spinner by setting it to false. (default: true)
    // NProgress.configure({ parent: 'body' }) // specify this to change the parent container. (default: body)
    return config
  })

  // before a response is returned stop nprogress
  instance.interceptors.response.use(function (response) {
    NProgress.done()
    return response
  }, function (error) {
    NProgress.done()
    return Promise.reject(error)
  })

  return instance
}
