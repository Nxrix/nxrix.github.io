---
layout: default
title: "Core Voxel Shaders"
description: ""
image: "vox.png"
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
  outline: 1px solid var(--md-sys-color-surface-dim);
  border-radius: 16px;
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
}
#items .item .open, #items .item .del {
  outline: 1px solid var(--md-sys-color-surface-dim);
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
  outline: 1px solid var(--md-sys-color-surface-dim);
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
<button id="cam_tInput" onclick="gl.cam_t=!gl.cam_t;gl.ctx.uniform1i(gl.cam_tLoc,gl.cam_t);gl.ctx.drawArrays(gl.ctx.POINTS,0,1);this.innerText=gl.cam_t?'Orthographic':'Perspective'">Perspective</button>
<br>
<br>
Resolution: <input id="res" type="range" min="7" max="10" step="1" value="8">
<span id="resv">256</span>
<br>
World Size: <input id="size" type="range" min="5" max="8" step="1" value="5">
<span id="sizev">32</span>
<br>
<br>
Speed:
<br>
<input id="cam_tSpeed" type="text" oninput="t_speed=this.value;" value="1.0">
<br>
Dist:
<br>
<input id="cam_dInput" type="text" oninput="gl.ctx.uniform1f(gl.cam_dLoc,this.value);gl.ctx.drawArrays(gl.ctx.POINTS,0,1);" value="0.0">
<br>
Yaw:
<br>
<input id="cam_yInput" type="text" oninput="gl.ctx.uniform1f(gl.cam_yLoc,this.value);gl.ctx.drawArrays(gl.ctx.POINTS,0,1);" value="30">
<br>
Pitch:
<br>
<input id="cam_pInput" type="text" oninput="gl.ctx.uniform1f(gl.cam_pLoc,this.value);gl.ctx.drawArrays(gl.ctx.POINTS,0,1);" value="-30">
<hr>
<div id="editor"></div>
<div id="error" class="info-error"></div>
<hr>
<button id="save_item">Save item</button>
<br>
<div id="items"></div>

<script src="./js/storage.js"></script>
<script src="./js/highlighter.js"></script>
<script src="./js/core_editor.js"></script>

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

gl.FS = `#version 300 es
precision highp float;
precision highp int;
out vec4 fragColor;

uniform vec3 r;
uniform float t;
uniform float sz;
uniform bool CAM_TYPE;
uniform float CAM_DIST;
uniform float CAM_YAW;
uniform float CAM_PITCH;

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

int prime[128] = int[128](
  2, 3, 5, 7, 11, 13, 17, 19, 23,  29,  31,  37,  41,  43, 47, 53,
  59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113,
  127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181,
  191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251,
  257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
  331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397,
  401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463,
  467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557,
  563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619,
  631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701,
  709, 719
);

vec3 palette[32] = vec3[32](
  vec3(29, 24, 38),
  vec3(139, 127, 176),
  vec3(195, 190, 229),
  vec3(255, 232, 233),
  vec3(101, 38, 78),
  vec3(160, 26, 61),
  vec3(222, 27, 69),
  vec3(242, 99, 123),
  vec3(139, 63, 57),
  vec3(187, 69, 49),
  vec3(239, 93, 14),
  vec3(255, 149, 0),
  vec3(0, 160, 61),
  vec3(18, 213, 0),
  vec3(180, 216, 0),
  vec3(255, 195, 31),
  vec3(0, 110, 105),
  vec3(0, 174, 133),
  vec3(0, 218, 167),
  vec3(79, 214, 255),
  vec3(43, 39, 84),
  vec3(60, 81, 175),
  vec3(24, 136, 222),
  vec3(0, 169, 225),
  vec3(89, 60, 151),
  vec3(137, 68, 207),
  vec3(180, 74, 255),
  vec3(233, 89, 255),
  vec3(231, 135, 109),
  vec3(255, 186, 140),
  vec3(255, 239, 92),
  vec3(255, 156, 222)
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
#define sz1 sz+1.0
#define sz2 sz/2.0+0.5
#define szi int(sz*sz)
#define cs int(sz/32.0)
#define ic int(sz/2.0)

float k(int x,int y,int z,int dx,int dn,int dt) {
`;

