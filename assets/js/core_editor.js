/**
 * @copyright (c) 2025 Nxrix. All rights reserved.
 */

class CoreEditor {
  constructor(selector, options = {}) {
    this.container = document.querySelector(selector);
    this.options = options;

    this.editor = document.createElement("div");
    this.editor.className = "core_editor";

    this.wrap = document.createElement("div");
    this.wrap.className = "wrap";

    this.pre = document.createElement("pre");
    this.code = document.createElement("code");
    this.pre.appendChild(this.code);

    this.textarea = document.createElement("textarea");
    this.textarea.setAttribute("spellcheck", "false");
    this.textarea.setAttribute("autocorrect", "off");
    this.textarea.setAttribute("autocapitalize", "off");
    this.textarea.setAttribute("translate", "no");

    this.numbers = document.createElement("div");
    this.numbers.className = "numbers";

    this.wrap.appendChild(this.pre);
    this.wrap.appendChild(this.textarea);
    this.wrap.appendChild(this.numbers);
    this.editor.appendChild(this.wrap);
    this.container.appendChild(this.editor);

    if (this.options.value) {
      this.textarea.value = this.options.value;
      if (this.options.lang == "glsl") this.code.innerHTML = highlighter.light_glsl(this.options.value);
      if (this.options.lang == "js") this.code.innerHTML = highlighter.light_js(this.options.value);
    }

    this.textarea.addEventListener("input", () => {
      this.resize();
    });
    window.addEventListener("resize", () => {
      this.resize();
    });
    document.addEventListener("DOMContentLoaded",function(){setInterval(this.resize,500)});
    this.resize();
  }
  resize() {
    this.textarea.style.width = "";
    this.textarea.style.width = this.textarea.scrollWidth + 16 + "px";
    this.textarea.style.height = "";
    this.textarea.style.height = this.textarea.scrollHeight + "px";

    const lineCount = Math.max(this.textarea.value.split("\n").length,2);
    this.numbers.style.width = lineCount.toString().length + 2 + "em";
    this.textarea.style.left = this.numbers.style.width;
    this.pre.style.left = this.textarea.style.left;

    this.numbers.innerHTML = Array.from({ length: lineCount }, (_, index) => {
      return `<div>${index + 1}</div>`;
    }).join("");

    if (this.options.height) {
      this.editor.style.height = this.options.height;
    } else {
      this.textarea.style.height = this.numbers.style.height - (lineCount<2?16:0);
    }

    if (this.options.highlight) {
      if (this.options.lang == "glsl") this.code.innerHTML = highlighter.light_glsl(this.textarea.value);
      if (this.options.lang == "js") this.code.innerHTML = highlighter.light_js(this.textarea.value);
    } else {
      this.code.innerHTML = this.textarea.value;
    }
  }
}
