---
layout: default
title: "JS Console"
description: ""
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

const editor = new CoreEditor("#editor", { highlight: true , lang: "js" , value: `1` });

editor.textarea.addEventListener("input",() => {
  const val = editor.textarea.value;
  try {
    const result = eval(val);
    error.textContent = result.toString();
  } catch (error) {
    error.textContent = error.message;
  }
});

</script>
