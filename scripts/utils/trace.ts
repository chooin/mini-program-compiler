import {yellow, white, red} from 'kleur';

class Trace {
  traces = Object.create(null);

  start(file: string): void {
    this.traces[file] = Date.now();
  }

  end(file: string): string {
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
