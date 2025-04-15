class Camera2D {
  constructor(element, options = {}, onUpdate = () => {}) {
    this.el = element;
    const defaults = {
      x: 0,
      y: 0,
      z: 1,
      minZ: 0.5,
      maxZ: 10,
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
    if (typeof newParams.x == "number") this.state.x = newParams.x;
    if (typeof newParams.y == "number") this.state.y = newParams.y;
    if (typeof newParams.z == "number") this.state.z = newParams.z;
    if (typeof newParams.minZ == "number") this.opts.minZ = newParams.minZ;
    if (typeof newParams.maxZ == "number") this.opts.maxZ = newParams.maxZ;
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

  _update() {
    this.onUpdate(this.state);
  }

  _clampValues() {
    this.state.x = Math.min(Math.max(this.state.x, this.opts.minX), this.opts.maxX);
    this.state.y = Math.min(Math.max(this.state.y, this.opts.minY), this.opts.maxY);
    this.state.z = Math.min(Math.max(this.state.z, this.opts.minZ), this.opts.maxZ);
  }

  _getLocalCoords(clientX, clientY) {
    const rect = this.el.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  _bindEvents() {
    this.el.addEventListener("touchstart", (e) => {
      if (this.state.locked) return;
      e.preventDefault();
      const rect = this.el.getBoundingClientRect();

      if (e.touches.length === 2) {
        this.state.do = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const mid = this._getLocalCoords(
          (e.touches[0].clientX + e.touches[1].clientX) / 2,
          (e.touches[0].clientY + e.touches[1].clientY) / 2
        );
        this.state.xo = mid.x;
        this.state.yo = mid.y;
        this.state.cx = mid.x;
        this.state.cy = mid.y;
        this.state.touch = true;
      } else {
        this.state.touch = false;
        const pos = this._getLocalCoords(e.touches[0].clientX, e.touches[0].clientY);
        this.state.xo = pos.x;
        this.state.yo = pos.y;
      }
    });

    this.el.addEventListener("touchmove", (e) => {
      if (this.state.locked) return;
      e.preventDefault();
      const rect = this.el.getBoundingClientRect();

      if (e.touches.length === 2) {
        const ndist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const nz = Math.min(
          Math.max(this.state.z * ndist / this.state.do, this.opts.minZ),
          this.opts.maxZ
        );
        this.state.do = ndist;

        const mid = this._getLocalCoords(
          (e.touches[0].clientX + e.touches[1].clientX) / 2,
          (e.touches[0].clientY + e.touches[1].clientY) / 2
        );

        const ox = mid.x - this.el.clientWidth / 2;
        const oy = mid.y - this.el.clientHeight / 2;

        this.state.x -= (ox / this.state.z - ox / nz) - ((mid.x - this.state.cx) / nz);
        this.state.y -= (oy / this.state.z - oy / nz) - ((mid.y - this.state.cy) / nz);

        this.state.xo = ox;
        this.state.yo = oy;
        this.state.cx = mid.x;
        this.state.cy = mid.y;
        this.state.z = nz;
      } else if (!this.state.touch) {
        const pos = this._getLocalCoords(e.touches[0].clientX, e.touches[0].clientY);
        this.state.x += (pos.x - this.state.xo) / this.state.z;
        this.state.y += (pos.y - this.state.yo) / this.state.z;
        this.state.xo = pos.x;
        this.state.yo = pos.y;
      }

      this._clampValues();
      this._update();
    });

    this.el.addEventListener("mousedown", (e) => {
      if (this.state.locked) return;
      const pos = this._getLocalCoords(e.clientX, e.clientY);
      this.state.drag = true;
      this.state.xo = pos.x;
      this.state.yo = pos.y;
      this.state.touch = false;
    });

    this.el.addEventListener("mousemove", (e) => {
      if (this.state.locked || !this.state.drag) return;
      const pos = this._getLocalCoords(e.clientX, e.clientY);
      this.state.x += (pos.x - this.state.xo) / this.state.z;
      this.state.y += (pos.y - this.state.yo) / this.state.z;
      this.state.xo = pos.x;
      this.state.yo = pos.y;
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
      const { x: localX, y: localY } = this._getLocalCoords(e.clientX, e.clientY);
      const mx = localX - this.el.clientWidth / 2;
      const my = localY - this.el.clientHeight / 2;
      const factor = e.deltaY < 0 ? 1.125 : 0.875;
      const nz = Math.min(Math.max(this.state.z * factor, this.opts.minZ), this.opts.maxZ);
      this.state.x -= (mx / this.state.z - mx / nz);
      this.state.y -= (my / this.state.z - my / nz);
      this.state.z = nz;
      this._clampValues();
      this._update();
    });
  }
}
