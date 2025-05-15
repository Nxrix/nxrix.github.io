---
layout: default
title: "Pixel-8"
description: "Web based fantasy console"
image: "px8.png"
---

## Pixel-8

A web based fantasy console inspired by Pico-8.

<canvas id="canvas" class="canvas_1x1 pixelated"></canvas>

## Usage

First you need to include the script
```html
<script src="https://nxrix.github.io/pixel-8/src/pixel8.js"></script>
```

Then you need a canvas to draw the screen buffer onto it
```js
const px8 = new Pixel8(128,128);

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const img = ctx.createImageData(px8.w,px8.h);
const img_data = img.data;
canvas.width = px8.w;
canvas.height = px8.h;
document.body.appendChild(canvas);

let t = 0;
const update = () => {

  px8.cls();
  px8.print("Hello",px8.w2-2*5,px8.h2-2,3);
  t++;

  for (let i = 0; i < px8.w*px8.h; i++) {
    const c = Pixel8.palette[px8.buffer[i]];
    const index = i * 4;
    img_data[index    ] = c[0];
    img_data[index + 1] = c[1];
    img_data[index + 2] = c[2];
    img_data[index + 3] = 255;
  }
  ctx.putImageData(img,0,0);
  requestAnimationFrame(update);
};
update();
```

## API

The drawing API is pretty similar to Pico8

`cls(c)`: Fills the buffer with color `c`

`pset(x,y,c)`: Set color of pixel `[x,y]` to `c`

`pget(x,y)`: Get color of pixel `[x,y]`

`camera(x,y)`: Move camera to `[x,y]`. Can be reset using `camera()`

`clip(x0,y0,x1,y1)`: Clip drawing to `[x0,y0]` & `[x1,y1]`. Can be reset using `clip()`

`fillp(p,c)`: Set a pattern applied to all drawing functions. `p` is a number with 16 bits and each 4x4 area gets the same pattern. `c` is the pattern's base color. If `c` was 0, the pattern color will be transparent (use 32 for black). Pattern can be reset using `fillp()`

`palt(c,t)`: Set color `c` to be transparent or not. Can be reset using `palt()`

`line(x0,y0,x1,y1,c)`: Draw a line from `[x0,y0]` to `[x1,y1]` with color `c`

`rect(x0,y0,x1,y1,c)`: Draw a rectangle from `[x0,y0]` to `[x1,y1]` with color `c`

`rectfill(x0,y0,x1,y1,c)`: Draw a filled rectangle from `[x0,y0]` to `[x1,y1]` with color `c`

`circ(x,y,r,c)`: Draw a circle with radius `r` at `[x,y]` with color `c`

`circfill(x,y,r,c)`: Draw a filled circle with radius `r` at `[x,y]` with color `c`

`sspr(s,x,y,w,h)`: Draw sprite `s` at `[x,y]` with width `w` and height `h`. The sprite should be exported using [PNG to sprite tool](./)

`print(t,x,y,c)`: Print string `t` at `[x,y]` with color `c`

<script src="https://nxrix.github.io/pixel-8/src/pixel8.js"></script>
<script>
const rgb = (r,g,b) => {
  let min = Infinity;
  let n = -1;
  for (let i = 0; i < Pixel8.palette.length; i++) {
    const col = Pixel8.palette[i];
    const dist = Math.sqrt(
      (r - col[0]) ** 2 + 
      (g - col[1]) ** 2 +
      (b - col[2]) ** 2
    );
    if (dist < min) {
      min = dist;
      n = i;
    }
  }
  return n;
}
const rndascii = () => {
  const min = 32;
  const max = 126;
  const l = Math.random()*16+16;
  let s = "";
  for (i=0;i<l;i++) {
    const rnda = Math.floor(Math.random() * (max - min + 1)) + min;
    s += String.fromCharCode(rnda);
  }
  return s;
}

const px8 = new Pixel8(128,128);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = ctx.createImageData(px8.w,px8.h);
const img_data = img.data;
canvas.width = px8.w;
canvas.height = px8.h;

/*let colE = document.getElementsByTagName("c");
for (let i = 0; i < colE.length; i++) {
  col = pixel8.palette[parseInt(colE[i].getAttribute("n"))];
  colE[i].style.color = `rgb(${col[0]},${col[1]},${col[2]})`;
}*/
let txt = ["meow","pixel-8!","huh?",":)","hello world!"][Math.floor(Math.random()*5)];
let t = 0;

const update = () => {
  if (t%8==0&&t>24) {
    txt = rndascii();
  }
  px8.cls();
  px8.print(txt,(64-txt.length*2+((Math.floor(t/4)*4)&31)-16),14,3);
  for (i=0;i<64;i++) {
    for (j=0;j<64;j++) {
      d = Pixel8.bayer8x8[i&7][j&7];
      b = Math.sin(((i^j)+t/2)/16)*128+128+d-32;
      px8._pset(i+32,j+32,rgb(b,b,b+b));
    }
  }
  px8.sspr("9,10,0000000000kk0k0kk00kak6ktk0k0ka6tk0k0kff0vvk0k0kdmpk0k0kdkmkpk00kk0k0kk0k00k0k00kkkkkkkkkk",1,128-11,9,10);
  px8.rect(47,103,80,96+25,20);
  px8.line(48,96+24,79,96+24,0);
  for (i=0;i<8;i++) {
    for (j=0;j<4;j++) {
      s = 4;
      x = i*s+48;
      y = j*s+96+8;
      px8.rectfill(x,y,x+s-1,y+s-1,i*4+j);
    }
  }
  t++;

  for (let i = 0; i < px8.w*px8.h; i++) {
    const c = Pixel8.palette[px8.buffer[i]];
    const index = i * 4;
    img_data[index    ] = c[0];
    img_data[index + 1] = c[1];
    img_data[index + 2] = c[2];
    img_data[index + 3] = 255;
  }
  ctx.putImageData(img,0,0);
  requestAnimationFrame(update);
}
update();
</script>
