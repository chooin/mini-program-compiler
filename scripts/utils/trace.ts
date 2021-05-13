import {yellow, white, red} from 'kleur';

class Trace {
  traces = {};

  start(file) {
    this.traces[file] = Date.now();
  }

  end(file) {
    const traceTime = Date.now() - this.traces[file];
    if (traceTime > 1000) {
      return red(`${traceTime}ms`.padEnd(6));
    }
    if (traceTime > 500) {
      return yellow(`${traceTime}ms`.padEnd(6));
    }
    return white(`${traceTime}ms`.padEnd(6));
  }
}

export default new Trace();
