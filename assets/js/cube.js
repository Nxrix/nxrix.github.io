const { createCanvas, WebGLRenderingContext } = require('headless-gl');
const { mat4 } = require('gl-matrix');

const vertexShaderSource = `#version 300 es
in vec3 position;
out vec3 p;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  p = position + 0.5;
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 p;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
out vec4 fragColor;

void main() {
  fragColor = vec4(p, 1);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
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
    gl.deleteProgram(program);
    return null;
  }
  program.vertexShader = vertexShader;
  program.fragmentShader = fragmentShader;
  return program;
}

function createCube(gl) {
  const positions = [
    // Front face
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
    0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
    // Back face
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,
    0.5, 0.5, -0.5,
    -0.5, 0.5, -0.5,
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

function drawScene(gl, program, cube, modelViewMatrix, projectionMatrix) {
  const modelViewMatrixLocation = gl.getUniformLocation(program, 'modelViewMatrix');
  gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);
  const projectionMatrixLocation = gl.getUniformLocation(program, 'projectionMatrix');
  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indices);
  gl.drawElements(gl.TRIANGLES, cube.count, gl.UNSIGNED_SHORT, 0);
}

function main() {
  const width = 512;
  const height = 512;
  const canvas = createCanvas(width, height, WebGLRenderingContext);
  const gl = canvas.getContext('webgl2', { antialias: false });
  if (!gl) {
    console.error('Unable to initialize WebGL 2.');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vertexShader, fragmentShader);
  const cube = createCube(gl);
  const modelViewMatrix = mat4.create();
  const projectionMatrix = mat4.create();
  mat4.ortho(projectionMatrix, -1, 1, -1, 1, 0, 4);
  mat4.perspective(projectionMatrix, 90 * Math.PI / 180, width / height, 0, 4);
  let yaw = 120/(180/Math.PI);
  let pitch = 30/(180/Math.PI);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(program);
  const positionAttributeLocation = gl.getAttribLocation(program, 'position');
  gl.bindBuffer(gl.ARRAY_BUFFER, cube.position);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttributeLocation);
  function render() {
    //yaw += 0.01;
    //pitch += 0.01;
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -1.5]);
    mat4.rotateX(modelViewMatrix, modelViewMatrix, pitch);
    mat4.rotateY(modelViewMatrix, modelViewMatrix, yaw);
    drawScene(gl, program, cube, modelViewMatrix, projectionMatrix);
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    console.log('Rendered pixels:', pixels);
  }
  render();
}

main();
