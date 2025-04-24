/**
 * @copyright (c) 2025 Nxrix. All rights reserved.
 */

class Timer {
  constructor(target,interval=1000) {
    this.target = new Date(target);
    this.interval = interval;
    this.id = null;
  }
  start(callback) {
    callback({remaining:this.target-new Date()});
    this.id = setInterval(() => {
      const now = new Date();
      const diff = this.target-now;
      if (diff <= 0) {
        clearInterval(this.id);
        callback({
          remaining: 0
        });
      } else {
        callback({
          remaining: diff
        });
      }
    },this.interval);
  }
  stop() {
    if (this.id) {
      clearInterval(this.id);
    }
  }
}
