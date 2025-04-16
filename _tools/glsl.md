---
layout: default
title: "Core GLSL Editor"
description: ""
image: "glsl.png"
cid: 5
hidden: true
---

<style>
input[type="text"] {
  margin: 8px 0;
}
input[type="range"] {
  accent-color: var(--md-sys-color-primary-container);
}
input[type="range"]:focus {
  outline: none;
}
#items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
#items .item {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 64px;
  padding: 8px;
  gap: 8px;
  outline: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 16px;
}
#items .item .image {
  height: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
}
#items .item .name {
  display: flex;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
#items .item .open, #items .item .del, #items .item .btns {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  aspect-ratio: 1;
  user-select: none;
}
#items .item .open, #items .item .del {
  outline: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 8px;
}
#items .item .btns {
  flex-direction: column;
  padding: 4px 0;
  gap: 4px;
}
#items .item .btns div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  outline: 1px solid var(--md-sys-color-outline-variant);
}
#items .item .btns div:nth-child(1) {
  border-radius: 8px 8px 4px 4px;
}
#items .item .btns div:nth-child(2) {
  border-radius: 4px 4px 8px 8px;
}
</style>

<canvas width="256" height="256" class="canvas_1x1 pixelated"></canvas>
<button onclick="gl.time=0;gl.ctx.uniform1f(gl.tLoc,gl.time*0.001);gl.ctx.drawArrays(gl.ctx.POINTS,0,1);">Reset</button>
<button onclick="gl.pause=!gl.pause;this.innerText=gl.pause?'Play':'Stop'">Play</button>
<button id="save_img">Save img</button>
<button id="save_txt">Save txt</button>
<br>
<div id="editor"></div>
<div id="error" class="info-error"></div>
<br>
Resolution: <input id="res" type="range" min="7" max="10" step="1" value="8">
<span id="resv">256</span>
<br>
<button id="save_item">Save item</button>
<br>
<div id="items"></div>

<script src="./js/storage.js?{{site.time|date:'%s%N'}}"></script>
<script src="./js/highlighter.js?{{site.time|date:'%s%N'}}"></script>
<script src="./js/core_editor.js?{{site.time|date:'%s%N'}}"></script>
<script src="./js/offscreen.js?{{site.time|date:'%s%N'}}"></script>

<script>
"use strict";

const gl = {};

gl.canvas = document.querySelector("canvas");
gl.ctx = gl.canvas.getContext("webgl2",{ preserveDrawingBuffer:true });
gl.pg = gl.ctx.createProgram();
gl.vs = gl.ctx.createShader(gl.ctx.VERTEX_SHADER);
gl.fs = gl.ctx.createShader(gl.ctx.FRAGMENT_SHADER);
gl.ctx.attachShader(gl.pg,gl.vs);
gl.ctx.attachShader(gl.pg,gl.fs);

gl.VS = `#version 300 es
in vec4 p;

uniform vec3 r;

void main() {
  gl_PointSize = r.x;
  gl_Position = p;
}`;

