export default {
  traces: {},
  start(file) {
    this.traces[file] = Date.now()
  },
  end(file) {
    return `${Date.now() - this.traces[file]}ms`
  }
}