gl.vox = `
}

float map(vec3 v) {
  ivec3 p = ivec3(v.xzy);
  vec3 dv = v-sz2;
  vec3 dva = abs(dv);
  int dx = int(max3(dva.x,dva.y,dva.z));
  int dn = int(min3(abs(v.x-sz2),abs(v.y-sz2),abs(v.z-sz2)));
  int dt = int(dva.x+dva.y+dva.z);
  return k(p.x,p.y,p.z,dx,dn,dt);
}

#define yaw (CAM_YAW+0.00001+t)*d2r
#define pitch (CAM_PITCH+0.00001)*d2r

#define sy sin(yaw)
#define cy cos(yaw)
#define sp sin(pitch)
#define cp cos(pitch)

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

void main() {
  vec2 uv = gl_FragCoord.xy/r.xy * 2.0 - 1.0;
  uv.x *= r.z;
  vec3 col = palette[3]/256.0;
  vec3 o = vec3(0,0,sz*1.5);
  vec3 d;
  if (CAM_TYPE) {
    o.z += sz*CAM_DIST;
    o = rotx(o,sp,cp);
    o = roty(o,sy,cy);
    d = vec3(uv,-1);
  } else {
    o += vec3(uv,0)*(sz+sz*CAM_DIST);
    o = rotx(o,sp,cp);
    o = roty(o,sy,cy);
    d = vec3(0,0,-1);
  }
  o += sz/2.0;
  d = rotx(d,sp,cp);
  d = roty(d,sy,cy); 
  vec3 inv = 1.0/d;
  vec3 t1 = -o*inv;
  vec3 t2 = (sz-o)*inv;
  float tmin = max(max(min(t1.x,t2.x),min(t1.y,t2.y)),min(t1.z,t2.z));
  float tmax = min(min(max(t1.x,t2.x),max(t1.y,t2.y)),max(t1.z,t2.z));
  if (tmax<0.0) {
    fragColor = vec4(palette[3]/256.0,1);
  }
  if (tmin>tmax) {
    fragColor = vec4(palette[3]/256.0,1);
  }
  if (o.x<=-1.0||o.x>=sz1||o.y<=-1.0||o.y>=sz1||o.z<=-1.0||o.z>=sz1) o += tmin*d*0.999999;
  vec3 v = floor(o);
  vec3 s = sign(d);
  vec3 tm = (v-o+0.5+s*0.5)*inv;
  vec3 td = inv*s;
  vec3 n = vec3(0);
  int itr = 0;
  while (v.x>=-1.0&&v.x<sz1&&v.y>=-1.0&&v.y<sz1&&v.z>=-1.0&&v.z<sz1&&itr<szi) {
    if (v.x>=0.0&&v.x<sz&&v.y>=0.0&&v.y<sz&&v.z>=0.0&&v.z<sz) {
      int c = int(map(v));
      if (c>0) {
        col = palette[palsh[((c-1)/cs&31)+(n.x!=0.0?32:(n.y!=0.0?64:0))]]/256.0;
        break;
      }
    }
    if (tm.x<=tm.y&&tm.x<=tm.z) {
      tm.x += td.x;
      v.x += s.x;
      n = vec3(-s.x,0,0);
    } else if (tm.y<=tm.x&&tm.y<=tm.z) {
      tm.y += td.y;
      v.y += s.y;
      n = vec3(0,-s.y,0);
    } else {
      tm.z += td.z;
      v.z += s.z;
      n = vec3(0,0,-s.z);
    }
    itr++;
  }
  fragColor = vec4(col, 1.0);
}`;

