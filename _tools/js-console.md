---
layout: default
title: "JS Console"
description: "Write and execute JavaScript code"
image: "js.png"
---

<hr>
<div id="editor"></div>
<div id="error" class="info-error"></div>
<hr>

<script src="./js/highlighter.js"></script>
<script src="./js/core_editor.js"></script>

<script>
"use strict";

const pi = Math.PI;

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
for (let i=1;i<=8;i++) {
  a += \`\${i}: \${get_pi(i)}\\n\`;
}
a;` });

editor.textarea.addEventListener("input",() => {
  const val = editor.textarea.value;
  try {
    const result = eval(val);
    error.innerText = result.toString();
  } catch (error) {
    error.innerText = error.message;
  }
});

</script>
