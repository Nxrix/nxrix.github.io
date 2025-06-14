---
layout: default
title: "Home"
description: ""
---

<canvas id="canvas" class="canvas_full2 pixelated" width="256" height="64"></canvas>

<h2><img src="./img/icons/home-0.png" class="pixelated h2-icon">Home</h2>
<div style="padding:36px;border-radius:12px;outline:1px solid var(--md-sys-color-outline-variant);">
  <img draggable="false" src="./img/icons/skin-2.png" class="pixelated" width="36" style="display:block;margin-left:-2px;margin-bottom:-50px;">
  <img draggable="false" src="./img/icons/skin-1.png" class="pixelated" width="32" style="float:left;border-radius:4px;margin:16px 16px 0 0;">
  <p style="margin:0;">
    <br>
    Hello! I'm Nxrix, a developer and artist who loves to play around with random, colorful things. I create voxel models, pixel art, and mini-apps or tools, I mostly use JS, C, Lua and GLSL.
  </p>
</div>

<br>

<div class="cart_set">
  {% for project in site.projects %}
  {% unless project.hidden %}
  <a href="{{ project.rdurl | default: project.url }}" class="cart">
    <img class="pixelated" src="./img/carts/{{ project.image }}">
    <div class="content">
      <div class="title">{{ project.title }}</div>
      <div class="description">{{ project.description }}</div>
    </div>
  </a>
  {% endunless %}
  {% endfor %}
</div>

<br>
<h2 style="margin:24px 12px">Tools</h2>

<div class="cart_set">
  {% assign sorted_tools = site.tools | sort: "cid" | reverse %}
  {% for tool in sorted_tools %}
    {% unless tool.hidden %}
      <a href="{{ tool.rdurl | default: tool.url }}" class="cart">
        <img {% unless tool.pixelated == false %}class="pixelated"{% endunless %} src="./img/carts/{{ tool.image }}">
        <div class="content">
          <div class="title">{{ tool.title }}</div>
          <div class="description">{{ tool.description }}</div>
        </div>
      </a>
    {% endunless %}
  {% endfor %}
</div>

<script>
const  width = 128;
const height = 32;
</script>
<script src="./js/three.min.js?{{site.time|date:'%s%N'}}"></script>
<script src="./js/px8_raw.js?{{site.time|date:'%s%N'}}"></script>
<script src="./js/events.js?{{site.time|date:'%s%N'}}"></script>
<script>
const context = canvas.getContext("webgl",{ antialias: false, preserveDrawingBuffer: true });

const renderer = new THREE.WebGLRenderer({canvas:canvas,context:context});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,1));
renderer.outputColorSpace  = THREE.LinearSRGBColorSpace;

const cam = new THREE.PerspectiveCamera(90,2,0.125,256);
const scene = new THREE.Scene();
cam.position.set(0,0,0);
cam.lookAt(0,0,1);

const buffer_texture = new THREE.DataTexture(buffer,width,height,THREE.AlphaFormat,THREE.UnsignedByteType);

