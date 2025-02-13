class Offscreen {
  constructor(w,h) {
    this.w = w;
    this.h = h;
    //this.canvas = new OffscreenCanvas(w,h);
    this.canvas = document.createElement("canvas");
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext("2d");
    this.img = this.ctx.createImageData(w,h);
  }
  set_rgb(pixels,palette) {
    const data = this.img.data;
    for (let i=0;i<this.w*this.h;i++) {
      const c = palette[pixels[i]];
      const n = i*4;
      data[n  ] = c[0];
      data[n+1] = c[1];
      data[n+2] = c[2];
      data[n+3] = 255;
    }
    this.ctx.putImageData(this.img,0,0);
  }
  set_rgba(pixels,palette) {
    const data = this.img.data;
    for (let i=0;i<this.w*this.h;i++) {
      const c = palette[pixels[i]];
      const n = i*4;
      data[n  ] = c[0];
      data[n+1] = c[1];
      data[n+2] = c[2];
      data[n+3] = c[3];
    }
    this.ctx.putImageData(this.img,0,0);
  }
  get() {
    return this.canvas.toDataURL();
  }
}