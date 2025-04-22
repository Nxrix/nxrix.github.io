/**
 * @copyright   (c) 2025 Nxrix. All rights reserved.
 */

"use strict";

const palette = [
  [0x1d,0x18,0x26],[0x8b,0x7f,0xb0],[0xc3,0xbe,0xe5],[0xff,0xe8,0xe9],
  [0x65,0x26,0x4e],[0xa0,0x1a,0x3d],[0xde,0x1b,0x45],[0xf2,0x63,0x7b],
  [0x8b,0x3f,0x39],[0xbb,0x45,0x31],[0xef,0x5d,0x0e],[0xff,0x95,0x00],
  [0x00,0xa0,0x3d],[0x12,0xd5,0x00],[0xb4,0xd8,0x00],[0xff,0xc3,0x1f],
  [0x00,0x6e,0x69],[0x00,0xae,0x85],[0x00,0xda,0xa7],[0x4f,0xd6,0xff],
  [0x2b,0x27,0x54],[0x3c,0x51,0xaf],[0x18,0x88,0xde],[0x00,0xa9,0xe1],
  [0x59,0x3c,0x97],[0x89,0x44,0xcf],[0xb4,0x4a,0xff],[0xe9,0x59,0xff],
  [0xe7,0x87,0x6d],[0xff,0xba,0x8c],[0xff,0xef,0x5c],[0xff,0x9c,0xde]
];
const  width2 = width/2;
const height2 = height/2;
const  widthm1 = width-1;
const heightm1 = height-1;
const buffer = new Uint8Array(width*height);

const palette_mask = [];
let pattern = 0;
let pattern_color = 0;
let cameraX = 0;
let cameraY = 0;
let clipX0 = 0;
let clipY0 = 0;
let clipX1 = width;
let clipY1 = height;

const font_buffer = [0,0,0,0,0,1,0,0,1,0,1,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0,1,1,0,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,1,1,0,0,1,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,1,1,0,0,0,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,1,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,1,1,0,0,0,1,1,0,1,1,0,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,0,1,1,0,1,0,1,0,1,0,0,0,1,1,1,0,1,1,0,0,0,1,1,0,1,1,1,0,1,1,1,0,1,1,0,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0,1,1,0,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,1,1,0,1,1,0,0,0,0,1,0,1,0,1,0,0,1,0,0,1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,1,0,0,1,1,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,1,0,1,0,1,1,1,0,0,1,0,0,0,0,0,0,0,1,0,0,1,1,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,1,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,1,1,0,0,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,0,0,0,0,0,1,1,1,0,0,1,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,1,1,0,1,0,0,0,1,0,1,0,1,1,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,0,0,0,1,0,1,1,0,0,1,0,0,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,1,0,1,1,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,1,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,1,0,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,1,1,0,0,0,0,1,0,1,1,1,0,0,1,1,0,1,1,1,0,0,0,1,0,1,1,1,0,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,1,1,0,0,1,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,1,1,1,0,1,0,1,0,1,1,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,1,0,0,0,1,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1,0,0,1,1,0,0,0,1,0,0,0,1,1,0,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,0,1,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,1,0,1,1,1,0,1,1,1,0,0,0,1,0,1,1,1,0,1,1,1,0,0,1,0,0,1,0,0,0,0,1,0,0,1,1,1,0,0,1,0,0,0,1,0,0,0,1,0,0,1,1,1,0,1,0,1,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,1,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,1,0,0,0,0,1,0,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0,1,0,1,1,1,0,0,1,1,0,1,1,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,0,0,0,0,0,1,0,1,0,1,0,1,1,1,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1,1,0,0,1,1,0,0,1,0,0,1,1,0,0,1,0,0,0];

