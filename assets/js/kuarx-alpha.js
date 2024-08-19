const kuarx = {};

kuarx.palette = [
  [0x1d,0x18,0x26],[0x8b,0x7f,0xb0],[0xc3,0xbe,0xe5],[0xff,0xe8,0xe9],
  [0x65,0x26,0x4e],[0xa0,0x1a,0x3d],[0xde,0x1b,0x45],[0xf2,0x63,0x7b],
  [0x8b,0x3f,0x39],[0xbb,0x45,0x31],[0xef,0x5d,0x0e],[0xff,0x95,0x00],
  [0x00,0xa0,0x3d],[0x12,0xd5,0x00],[0xb4,0xd8,0x00],[0xff,0xc3,0x1f],
  [0x00,0x6e,0x69],[0x00,0xae,0x85],[0x00,0xda,0xa7],[0x4f,0xd6,0xff],
  [0x2b,0x27,0x54],[0x3c,0x51,0xaf],[0x18,0x88,0xde],[0x00,0xa9,0xe1],
  [0x59,0x3c,0x97],[0x89,0x44,0xcf],[0xb4,0x4a,0xff],[0xe9,0x59,0xff],
  [0xe7,0x87,0x6d],[0xff,0xba,0x8c],[0xff,0xef,0x5c],[0xff,0x9c,0xde]
];

kuarx.palette_01 = new Array(32).fill(null).map((_,i)=>kuarx.palette[i].map(c=>c/256));
kuarx.palette_4x = kuarx.palette_01.map(c=>[c[0],c[1],c[2],c[0],c[1],c[2],c[0],c[1],c[2],c[0],c[1],c[2]]);
kuarx.palette_int = kuarx.palette.map(c=>[(c[0]<<16)+(c[1]<<8)+c[2]]);

kuarx.castray = (camera,scene,mouse,offset={x:0,y:0,z:0}) => {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse,camera);
  const objects = scene.children;
  const intersects = raycaster.intersectObjects(objects, true);
  if (intersects.length > 0) {
    const intersect = intersects[0];
    const mesh = intersect.object;
    const n = intersect.face.normal.multiplyScalar(intersect.face.normal.dot(camera.position.clone().sub(intersect.point).normalize())<0?-1:1);
    const cvp = new THREE.Vector3(Math.floor(intersect.point.x-n.x/2+offset.x),Math.floor(intersect.point.y-n.y/2+offset.y),Math.floor(intersect.point.z-n.z/2+offset.z));
    const nvp = cvp.clone().add(n);
    return {
      m: mesh,
      p: intersect.point,
      cvp: cvp,
      nvp: nvp,
      n: n,
    };
  } else {
    return null;
  }
}

