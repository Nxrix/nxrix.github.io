---
layout: default
title: "Kuarx"
description: "Voxels Everywhere"
image: "krx.png"
---

## Kuarx

A Voxel Engine that works using ThreeJS with a few other things

<br>

<canvas id="canvas" width="1200" height="900" class="canvas_4x3 pixelated center" style="border-radius:16px;"></canvas>
<!--img src="./img/misc/screenshots/kuarx-vx6-alpha.png" class="center"-->

<script src="./js/three.min.js"></script>
<script src="./js/kuarx-alpha.js"></script>

<script>
kuarx.init(canvas,1,30,0.125,1024,true);
kuarx.camera.resize = () => {
  //kuarx.renderer.setSize(600,450);
  kuarx.camera.aspect = 4/3;
  kuarx.camera.zoom = kuarx.camera.aspect<=1?kuarx.camera.aspect:1;
  kuarx.camera.updateProjectionMatrix();
}
//window.addEventListener("resize",kuarx.camera.resize);
kuarx.camera.resize();

const floor = Math.floor;
const round = Math.round;
const ceil = Math.ceil;
const abs = Math.abs;
const min = Math.min;
const max = Math.max;
const sin = Math.sin;
const cos = Math.cos;

const size = 11;
const c = size/2-0.5;

const dist = kuarx.findboxdist(size,kuarx.camera.fov);
const cam_d = 0.75;
kuarx.camera.position.set(size*2*cam_d,dist*1.25*cam_d,dist*1.75*cam_d);
kuarx.camera.lookAt(size/2,size/2,size/2);

//--voxels--//
const vox = new kuarx.voxelGeometry(size,size,size);

const material = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vP;
    varying vec3 vW;
    varying vec3 vC;
    varying vec3 vN;
    varying vec3 vView;
    varying vec2 vUV;
    void main() {
      vP = position;
      vC = color;
      vN = normal;
      vUV = uv;
      vW = (modelMatrix*vec4(position,1.0)).xyz;
      vView = cameraPosition-vW;
      gl_Position = projectionMatrix * modelViewMatrix*vec4(position,1.0);
    }`,
  fragmentShader: `
    varying vec3 vP;
    varying vec3 vW;
    varying vec3 vC;
    varying vec3 vN;
    varying vec3 vView;
    varying vec2 vUV;
    #define vV normalize(vView)
    #define vL1 normalize(vec3(0.75,1,0.5))
    #define vL2 -vL1
    #define vA vec3(0.375)
    float light( in vec3 n , in vec3 l ) {
      return max(0.0,dot(n,l));
    }
    float spec( in vec3 n , in vec3 v , in vec3 l , in float r ) {
      vec3 h = reflect(-l,n);
      return pow(max(0.0,dot(v,h)),r);
    }
    void main() {
      float br = vUV.y>(1.0-1.0/16.0)?1.0:0.0;
      vec3 brc = mix(vC+br,vC,0.75);
      float d1 = light(vN,vL1);
      float d2 = light(vN,vL2)/3.0;
      vec3 col = vC*(d1+d2+vA);
      col = mix(col,brc,br);
      gl_FragColor = vec4(col,1.0);
    }`,
  vertexColors: true
});

const mesh = new THREE.Mesh(vox.makeGeometry(0,0,0,size,size,size),material);
kuarx.scene.add(mesh);

//--cube--//
c1 = kuarx.palette_01[3];
c2 = kuarx.palette_01[26];
const sky_material = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vP;
    varying vec3 vW;
    varying vec3 vN;
    void main() {
      vP = position;
      vN = normal;
      vW = (modelMatrix*vec4(position,1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix*vec4(position,1.0);
    }`,
  fragmentShader: `
    varying vec3 vP;
    varying vec3 vW;
    varying vec3 vN;
    #define c1 vec3(${c1[0]},${c1[1]},${c1[2]})
    #define c2 vec3(${c2[0]},${c2[1]},${c2[2]})
    void main() {
      vec3 p = (vW-${size%2==0?size/2+".0":size/2})/${size*4}.0;
      vec3 sp = normalize(p)/2.0+0.5;
      vec3 col = mix(c1,c2,sp.y);
      gl_FragColor = vec4(col,1.0);
    }`,
  side: THREE.BackSide,
  depthWrite: false
});
const cube = new THREE.Mesh(new THREE.BoxGeometry(size*8,size*8,size*8),sky_material);
cube.position.set(size/2,size/2,size/2);
kuarx.scene.add(cube);

const clown = [
  [
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,4,4,4,4,4,0,0,0],
    [0,0,0,4,2,2,2,4,0,0,0],
    [0,0,0,4,2,2,2,4,0,0,0],
    [0,0,0,4,2,2,2,4,0,0,0],
    [0,0,0,4,4,4,4,4,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0]
  ],[
    [0,0,0,4,4,4,4,4,0,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,0,4,6,6,6,4,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0]
  ],[
    [0,0,0,4,4,4,4,4,0,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,0,6,4,4,4,6,0,0,0],
    [0,0,0,0,0,7,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0]
  ],[
    [0,0,0,4,4,4,4,4,0,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,32,4,4,4,4,4,32,0,0],
    [0,0,0,4,1,4,1,4,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0]
  ],[
    [0,0,0,4,4,4,4,4,0,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,0,4,1,4,1,4,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0]
  ],[
    [0,0,0,4,4,4,4,4,0,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,0,4,4,4,4,4,4,4,0,0],
    [0,22,4,4,4,4,4,4,4,22,0],
    [0,22,22,4,4,4,4,4,22,22,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0]
  ],[
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,4,4,4,4,4,0,0,0],
    [0,0,0,4,4,4,4,4,0,0,0],
    [0,0,0,4,4,4,4,4,0,0,0],
    [0,23,23,4,4,4,4,4,23,23,0],
    [22,23,23,4,4,4,4,4,22,23,23],
    [22,23,23,23,0,0,0,22,23,23,23],
    [0,23,23,0,0,0,0,0,23,23,0],
    [0,0,0,0,0,0,0,0,0,0,0]
  ],[
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,23,23,0,0,0,0,0,23,23,0],
    [22,23,23,23,0,0,0,22,23,23,23],
    [22,23,23,23,0,0,0,22,23,23,23],
    [0,23,24,0,0,0,0,0,23,24,0],
    [0,0,0,0,0,0,0,0,0,0,0]
  ],[
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,23,23,0,0,0,0,0,23,23,0],
    [0,23,23,0,0,0,0,0,23,23,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0]
  ]
];

let t = 0;
kuarx.update = () => {
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        let d = floor(max(max(abs(x-c),abs(y-c)),abs(z-c)));
        let dm = min(min(abs(x-c),abs(y-c)),abs(z-c));
        if (sin(x/11+z/5+t/32)*11>y-11) {
          vox.set(x,y,z,x+y+z+t/32);
        } else {
          if (x<11&&y>1&&y<11&&z<9) {
            vox.set(x,y,z,clown[y-2][z][x]-1);
          } else {
            vox.set(x,y,z,-1);
          }
        }
      }
    }
  }
  mesh.geometry.dispose();
  mesh.geometry = vox.makeGeometry(0,0,0,size,size,size);
  kuarx.renderer.render(kuarx.scene,kuarx.camera);
  t++;
  requestAnimationFrame(kuarx.update);
}
kuarx.update();
</script>
