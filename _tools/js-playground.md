---
layout: default
title: "JS Playground"
description: "Write and execute JavaScript code"
image: "js.png"
cid: 1
---

## Playground

<div id="editor"></div>
<div id="error" class="info-error"></div>

<script src="./js/highlighter.js"></script>
<script src="./js/core_editor.js"></script>

<script>
"use strict";

const pi = Math.PI;

const abs = (n) => { return Math.abs(n); }
const floor = (n) => { return Math.floor(n); }
const round = (n) => { return Math.round(n); }
const ceil = (n) => { return Math.ceil(n); }

const pow = (n) => { return Math.pow(n); }
const sqrt = (n) => { return Math.sqrt(n); }

const sin = (n) => { return Math.sin(n); }
const cos = (n) => { return Math.cos(n); }
const tan = (n) => { return Math.tan(n); }
const cot = (n) => { return Math.cot(n); }

const d2r = pi/180;
const r2d = 180/pi;

const editor = new CoreEditor("#editor", { highlight: true , lang: "js" , value: `const get_pi = (n) =>{
  let pi = 3;
  let sign = 1;
  for (let i=2;i<n*2+2;i+=2) {
    pi += sign*(4/(i*(i+1)*(i+2)));
    sign *= -1;
  }
  return pi;
}

let a = "";
const b = 8;
const c = 16;
const m = (c+1)*b;
for (let i=1;i<=m;i+=b) {
  const x = get_pi(i);
  a += \`\${(i-1).toString().padStart(m.toString().length," ")} | \${x.toFixed(8)} | \${abs(pi-x).toFixed(8).replace(/[0.]/g," ")}\\n\`;
}
a;` });

const update = () => {
  const val = editor.textarea.value;
  try {
    const result = eval(val);
    error.innerText = result.toString();
  } catch (err) {
    error.innerText = err.toString();
  }
}
  
editor.textarea.addEventListener("input",() => {
  update();
});
update();

  
</script>