const bayer4x4 = [
  [ 0, 8, 2, 10],
  [12, 4, 14, 6],
  [ 3, 11, 1, 9],
  [15, 7, 13, 5]
];
const bayer8x8 = [
  [ 0, 32,  8, 40,  2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44,  4, 36, 14, 46,  6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [ 3, 35, 11, 43,  1, 33,  9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47,  7, 39, 13, 45,  5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21]
];
const px8_pset = (x,y,col) => {
  x -= cameraX;
  y -= cameraY;
  if (x>=clipX0&&x<clipX1&&y>=clipY0&&y<clipY1) {
    col = Math.round(col);
    const ptrn = pattern>>((~x&3)+((~y&3)<<2))&1;
    col = ptrn?pattern_color:col;
    if ((col>0||!ptrn)&&!palette_mask[col]) {
      buffer[x+y*width] = col&31;
    }
  }
};
const cls = (col) => {
  pattern = 0;
  pattern_color = 0;
  palette_mask.fill(false);
  buffer.fill(Math.round(col)&0xff);
};
const pset = (x,y,col) => {
  x = Math.round(x);
  y = Math.round(y);
  px8_pset(x,y,col);
};
const pget = (x, y) => {
  x = Math.round(x)&widthm1;
  y = Math.round(y)&heightm1;
  return buffer[x+(y*width)];
};
const fillp = (p,col) => {
  pattern = Math.round(p)||0;
  pattern_color = Math.round(col)||0;
};
const palt = (col,t) => {
  if (col) {
    palette_mask[Math.round(col)&0xff]=t;
  } else {
    palette_mask.fill(false);
  }
};
const camera = (x, y) => {
  cameraX = Math.round(x)||0;
  cameraY = Math.round(y)||0;
};
const clip = (x0,y0,x1,y1) => {
  clipX0 = Math.round(x0)||0;
  clipY0 = Math.round(y0)||0;
  clipX1 = Math.round(x1)||width;
  clipY1 = Math.round(y1)||height;
};
const line = (x0,y0,x1,y1,col) => {
  x0 = Math.round(x0);
  y0 = Math.round(y0);
  x1 = Math.round(x1);
  y1 = Math.round(y1);
  const dx = Math.abs(x1-x0);
  const dy = Math.abs(y1-y0);
  const sx = (x0<x1)?1:-1;
  const sy = (y0<y1)?1:-1;
  let  err = dx-dy;
  while (true) {
    px8_pset(x0,y0,col);
    if (x0==x1&&y0==y1) break;
    const e2 = err*2;
    if (e2>-dy) { err -= dy;x0 += sx; }
    if (e2< dx) { err += dx;y0 += sy; }
  }
};
const rect = (x0,y0,x1,y1,col) => {
  x0 = Math.round(x0);
  y0 = Math.round(y0);
  x1 = Math.round(x1);
  y1 = Math.round(y1);
  if (x0>x1) {
    const temp = x0;
    x0 = x1;
    x1 = temp;
  }
  if (y0>y1) {
    const temp = y0;
    y0 = y1;
    y1 = temp;
  }
  for (let x=x0;x<=x1;x++) {
    px8_pset(x,y0,col);
    px8_pset(x,y1,col);
  }
  for (let y=y0;y<=y1;y++) {
    px8_pset(x0,y,col);
    px8_pset(x1,y,col);
  }
};
const rectfill = (x0,y0,x1,y1,col) => {
  x0 = Math.round(x0);
  y0 = Math.round(y0);
  x1 = Math.round(x1);
  y1 = Math.round(y1);
  if (x0 > x1) {
    const temp = x0;
    x0 = x1;
    x1 = temp;
  }
  if (y0 > y1) {
    const temp = y0;
    y0 = y1;
    y1 = temp;
  }
  for (let x=x0;x<=x1;x++) {
    for (let y=y0;y<=y1;y++) {
      px8_pset(x,y,col);
    }
  }
};
const circ = (x,y,r,col) => {
  x = Math.round(x);
  y = Math.round(y);
  r = Math.round(r);
  let  f = 1-r;
  let dx = 1;
  let dy = -2*r;
  let cx = 0;
  let cy = r;
  while (cx<=cy) {
    px8_pset(x+cx,y+cy,col);
    px8_pset(x-cx,y+cy,col);
    px8_pset(x+cx,y-cy,col);
    px8_pset(x-cx,y-cy,col);
    px8_pset(x+cy,y+cx,col);
    px8_pset(x-cy,y+cx,col);
    px8_pset(x+cy,y-cx,col);
    px8_pset(x-cy,y-cx,col);
    if (f>=0) {
      cy--;
      dy +=  2;
       f += dy;
    }
    cx++;
    dx +=  2;
     f += dx;
  }
};
const circfill = (x, y, r, col) => {
  x = Math.round(x);
  y = Math.round(y);
  r = Math.round(r);
  let  f = 1-r;
  let dx = 1;
  let dy = -2*r;
  let cx = 0;
  let cy = r;
  const hline = (x1,x2,y) => {
    for (let i=x1;i<=x2;i++) {
      px8_pset(i,y,col);
    }
  };
  while (cx<=cy) {
    hline(x-cx,x+cx,y+cy);
    hline(x-cx,x+cx,y-cy);
    hline(x-cy,x+cy,y+cx);
    hline(x-cy,x+cy,y-cx);
    if (f >= 0) {
      cy--;
      dy += 2;
      f += dy;
    }
    cx++;
    dx += 2;
    f += dx;
  }
};
const tri = (x0,y0,x1,y1,x2,y2,col) => {
  line(x0,y0,x1,y1,col);
  line(x1,y1,x2,y2,col);
  line(x2,y2,x0,y0,col);
};
const trifill = (x0,y0,x1,y1,x2,y2,col) => {
  x0 = Math.round(x0);
  y0 = Math.round(y0);
  x1 = Math.round(x1);
  y1 = Math.round(y1);
  x2 = Math.round(x2);
  y2 = Math.round(y2);
  if (y0>y1) {
    let temp = y0;
    y0 = y1;
    y1 = temp;
    temp = x0;
    x0 = x1;
    x1 = temp;
  }
  if (y1>y2) {
    let temp = y1;
    y1 = y2;
    y2 = temp;
    temp = x1;
    x1 = x2;
    x2 = temp;
  }
  if (y0>y1) {
    let temp = y0;
    y0 = y1;
    y1 = temp;
    temp = x0;
    x0 = x1;
    x1 = temp;
  }
  const dx1 = x1-x0;
  const dy1 = y1-y0;
  const dx2 = x2-x0;
  const dy2 = y2-y0;
  const dx3 = x2-x1;
  const dy3 = y2-y1;
  const m1 = dx1/dy1;
  const m2 = dx2/dy2;
  const m3 = dx3/dy3;
  let xl = x0;
  let xr = x0;
  for (let i=y0;i<=y1;i++) {
    line(xl,i,xr,i,col);
    xl += m1;
    xr += m2;
  }
  xl = x1;
  xr = x0;
  for (let i=y1;i<=y2;i++) {
    line(xl,i,xr,i,col);
    xl += m3;
    xr += m2;
  }
};
const sspr = (spr,x,y,w,h) => {
  x = Math.round(x);
  y = Math.round(y);
  spr = spr.split(",");
  const w1 = spr[0];
  const h1 = spr[1];
  spr = spr[2].split("");
  for (let i=0;i<w;i++) {
    for (let j=0;j<h;j++) {
      const col = parseInt(spr[Math.floor(i/w*w1)+Math.floor(j/h*h1)*w1],33);
      if (col<32) {
        px8_pset(x+i,y+j,col);
      }
    }
  }
};
const print = (text,x,y,col) => {
  x = Math.round(x);
  y = Math.round(y);
  text = text.toString();
  const lines = text.split("\n");
  for (let l=0;l<lines.length;l++) {
    const line = lines[l];
    const cy = y+l*5;
    for (let i=0;i<line.length;i++) {
      const code = line.charCodeAt(i);
      const cx = x+i*4;
      for (let j=0;j<5;j++) {
        for (let k=0;k<4;k++) {
          if (font_buffer[(code-32)*4+j*380+k]==1) {
            px8_pset(cx+k,cy+j,col);
          }
        }
      }
    }
  }
};