gl.FS1 = `#version 300 es
precision highp float;
precision highp int;
out vec4 fragColor;

uniform vec3 r;
uniform float t;

#define f float
#define f2 vec2
#define f3 vec3
#define f4 vec4
#define i int
#define i2 ivec2
#define i3 ivec3
#define i4 ivec4
#define b bool
#define b2 bvec2
#define b3 bvec3
#define b4 bvec4
#define m mat2
#define m3 mat3
#define m4 mat4

#define d2r 3.14159265/180.0

float dither[16] = float[16](
  0.0,8.0,2.0,10.0,
  12.0,4.0,14.0,6.0,
  3.0,11.0,1.0,9.0,
  15.0,7.0,13.0,5.0
);

int palsh[96] = int[96](
  0,20,1,2,20,4,5,6,4,8,9,10,16,12,13,11,20,16,17,18,0,20,21,22,20,24,25,26,9,28,15,27,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,20,2,3,3,5,6,7,31,9,10,11,15,13,14,15,30,17,18,19,3,21,22,23,19,25,26,27,31,29,30,3,3
);

vec3 palette[32] = vec3[32](
  vec3( 29,  24,  38), vec3(139, 127, 176), vec3(195, 190, 229), vec3(255, 232, 233),
  vec3(101,  38,  78), vec3(160,  26,  61), vec3(222,  27,  69), vec3(242,  99, 123),
  vec3(139,  63,  57), vec3(187,  69,  49), vec3(239,  93,  14), vec3(255, 149,   0),
  vec3(  0, 160,  61), vec3( 18, 213,   0), vec3(180, 216,   0), vec3(255, 195,  31),
  vec3(  0, 110, 105), vec3(  0, 174, 133), vec3(  0, 218, 167), vec3( 79, 214, 255),
  vec3( 43,  39,  84), vec3( 60,  81, 175), vec3( 24, 136, 222), vec3(  0, 169, 225),
  vec3( 89,  60, 151), vec3(137,  68, 207), vec3(180,  74, 255), vec3(233,  89, 255),
  vec3(231, 135, 109), vec3(255, 186, 140), vec3(255, 239,  92), vec3(255, 156, 222)
);

float atan2( in float y, in float x){bool s = (abs(x) > abs(y));return mix(3.141592 / 2.0 - atan(x, y), atan(y, x), s)/6.283184;}

int min3(int x,int y,int z) {
  return min(min(x,y),z);
}
int max3(int x,int y,int z) {
  return max(max(x,y),z);
}
float min3(float x,float y,float z) {
  return min(min(x,y),z);
}
float max3(float x,float y,float z) {
  return max(max(x,y),z);
}

vec3 rotz(vec3 v,float s,float c) {
  return v*mat3(
    c,-s,0,
    s, c,0,
    0, 0,1
  );
}
vec3 roty(vec3 v,float s,float c) {
  return v*mat3(
     c,0,s,
     0,1,0,
    -s,0,c
  );
}
vec3 rotx(vec3 v,float s,float c) {
  return v*mat3(
    1,0, 0,
    0,c,-s,
    0,s, c
  );
}
`;
gl.FS2 = `void main() {
  fragColor = k();
}`;

const editor = new CoreEditor("#editor", { highlight: true , lang: "glsl" , value: `// name //
f4 k() {
  f2 v = gl_Fragcoord.xy/r.xy;
  return vec4(v,0,1);
}` });

const fix_error_line = (error,offset) => {
  const nlines = error.split("\n").map((line) => {
    var m = line.match(/:(\d+)/);
    if (m) {
      return line.replace(m[1],(parseInt(m[1])+offset).toString());
    }
    return line;
  });
  return nlines.join("\n");
};

gl.setProgram = (fsrc) => {
  gl.ctx.shaderSource(gl.vs,gl.VS);
  gl.ctx.compileShader(gl.vs);
  gl.ctx.shaderSource(gl.fs,fsrc);
  gl.ctx.compileShader(gl.fs);
  gl.ctx.linkProgram(gl.pg);
  gl.ctx.validateProgram(gl.pg);
  if (!gl.ctx.getProgramParameter(gl.pg,gl.ctx.LINK_STATUS)) {
    let log = gl.ctx.getShaderInfoLog(gl.fs);
    gl.ctx.shaderSource(gl.vs,gl.VS);
    gl.ctx.compileShader(gl.vs);
    gl.ctx.shaderSource(gl.fs,gl.FSO);
    gl.ctx.compileShader(gl.fs);
    gl.ctx.linkProgram(gl.pg);
    gl.ctx.validateProgram(gl.pg);
    return fix_error_line(log,-gl.FS.split("\n").length+1).slice(0,-1);
  } else {
    gl.FSO = fsrc;
    return ">";
  }
};

