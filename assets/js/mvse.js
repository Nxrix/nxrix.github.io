const vertexShaderSource = `#version 300 es
in vec3 position;
out vec3 p;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1);
  p = vec3(position+0.5);
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

out vec4 fragColor;

//const float PI = 3.1415926535897932384626433832795;
//const float TWO_PI = 6.283185307179586476925286766559;

float dither[16] = float[16](
  0.0, 8.0, 2.0, 10.0,
  12.0, 4.0, 14.0, 6.0,
  3.0, 11.0, 1.0, 9.0,
  15.0, 7.0, 13.0, 5.0
);

vec3 palette[32] = vec3[](
  vec3(29.0, 24.0, 38.0),
  vec3(131.0, 121.0, 183.0),
  vec3(175.0, 168.0, 229.0),
  vec3(255.0, 232.0, 233.0),
  vec3(63.0, 25.0, 69.0),
  vec3(119.0, 36.0, 66.0),
  vec3(222.0, 27.0, 69.0),
  vec3(225.0, 122.0, 163.0),
  vec3(139.0, 63.0, 57.0),
  vec3(187.0, 69.0, 49.0),
  vec3(239.0, 93.0, 14.0),
  vec3(255.0, 149.0, 0.0),
  vec3(0.0, 160.0, 61.0),
  vec3(18.0, 213.0, 0.0),
  vec3(180.0, 216.0, 0.0),
  vec3(255.0, 195.0, 31.0),
  vec3(0.0, 110.0, 105.0),
  vec3(0.0, 174.0, 133.0),
  vec3(0.0, 218.0, 167.0),
  vec3(79.0, 214.0, 255.0),
  vec3(52.0, 56.0, 103.0),
  vec3(64.0, 87.0, 188.0),
  vec3(24.0, 135.0, 220.0),
  vec3(0.0, 188.0, 225.0),
  vec3(89.0, 60.0, 151.0),
  vec3(140.0, 85.0, 235.0),
  vec3(164.0, 103.0, 250.0),
  vec3(196.0, 120.0, 255.0),
  vec3(231.0, 135.0, 109.0),
  vec3(255.0, 186.0, 140.0),
  vec3(255.0, 239.0, 92.0),
  vec3(255.0, 166.0, 215.0)
);

vec3 rgb2index(vec3 v) {
  float minDist = 1e20;
  vec3 index = vec3(0.0);
  for (int i = 0; i < 32; i++) {
    vec3 col = palette[i] / 256.0;
    float dist = dot(v - col, v - col);
    if (dist < minDist) {
      minDist = dist;
      index = col;
    }
  }
  return index;
}
uniform float time;
const vec3 i_volume_size = vec3(32);
float map(vec3 v) {
  ivec3 p = ivec3(v);
  int i = p.x ^ p.y;
  return (i == p.z) ? float(i & 31) + 1.0 : 0.0;
}

in vec3 p;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

vec3 ACESFilm(vec3 x){
  float a = 2.51;
  float b = 0.03;
  float c = 2.43;
  float d = 0.59;
  float e = 0.14;
  return (x*(a*x+b))/(x*(c*x+d)+e);
}

void main() {
  vec2 uv = (gl_FragCoord.xy / 512.0) * 2.0 - 1.0;
  mat3 rot = mat3(modelViewMatrix);
  vec3 rayDir = vec3(0.0, 0.0, -1.0)*rot;
  vec3 rayPos = vec3(i_volume_size.x*0.5) + vec3(uv * i_volume_size.x, 0.0) * rot + vec3(0.0, 0.0, i_volume_size.x) * rot;
  vec3 color = vec3(-1.0);
  vec3 dRd = 1.0 / abs(rayDir);
  vec3 rd = sign(rayDir);
  vec3 side = dRd * (rd * (floor(rayPos) + 0.5 - rayPos) + 0.5);
  vec3 mask;
  for (int i = 0; i < 4*int(i_volume_size.x); i++) {
    mask = step(side, side.yzx) * (1.0 - step(side.zxy, side));
    side += mask * dRd;
    rayPos += mask * rd;
    vec3 v = floor(rayPos.xzy);
    float m = i_volume_size.x;
    float index = map(v);
    if (v.x>m||v.y>m) break;
    if (index > 0.0 && all(greaterThanEqual(v,vec3(0))) && all(lessThan(v,vec3(i_volume_size.x)))) {
      color = palette[int(mod(index - 1.0, 32.0))]/256.0;
      color *= max(0.0,dot(mask,normalize(vec3(0.5,1.0,0.75))))+0.375;
      color += vec3(0.0,0.0,0.125);
      break;
    }
  }
  if (color != vec3(-1.0)) {
    int i = int(mod(floor(gl_FragCoord.x), 4.0) + mod(floor(gl_FragCoord.y), 4.0) * 4.0);
    float d = dither[i] / 256.0;
    //color = floor(color * 32.0) / 32.0 + d;
    //color = rgb2index(color);
    fragColor = vec4(color, 1.0);
  } else {
    vec3 n = floor(abs(p - 0.5) + 0.5);
    fragColor = vec4(palette[2]/256.0*(max(0.0,dot(n,normalize(vec3(0.5,1.0,0.75))))+0.375)+vec3(0.0,0.0,0.125),1.0);
  }
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  error.innerHTML = ">_";
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    error.innerHTML = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    //console.error("Unable to initialize the shader program:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  program.vertexShader = vertexShader;
  program.fragmentShader = fragmentShader;
  return program;
}

function updateFragmentShader(gl, program, fragmentShaderSource) {
  const newFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (newFragmentShader) {
    gl.detachShader(program, program.fragmentShader);
    gl.deleteShader(program.fragmentShader);
    gl.attachShader(program, newFragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      //console.error("Unable to update the fragment shader:", gl.getProgramInfoLog(program));
      //gl.deleteProgram(program);
      return null;
    }
    program.fragmentShader = newFragmentShader;
  }
}

function createCube(gl) {
  const positions = [
    // Front face
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5,
    // Back face
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,
    -0.5,  0.5, -0.5,
  ];

  const indices = [
    0, 1, 2, 0, 2, 3, // Front face
    1, 5, 6, 1, 6, 2, // Right face
    5, 4, 7, 5, 7, 6, // Back face
    4, 0, 3, 4, 3, 7, // Left face
    3, 2, 6, 3, 6, 7, // Top face
    4, 5, 1, 4, 1, 0, // Bottom face
  ];

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    indices: indexBuffer,
    count: indices.length,
  };
}

function main() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl2",{ antialias: false });
  if (!gl) {
    console.error("Unable to initialize WebGL 2.");
    return;
  }
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.FRONT);
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vertexShader, fragmentShader);
  const cube = createCube(gl);
  const modelViewMatrix = mat4.create();
  const projectionMatrix = mat4.create();
  mat4.ortho(projectionMatrix,-1,1,-1,1,0,4);
  //mat4.perspective(projectionMatrix,90*Math.PI/180,canvas.width/canvas.height,0,4);
  let yaw = 120/(180/Math.PI);
  let pitch = 30/(180/Math.PI);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(program);
  const positionAttributeLocation = gl.getAttribLocation(program, "position");
  gl.bindBuffer(gl.ARRAY_BUFFER, cube.position);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttributeLocation);
  function render(t) {
    //yaw+=0.01;
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, [0,0,-1]);
    mat4.rotateX(modelViewMatrix, modelViewMatrix, pitch);
    mat4.rotateY(modelViewMatrix, modelViewMatrix, yaw);
    //gl.uniform1f(gl.getUniformLocation(program,"time"),t/100);
    const modelViewMatrixLocation = gl.getUniformLocation(program, "modelViewMatrix");
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);
    const projectionMatrixLocation = gl.getUniformLocation(program, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indices);
    gl.drawElements(gl.TRIANGLES, cube.count, gl.UNSIGNED_SHORT, 0);
    //requestAnimationFrame(render);
  }
  render();
  document.getElementById("input").addEventListener("input", () => {
    updateFragmentShader(gl, program, fragmentShaderSource.replace("float map(vec3 v) {\n  ivec3 p = ivec3(v);\n  int i = p.x ^ p.y;\n  return (i == p.z) ? float(i & 31) + 1.0 : 0.0;\n}", input.value));
    render();
  });
  downloadBtn.onclick = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const fileName = `snap${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
    drawScene(gl, program, cube, modelViewMatrix, projectionMatrix);
    saveFile(canvas.toDataURL(),fileName+".png");
  }
}

main();