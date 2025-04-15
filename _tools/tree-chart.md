---
layout: default
title: "Tree Chart"
description: "Easily create tree charts"
image: "tree-chart.png"
cid: 3
---

<style>
#canvas {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  aspect-ratio: 4/3;
  outline: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 24px;
  margin-top: 24px;
  margin-bottom: 24px;
}
.tree {
  transform-origin: center;
  width: fit-content;
  height: fit-content;
  white-space: nowrap;
}
.tree ul {
  padding-top: 20px;
  position: relative;
}
.tree li {
  text-align: center;
  list-style-type: none;
  position: relative;
  padding: 20px 5px 0 5px;
  float: none;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
  margin: 0 -2px 0 -2px;
}
.tree li::before,
.tree li::after {
  content: "";
  position: absolute;
  top: 0;
  right: 50%;
  border-top: 1px solid var(--md-sys-color-outline-variant);
  width: 50%;
  height: 20px;
}
.tree li::after {
  right: auto;
  left: 50%;
  border-left: 1px solid var(--md-sys-color-outline-variant);
}
.tree li:only-child::after,
.tree li:only-child::before {
  display: none;
}
.tree li:only-child {
  padding-top: 0;
}
.tree li:first-child::before,
.tree li:last-child::after {
  border: none;
}
.tree li:last-child::before {
  border-right: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 0 8px 0 0;
}
.tree li:first-child::after {
  border-radius: 8px 0 0 0;
}
.tree ul ul::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  border-left: 1px solid var(--md-sys-color-outline-variant);
  width: 0;
  height: 20px;
}
.tree li div {
  user-select: none;
  display: inline-block;
  background-color: var(--md-sys-color-background);
  color: var(--md-sys-color-on-surface);
  font-size: 16px;
  border: 1px solid var(--md-sys-color-outline-variant);
  padding: 16px;
  border-radius: 8px;
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
}
</style>

## Tree Chart

Use indentation to define parent-child relationships. Each line represents a node, and its indentation (2 spaces) determines its depth in the hierarchy.

<div id="canvas" class="canvas_4x3 center">
  <div id="tree" class="tree"></div>
</div>
<div id="editor"></div>

<script src="./js/highlighter.js?{{site.time|date:'%s%N'}}"></script>
<script src="./js/core_editor.js?{{site.time|date:'%s%N'}}"></script>
<script src="./js/camera_2d.js?{{site.time|date:'%s%N'}}"></script>

<script>
"use strict";

const parse_tree = (text,indentSize=2,rtl=false) => {
  const lines = text.split("\n");
  const stack = [];
  let root = null;
  lines.forEach(line => {
    if (!line.trim()) return;
    const indent = line.search(/\S|$/);
    const name = line.trim();
    const level = Math.floor(indent/indentSize);
    const node = { name };
    if (level==0) {
      root = node;
      stack.length = 0;
      stack.push(node);
    } else {
      while (stack.length>level) {
        stack.pop();
      }
      const parent = stack[stack.length-1];
      if (!parent.children) {
        parent.children = [];
      }
      if (rtl) {
        parent.children.unshift(node);
      } else {
        parent.children.push(node);
      }
      stack.push(node);
    }
  });
  return root;
}

const create_tree = (node) => {
  const li = document.createElement("li");
  const div = document.createElement("div");
  div.textContent = node.name;
  li.appendChild(div);
  if (node.children&&node.children.length>0) {
    const ul = document.createElement("ul");
    ul.classList.add("ul");
    node.children.forEach(child => {
      ul.appendChild(create_tree(child));
    });
    li.appendChild(ul);
  }
  return li;
}

const render_tree = (data) => {
  tree.innerHTML = "";
  const ul = document.createElement("ul");
  ul.classList.add("ul");
  ul.appendChild(create_tree(data));
  tree.appendChild(ul);
}

const editor = new CoreEditor("#editor", { value: `A
  B
    D
    F
  C
    E
    G` });

const camera = new Camera2D(canvas,{},(e)=>{
  tree.style.transform = "scale("+e.z+") translateX("+e.x+"px) translateY("+e.y+"px)";
});

const update = () => {
  const val = editor.textarea.value;
  try {
    render_tree(parse_tree(val),2,/[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(val));
  } catch (err) {
    render_tree(parse_tree("Error\n  "+err.toString()));
  }
}
  
editor.textarea.addEventListener("input",() => {
  update();
});
update();

</script>
