---
layout: default
title: "test"
hidden: true
---

<canvas class="canvas_full"></canvas>

# H1

## H2

### H3

#### H4

##### H5

###### H6

* ABCDEFGHIJKLMNOPQRSTUVWXYZ
* abcdefghijklmnopqrstuvwxyz
* The quick brown fox jumps over the lazy dog

1. ABCDEFGHIJKLMNOPQRSTUVWXYZ
2. abcdefghijklmnopqrstuvwxyz
3. The quick brown fox jumps over the lazy dog

<input type="text" placeholder="text">
<input type="password" placeholder="password">

<div id="editor"></div>

<script src="./js/storage.js"></script>
<script src="./js/highlighter.js"></script>
<script src="./js/core_editor.js"></script>

<script>
const editor = new CoreEditor("#editor", { highlight: true , lang: "glsl" , value: `  // dx: max(X,Y,Z)  //
 // dn: min(X,Y,Z)  //
// dt: |X|+|Y|+|Z| //

if (( (x^y^z)%dx ) == 0)
{ return f(dx)+1.0; }
else 
{ return 0.0; }` });
</script>