kuarx.voxelGeometry = class {
  constructor(size_x,size_y,size_z,chunk_size=16) {
    this.size_x = size_x;
    this.size_y = size_y;
    this.size_z = size_z;
    this.size_mx = size_x-1;
    this.size_my = size_y-1;
    this.size_mz = size_z-1;
    this.size_px = size_x+1;
    this.size_py = size_y+1;
    this.size_pz = size_z+1;
    this.size_xy = size_x*size_y;
    this.size_xyz = size_x*size_y*size_z;
    //this.chunk_size = chunk_size;
    this.voxels = new Uint8Array(this.size_xyz);
    //this.chunks = new Array(this.size_xyz/this.chunk_size*this.chunk_size*this.chunk_size);
    //this.max_faces = Math.ceil((this.size_x*this.size_y*this.size_z)/2)*6;
  }
  set(x,y,z,c) {
    if (0<=x&&x<this.size_x&&0<=y&&y<this.size_y&&0<=z&&z<this.size_z) this.voxels[x+y*this.size_x+z*this.size_xy]=(c==-1?0:c+1);
  }
  makeGeometry(start_x,start_y,start_z,end_x,end_y,end_z) {
    const positions = [];
    const colors = [];
    const indices = [];
    const uvs = [];
    const addFace = (v,color,uv=[[0,0],[0,0],[0,0],[0,0]]) => {
      const vertexIndex = positions.length / 3;
      //positions.push(v0[0], v0[1], v0[2], v1[0], v1[1], v1[2], v2[0], v2[1], v2[2], v3[0], v3[1], v3[2]);
      positions.push(...v);
      //colors.push(color[0], color[1], color[2], color[0], color[1], color[2], color[0], color[1], color[2], color[0], color[1], color[2]);
      colors.push(color);
      indices.push(
        vertexIndex, vertexIndex + 1, vertexIndex + 2,
        vertexIndex, vertexIndex + 2, vertexIndex + 3
      );
      uvs.push(uv[3][0],uv[3][1],uv[0][0],uv[0][1],uv[1][0],uv[1][1],uv[2][0],uv[2][1]);
    };
    for (let x=start_x;x<end_x;x++) {

      const mx_index = x-1;
      const px_index = x+1;

      for (let y=start_y;y<end_y;y++) {

        const y_index = y*this.size_x;
        const my_index = (y-1)*this.size_x;
        const py_index = (y+1)*this.size_x;

        for (let z=start_z;z<end_z;z++) {

          const z_index = z*this.size_xy;
          const mz_index = (z-1)*this.size_xy;
          const pz_index = (z+1)*this.size_xy;

          const voxel = this.voxels[x+y_index+z_index];

          if (voxel!=0) {

            const vxl = this.voxels[mx_index+y_index+z_index];
            const vxr = this.voxels[px_index+y_index+z_index];
            const vxd = this.voxels[x+my_index+z_index];
            const vxu = this.voxels[x+py_index+z_index];
            const vxb = this.voxels[x+y_index+mz_index];
            const vxf = this.voxels[x+y_index+pz_index];

            const uv = (
              (vxf==0||z==this.size_mz)&&
              (vxu==0||y==this.size_my)
            );
            const color = kuarx.palette_4x[voxel-1&31];

            if (vxl==0&&x>0||x==0) {
              //addFace([x,y+1,z+1],[x,y+1,z],[x,y,z],[x,y,z+1],color);
              addFace([x,y+1,z+1,x,y+1,z,x,y,z,x,y,z+1],color);
            }
            if (vxr==0||x==this.size_mx) {
              //addFace([x+1,y+1,z+1],[x+1,y,z+1],[x+1,y,z],[x+1,y+1,z],color);
              addFace([x+1,y+1,z+1,x+1,y,z+1,x+1,y,z,x+1,y+1,z],color);
            }
            if (vxd==0||y==0) {
              //addFace([x,y,z],[x+1,y,z],[x+1,y,z+1],[x,y,z+1],color);
              addFace([x,y,z,x+1,y,z,x+1,y,z+1,x,y,z+1],color);
            }
            if (vxu==0||y==this.size_my) {
              //addFace([x,y+1,z],[x,y+1,z+1],[x+1,y+1,z+1],[x+1,y+1,z],color,[[0,uv],[uv,uv],[uv,0],[0,0]]);
              addFace([x,y+1,z,x,y+1,z+1,x+1,y+1,z+1,x+1,y+1,z],color,[[0,uv],[uv,uv],[uv,0],[0,0]]);
            }
            if (vxb==0||z==0) {
              //addFace([x,y,z],[x,y+1,z],[x+1,y+1,z],[x+1,y,z],color);
              addFace([x,y,z,x,y+1,z,x+1,y+1,z,x+1,y,z],color);
            }
            if (vxf==0||z==this.size_mz) {
              //addFace([x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1],color,[[0,0],[0,uv],[uv,uv],[uv,0]]);
              addFace([x,y,z+1,x+1,y,z+1,x+1,y+1,z+1,x,y+1,z+1],color,[[0,0],[0,uv],[uv,uv],[uv,0]]);
            }
          }
        }
      }
    }
    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Uint8BufferAttribute(positions.flat(),3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors.flat(),3));
    geometry.setAttribute("uv", new THREE.Uint8BufferAttribute(uvs,2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }
}

kuarx.findboxdist = (s,f) => {
  return s/2/(Math.tan(f*(Math.PI/180)/2))+s/2;
}

kuarx.init = (canvas,dpr,fov,near,far,aa=false) => {
  kuarx.canvas = canvas;
  kuarx.context = canvas.getContext("webgl",{antialias: aa,preserveDrawingBuffer:true});

  kuarx.renderer = new THREE.WebGLRenderer({canvas:kuarx.canvas,context:kuarx.context});
  //kuarx.renderer.setSize(width,height);
  kuarx.renderer.setPixelRatio(dpr);
  kuarx.renderer.outputColorSpace  = THREE.LinearSRGBColorSpace;

  kuarx.camera = new THREE.PerspectiveCamera(fov,window.innerWidth/window.innerHeight,near,far);
  kuarx.scene = new THREE.Scene();
}
