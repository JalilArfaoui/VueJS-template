import Api from './api'

export default {
  fetchMachines () {
    return Api().get('', { params: { cmd: 'query', fcn: 'list', args: 'ssm' } })
  },
  fetchMachine (id) {
    return Api().get('', { params: { cmd: 'query', fcn: 'ssm', args: id } })
  }
}