gl.update = () => {
  error.innerText = gl.setProgram(gl.FS1+editor.textarea.value+gl.FS2);
  gl.ctx.useProgram(gl.pg);
  gl.buffer = gl.ctx.createBuffer();
  gl.ctx.bindBuffer(gl.ctx.ARRAY_BUFFER,gl.buffer);
  gl.vertices = new Float32Array([0,0]);
  gl.ctx.bufferData(gl.ctx.ARRAY_BUFFER,gl.vertices,gl.ctx.STATIC_DRAW);

  gl.pLoc = gl.ctx.getAttribLocation(gl.pg,"p");
  gl.ctx.enableVertexAttribArray(gl.pLoc);
  gl.ctx.vertexAttribPointer(gl.pLoc,2,gl.ctx.FLOAT,false,0,0);

  gl.tLoc = gl.ctx.getUniformLocation(gl.pg,"t");
  gl.rLoc = gl.ctx.getUniformLocation(gl.pg,"r");
  gl.ctx.uniform3f(gl.rLoc,gl.canvas.width,gl.canvas.height,gl.canvas.width/gl.canvas.height);
};

editor.textarea.addEventListener("input",()=>{
  gl.update();
  gl.ctx.uniform1f(gl.tLoc,gl.time*0.001);
  gl.ctx.drawArrays(gl.ctx.POINTS,0,1);
});
res.addEventListener("input",()=>{
  gl.canvas.width = gl.canvas.height = 2**res.value;
  resv.innerText = 2**res.value;
  gl.ctx.viewport(0,0,gl.canvas.width,gl.canvas.height);
  gl.ctx.uniform3f(gl.rLoc,gl.canvas.width,gl.canvas.height,gl.canvas.width/gl.canvas.height);
  gl.ctx.drawArrays(gl.ctx.POINTS,0,1);
});

let t_speed = 1;
gl.cam_t = 0;
gl.time = -1000;//-16.667;
gl.vox_size = 2**size.value;

gl.draw = () => {
  if (!gl.pause) {
    gl.time += 1000*t_speed;//16.667;
    gl.ctx.uniform1f(gl.tLoc,gl.time*0.001);
    gl.ctx.drawArrays(gl.ctx.POINTS,0,1);
  }
  requestAnimationFrame(gl.draw);
};

gl.update();
gl.draw();
gl.pause = true;
const storage = new Storage("nxrix-core_glsl","store");

window.onload = async () => {
  await storage.init();
  const data = await storage.get("files");
  window.files = JSON.parse(data)||[];
  update_items();
};

const delete_item = async (i) => {
  if (confirm("Are you sure you want to delete this?")) {
    if (i!=-1) {
      files.splice(i,1);
    }
    await storage.set("files",JSON.stringify(files));
    update_items();
  }
};

const open_item = async (i) => {
  if (confirm("Are you sure you want to open this?")) {
    editor.textarea.value = files[i];
    editor.resize();
    gl.update();
    gl.ctx.drawArrays(gl.ctx.POINTS,0,1);
  }
};

const move_item_up = async (i) => {
  if (i>0) {
    const item = files[i];
    files.splice(i,1);
    files.splice(i-1,0,item);
    await storage.set("files",JSON.stringify(files));
    update_items();
  }
};
const move_item_down = async (i) => {
  if (i<files.length-1) {
    const item = files[i];
    files.splice(i,1);
    files.splice(i+1,0,item);
    await storage.set("files",JSON.stringify(files));
    update_items();
  }
};

const sha256 = async (txt) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(txt);
  const buffer = await crypto.subtle.digest("SHA-256",data);
  const arr = Array.from(new Uint8Array(buffer));
  return arr.map(b=>b.toString(16).padStart(2,"0")).join("");
}

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

