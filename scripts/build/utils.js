class Trace {
  traces = {}

  start(file) {
    this.traces[file] = Date.now()
  }

  end(file) {
    return `${Date.now() - this.traces[file]}ms`
  }
}

const consoleToString = (...array) => {
  console.log(array.join(' '))
}

module.exports = {
  trace: new Trace(),
  consoleToString
}