const editor = new CoreEditor("#editor", { highlight: true , lang: "glsl" , value: `// name - x^y^z //
if (( (x^y^z) ) == 0) {
  return f(z)+1.0;
} else {
  return 0.0;
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
    return fix_error_line(log,-111).slice(0,-1);
  } else {
    gl.FSO = fsrc;
    return ">";
  }
};

gl.update = () => {
  error.innerText = gl.setProgram(gl.FS+editor.textarea.value+gl.vox);
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
  gl.szLoc = gl.ctx.getUniformLocation(gl.pg,"sz");
  gl.cam_tLoc = gl.ctx.getUniformLocation(gl.pg,"CAM_TYPE");
  gl.cam_dLoc = gl.ctx.getUniformLocation(gl.pg,"CAM_DIST");
  gl.cam_yLoc = gl.ctx.getUniformLocation(gl.pg,"CAM_YAW");
  gl.cam_pLoc = gl.ctx.getUniformLocation(gl.pg,"CAM_PITCH");
  gl.ctx.uniform1f(gl.szLoc,gl.vox_size);
  gl.ctx.uniform1f(gl.cam_tLoc,gl.cam_t);
  gl.ctx.uniform1f(gl.cam_dLoc,cam_dInput.value);
  gl.ctx.uniform1f(gl.cam_yLoc,cam_yInput.value);
  gl.ctx.uniform1f(gl.cam_pLoc,cam_pInput.value);
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
size.addEventListener("input",()=>{
  gl.vox_size = 2**size.value;
  sizev.innerText = gl.vox_size;
  gl.ctx.uniform1f(gl.szLoc,gl.vox_size);
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
const storage = new Storage("nxrix","core_vox");

window.onload = async () => {
  await storage.init();
  const data = await storage.get("files");
  window.files = JSON.parse(data)||[];
  update_items();
};

const split_n = (str,n) => {
  let c = 0;
  let si = -1;
  for (let i=0;i<str.length;i++) {
    if (str[i]==",") {
      c++;
      if (c==n) {
        si = i;
        break;
      }
    }
  }
  if (si!=-1) {
    const one = str.slice(0,si).trim();
    const two = str.slice(si+1);
    const arr = one.split(",").map(Number).filter(num=>!isNaN(num)); 
    return [two,arr];
  }
  return [str,[]];
};

const parse_item = (str) => {
  const type = parseFloat(str.split(",")[0]);
  switch (type) {
    case 0:
      return split_n(str,6);
      break;
  }
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
    const data = parse_item(files[i]);
    editor.textarea.value = data[0];
    switch (data[1][0]) {
      case 0:
        cam_tSpeed.value = t_speed = data[1][1];
        cam_tInput.value = gl.cam_t = data[1][2];
        gl.ctx.uniform1i(gl.cam_tLoc,gl.cam_t);
        
        cam_dInput.value = data[1][3];
        gl.ctx.uniform1f(gl.cam_dLoc,cam_dInput.value);
        
        cam_yInput.value = data[1][4];
        gl.ctx.uniform1f(gl.cam_yLoc,cam_yInput.value);

        cam_pInput.value = data[1][5];
        gl.ctx.uniform1f(gl.cam_pLoc,cam_pInput.value);
        break;
    }
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

const update_items = async () => {
  items.innerHTML = "";
  for (let i=0;i<files.length;i++) {
    const item = document.createElement("div");
    item.classList.add("item");
    const data = parse_item(files[i]);
    const hash = await sha256(data);

    const name = document.createElement("span");
    name.innerText = hash.substr(0,4)+".."+hash.substr(-4)+" "+data[0].split("\n")[0];
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
  files.push("0,"+parseFloat(t_speed)+","+(gl.cam_t?"1":"0")+","+parseFloat(cam_dInput.value)+","+parseFloat(cam_yInput.value)+","+parseFloat(cam_pInput.value)+","+editor.textarea.value);
  await storage.set("files",JSON.stringify(files));
  update_items();
};

save_img.onclick = () => {
  const downloadLink = document.createElement("a");
  downloadLink.href = gl.canvas.toDataURL();
  downloadLink.download = "core-vox-"+Math.random()+".png";
  downloadLink.click();
};

save_txt.onclick = () => {
  const blob = new Blob([editor.textarea.value],{type:"text/plain"});
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "core-vox-"+Math.random()+".txt";
  downloadLink.click();
  URL.revokeObjectURL(url);
};

</script>