const gen_id = (w,h,seed) => {
  const c1s = [20, 1, 2, 5, 6, 7,31, 9,10,11,15,30,12,13,14,30,16,17,18,19,21,22,23,19,24,25,26,27,31,29];
  const c2s = [ 0,20, 1, 4, 5, 6, 7, 8, 9,10,11,15,16,12,13,14,20,16,17,18,20,21,22,23,20,24,25,26,27,28];
  let rseed = new Array(4).fill(0);
  for (let i=0;i<seed.length;i++) {
    rseed[i%4]=((rseed[i%4]<<5)-rseed[i%4])+seed.charCodeAt(i);
  }
  const rnd = (max) => {
    const t = rseed[0]^(rseed[0]<<11);
    rseed[0] = rseed[1];
    rseed[1] = rseed[2];
    rseed[2] = rseed[3];
    rseed[3] = (rseed[3]^(rseed[3]>>19)^t^(t>>8));
    return Math.floor((rseed[3]>>>0)/((1<<31)>>>0)*(max+1));
  }
  const rand = () => {
    const t = rseed[0]^(rseed[0]<<11);
    rseed[0] = rseed[1];
    rseed[1] = rseed[2];
    rseed[2] = rseed[3];
    rseed[3] = (rseed[3]^(rseed[3]>>19)^t^(t>>8));
    return (rseed[3]>>>0)/((1<<31)>>>0);
  }
  const data = new Uint8Array(w*h).fill(3);
  const o1 = rnd(30);
  const o2 = rnd(30);
  for (let i=0;i<w/2;i++) {
    for (let j=0;j<h-1;j++) {
      const n = rnd(1)?o1:o2;
      if (rand()>0.5) {
        data[i+j*w] = c1s[n];
        data[w-i-1+j*w] = c1s[n];
        data[i+j*w+w] = c2s[n];
        data[2*w-i-1+j*w] = c2s[n];
      }
    }
  }
  return data;
}

const ctx = new Offscreen(8,8);

const update_items = async () => {
  items.innerHTML = "";
  for (let i=0;i<files.length;i++) {
    const item = document.createElement("div");
    item.classList.add("item");
    const data = files[i];
    const hash = await sha256(data);
    ctx.set_rgb(gen_id(8,8,hash),palette);
    const img = document.createElement("img");
    img.classList.add("image");
    img.classList.add("pixelated");
    img.src = ctx.get();
    item.appendChild(img);
    
    const name = document.createElement("span");
    name.innerText = data.split("\n")[0];//+" "+hash.substr(0,4)+".."+hash.substr(-4);
    name.classList.add("name");
    item.appendChild(name);

    const open = document.createElement("div");
    open.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 -960 960 960\" width=\"24px\" fill=\"currentColor\"><path d=\"M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Zm84-80h516l72-240H316l-72 240Zm0 0 72-240-72 240Zm-84-400v-80 80Z\"/></svg>";
    open.setAttribute("onclick",`open_item("${i}")`);
    open.classList.add("open");
    item.appendChild(open);
  
    const del = document.createElement("div");
    del.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 -960 960 960\" width=\"24px\" fill=\"currentColor\"><path d=\"m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z\"/></svg>";
    del.setAttribute("onclick",`delete_item(${i})`);
    del.classList.add("del");
    item.appendChild(del);

    const btns = document.createElement("div");
    btns.classList.add("btns");
    
    const btn_up = document.createElement("div");
    btn_up.innerText = "▲";
    btn_up.setAttribute("onclick",`move_item_up(${i})`);
    btns.appendChild(btn_up);

    const btn_down = document.createElement("div");
    btn_down.innerText = "▼";
    btn_down.setAttribute("onclick",`move_item_down(${i})`);
    btns.appendChild(btn_down);

    item.appendChild(btns);

    items.appendChild(item); 
  }
};

save_item.onclick = async () => {
  files.push(editor.textarea.value);
  await storage.set("files",JSON.stringify(files));
  update_items();
};

save_img.onclick = () => {
  const downloadLink = document.createElement("a");
  downloadLink.href = gl.canvas.toDataURL();
  downloadLink.download = "core-glsl-"+Math.random()+".png";
  downloadLink.click();
};

save_txt.onclick = () => {
  const blob = new Blob([editor.textarea.value],{type:"text/plain"});
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "core-glsl-"+Math.random()+".txt";
  downloadLink.click();
  URL.revokeObjectURL(url);
};

</script>