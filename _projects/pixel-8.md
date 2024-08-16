---
layout: default
title: "Pixel-8"
description: "Web based fantasy console"
image: "px8.png"
---

# Pixel-8

A web based fantasy console inspired by Pico-8 that currently uses webgl 1 for rendering but is going to be updated with a new version that uses bitmap image format so that it will be possible to use with older devices that don't support webgl.

<br>

<canvas id="canvas" class="pixelated canvas_1x1"></canvas>

<br>

### Specifications

| **Category** | **Details**         |
|--------------|---------------------|
| Display      | 64, 128, ...        |
| Palette      | 32 colors           |
| Sprites      | string based        |
| Map & Sound  | NA                  |

<script src="https://nxrix.github.io/pixel-8/assets/js/pixel8.js"></script>
<script>
rgb = (r,g,b) => {
  let min = Infinity;
  let n = -1;
  for (let i = 0; i < pixel8.palette.length; i++) {
    const col = pixel8.palette[i];
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
rndascii = () => {
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
_init = () => {
  var colE = document.getElementsByTagName("c");
  for (let i = 0; i < colE.length; i++) {
    col = pixel8.palette[parseInt(colE[i].getAttribute("n"))];
    colE[i].style.color = `rgb(${col[0]},${col[1]},${col[2]})`;
  }
  txt = ["meow","pixel-8!","huh?",":)","hello world!"][Math.floor(Math.random()*5)];
  t = 0;
}
_draw = () => {
  if (t%8==0&&t>24) {
    txt = rndascii();
  }
  cls(0);
  print(txt,(64-txt.length*2+(t&31)-16),14,3);
  for (i=0;i<64;i++) {
    for (j=0;j<64;j++) {
      d = pixel8.bayer8x8[i&7][j&7];
      b = Math.sin(((i^j)+t/2)/16)*128+128+d-32;
      pixel8.pset(i+32,j+32,rgb(b,b,b+b));
    }
  }
  sspr("9,10,0000000000kk0k0kk00kak6ktk0k0ka6tk0k0kff0vvk0k0kdmpk0k0kdkmkpk00kk0k0kk0k00k0k00kkkkkkkkkk",1,128-11,9,10);
  rect(47,103,80,96+25,20);
  line(48,96+24,79,96+24,0);
  for (i=0;i<8;i++) {
    for (j=0;j<4;j++) {
      s = 4;
      x = i*s+48;
      y = j*s+96+8;
      rectfill(x,y,x+s-1,y+s-1,i*4+j);
    }
  }
  t++;
}
pixel8.init(canvas,128,128);
</script>