const data_pal = new Uint8Array(32*4);
for (let i=0;i<32;i++) {
  const c = palette[i&31];
  const n = i*4;
  data_pal[n  ] = c[0];
  data_pal[n+1] = c[1];
  data_pal[n+2] = c[2];
  data_pal[n+3] = 255;
}
const palette_texture = new THREE.DataTexture(data_pal,32,1,THREE.RGBAFormat,THREE.UnsignedByteType);
palette_texture.needsUpdate = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 15),new THREE.ShaderMaterial({
  uniforms: {
    uPalette: { value: palette_texture },
    uBuffer: { value: buffer_texture },
  },
  vertexShader: `
    varying vec2 vU;
    void main() {
      vU = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: `
    uniform sampler2D uPalette;
    uniform sampler2D uBuffer;
    varying vec2 vU;
    
    void main() {
      vec3 c = texture2D(uPalette,vec2(texture2D(uBuffer,vU*vec2(1,-1)+vec2(0,1)).a*8.0,0)).rgb;
      gl_FragColor = vec4(c,1.0);
    }`,
}));

plane.rotation.y = -Math.PI;
plane.position.z = 7.5;
scene.add(plane);

/*class srnd {
  static d = 0xFFFFFFFF;
  static u = 1664525;
  static a = 1013904223;
  gen(s) {
    return ((s*srnd.u+srnd.a)%srnd.d)/srnd.d;
  }
}*/

const srnd = (n) => {
  const a = 1664525;
  const c = 1013904223;
  n = n|0;
  n = (a*n+c)&0xFFFFFFFF;
  return (n>>>16)&0xFFFF;
}

class frnd {
  fh(n,f=2) {
    return (n^(n%2)^(n%3)^(n%5)^(n%7)^(n%11)^(n%13)^(n%17)^(n%19)^(n%27)^(n%29))%f/(f-1);
  }
  gen(n) {
    return this.fh(n,32);
  }
}

const palsh = [
    0,24, 1, 2,20, 4, 5, 6, 4, 8, 9,10,16,12,13,11,20,16,17,18, 0,20,21,22,20,24,25,26, 9,28,15,27,
   20, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31
];

//---1632640020000---//
const k = new Date("2021-09-26T10:37:00.000+03:30");

let t = 0;
let update = () => {
  cls();
  const now = new Date(new Date().getTime());
  const e = events_find(now);
  const diff = new Date(now-k);
  const n = Math.floor(diff.getTime()/1000);
  const str1 = Math.floor(n/(60*60*24)).toString();
  const str2 = [diff.getUTCHours(),diff.getUTCMinutes(),diff.getUTCSeconds()].map(n=>n.toString().padStart(2,"0")).join(":");
  const w = e!==null?parseInt(e.i.substr(0,1)):0;
  const strl2 = str1.length+w/4+1/2+str2.length;
  const str2p = w+str1.length*4+3;

  const rn = srnd(n);
  let c1 = palsh[rn&31];
  let c2 = palsh[(rn&31)+32];

  if (e!=null) {
    c1 = palsh[e.c[rn%e.c.length]&31];
    c2 = palsh[(e.c[rn%e.c.length]&31)+32];
  }

  fillp(rn,c2);
  rectfill(0,0,width-1,height-1,c1);
  fillp();

  for (let i=0;i<4*strl2+8;i++) {
    for (let j=0;j<12;j++) {
      let v = 3;
      if ((i==1||j==1||i==strl2*4+6||j==10)&&(i>0)&&(j>0)&&(i<strl2*4+7)&&(j<11)) {
        v = (Math.abs(i-(4*strl2+7)/2)^Math.abs(j-5.5))+n*4+t/4;
      }
      pset(i+width2-4-strl2*2,j+height2-6,v);
    }
  }

  if (e!=null) {
    sspr(e.i,17+width2-2*strl2,height2-3,w,6);
  }

  [
    [-1,-1],
    [ 0,-1],
    [ 1,-1],
    [-1, 0],
    [ 1, 0],
    [-1, 1],
    [ 0, 1],
    [ 1, 1]
  ].forEach(([x,y],i) => {
    print(str1,      width2-2*strl2+x,height2-2+y,i<3?20:0);
    print(str2,str2p+width2-2*strl2+x,height2-2+y,i<3?20:0);
  });

  print(str1,width2-2*strl2,height2-2,3);
  print(str2,str2p+width2-2*strl2,height2-2,3);

  /*const oldb = buffer;
  const pget2 = (x,y) => {
    x = x&width1;
    y = y&height1;
    return oldb[x+y*width];
  }
  for (let i=0;i<width;i++) {
    for (let j=0;j<height;j++) {
      pset(i,j,pget2(i+rnd.gen(n*width+j+t),j));
    }
  }*/

  buffer_texture.needsUpdate = true;
  renderer.render(scene,cam);
  t++;
  requestAnimationFrame(update);
}
update();
</script>
