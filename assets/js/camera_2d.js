class Camera2D {
  constructor(element, options = {}, onUpdate = () => {}) {
    this.el = element;
    const defaults = {
      x: 0,
      y: 0,
      z: 1,
      minZoom: 0.5,
      maxZoom: 10,
      minX: -Infinity,
      maxX: Infinity,
      minY: -Infinity,
      maxY: Infinity,
    };
    this.opts = Object.assign({}, defaults, options);
    this.state = {
      x: this.opts.x,
      y: this.opts.y,
      z: this.opts.z,
      do: null,
      xo: 0,
      yo: 0,
      cx: 0,
      cy: 0,
      drag: false,
      touch: false,
      locked: false,
    };
    this.onUpdate = onUpdate;
    this._bindEvents();
    this._update();
  }
  setParams(newParams = {}) {
    if (typeof newParams.x == "number") {
      this.state.x = newParams.x;
    }
    if (typeof newParams.y == "number") {
      this.state.y = newParams.y;
    }
    if (typeof newParams.z == "number") {
      this.state.z = newParams.z;
    }
    if (typeof newParams.minZoom == "number") this.opts.minZoom = newParams.minZoom;
    if (typeof newParams.maxZoom == "number") this.opts.maxZoom = newParams.maxZoom;
    if (typeof newParams.minX == "number") this.opts.minX = newParams.minX;
    if (typeof newParams.maxX == "number") this.opts.maxX = newParams.maxX;
    if (typeof newParams.minY == "number") this.opts.minY = newParams.minY;
    if (typeof newParams.maxY == "number") this.opts.maxY = newParams.maxY;
    this._clampValues();
    this._update();
  }
  lock() {
    this.state.locked = true;
  }
  unlock() {
    this.state.locked = false;
  }
  /*getState() {
    return { x: this.state.x, y: this.state.y, z: this.state.z };
  }*/
  _update() {
    this.onUpdate(this.state);
  }
  _clampValues() {
    this.state.x = Math.min(Math.max(this.state.x, this.opts.minX), this.opts.maxX);
    this.state.y = Math.min(Math.max(this.state.y, this.opts.minY), this.opts.maxY);
    this.state.z = Math.min(Math.max(this.state.z, this.opts.minZoom), this.opts.maxZoom);
  }
  _bindEvents() {
    this.el.addEventListener("touchstart", (e) => {
      if (this.state.locked) return;
      e.preventDefault();
      if (e.touches.length == 2) {
        this.state.do = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        this.state.xo = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        this.state.yo = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        this.state.cx = this.state.xo;
        this.state.cy = this.state.yo;
        this.state.touch = true;
      } else {
        this.state.touch = false;
        this.state.xo = e.touches[0].clientX;
        this.state.yo = e.touches[0].clientY;
      }
    });
    this.el.addEventListener("touchmove", (e) => {
      if (this.state.locked) return;
      e.preventDefault();
      if (e.touches.length == 2) {
        const ndist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const nz = Math.max(
          Math.min(this.state.z * ndist / this.state.do, this.opts.minZoom),
          this.opts.maxZoom
        );
        this.state.do = ndist;
        const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const ox = mx - this.el.clientWidth / 2;
        const oy = my - this.el.clientHeight / 2;
        this.state.x -= (ox / this.state.z - ox / nz) - ((mx - this.state.cx) / nz);
        this.state.y -= (oy / this.state.z - oy / nz) - ((my - this.state.cy) / nz);
        this.state.xo = ox;
        this.state.yo = oy;
        this.state.cx = mx;
        this.state.cy = my;
        this.state.z = nz;
      } else {
        if (!this.state.touch) {
          this.state.x += (e.touches[0].clientX - this.state.xo) / this.state.z;
          this.state.y += (e.touches[0].clientY - this.state.yo) / this.state.z;
          this.state.xo = e.touches[0].clientX;
          this.state.yo = e.touches[0].clientY;
        }
      }
      this._clampValues();
      this._update();
    });
    this.el.addEventListener("mousedown", (e) => {
      if (this.state.locked) return;
      this.state.drag = true;
      this.state.xo = e.clientX;
      this.state.yo = e.clientY;
      this.state.touch = false;
    });
    this.el.addEventListener("mousemove", (e) => {
      if (this.state.locked || !this.state.drag) return;
      this.state.x += (e.clientX - this.state.xo) / this.state.z;
      this.state.y += (e.clientY - this.state.yo) / this.state.z;
      this.state.xo = e.clientX;
      this.state.yo = e.clientY;
      this._clampValues();
      this._update();
    });
    this.el.addEventListener("mouseup", () => {
      this.state.drag = false;
    });
    this.el.addEventListener("mouseleave", () => {
      this.state.drag = false;
    });
    this.el.addEventListener("wheel", (e) => {
      if (this.state.locked) return;
      e.preventDefault();
      const mx = e.clientX - this.el.clientWidth / 2;
      const my = e.clientY - this.el.clientHeight / 2;
      const factor = e.deltaY < 0 ? 1.125 : 0.875;
      const nz = Math.min(
        Math.max(this.state.z * factor, this.opts.minZoom),
        this.opts.maxZoom
      );
      this.state.x -= (mx / this.state.z - mx / nz);
      this.state.y -= (my / this.state.z - my / nz);
      this.state.z = nz;
      this._clampValues();
      this._update();
    });
  }
}
