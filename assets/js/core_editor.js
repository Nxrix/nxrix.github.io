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
      if (this.options.highlight) {
        if (this.options.lang == "glsl") this.code.innerHTML = highlighter.light_glsl_v2(this.textarea.value);
        if (this.options.lang == "js") this.code.innerHTML = highlighter.light_js_v2(this.textarea.value);
      } else {
        this.code.innerHTML = this.textarea.value;
      }
    }

    this.textarea.addEventListener("keydown",(e)=>this.handle_keys(e));
    this.textarea.addEventListener("input", () => {
      this.resize();
    });
    window.addEventListener("resize", () => {
      this.resize();
    });
    document.fonts.ready.then(() => {
      this.resize();
    });
    this.resize();
  }
  handle_keys(e) {
    const textarea = this.textarea;
    const indentUnit = "  ";
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    if (e.key=="Tab") {
      e.preventDefault();
      const hasSelection = start !== end;
      if (e.shiftKey) {
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        const lineEnd = value.indexOf("\n", end);
        const selectionEnd = lineEnd === -1 ? value.length : lineEnd;
        const affected = value.slice(lineStart, selectionEnd);
        const lines = affected.split("\n");
        const newLines = lines.map(line =>
          line.startsWith(indentUnit) ? line.slice(indentUnit.length)
          : line.startsWith(" ") ? line.slice(1)
          : line
        );
        const newText = newLines.join("\n");
        textarea.setSelectionRange(lineStart, selectionEnd);
        document.execCommand("insertText", false, newText);
        const removed = affected.length - newText.length;
        if (hasSelection) {
          textarea.setSelectionRange(start, end - removed);
        } else {
          const cursorOffset = start - lineStart >= indentUnit.length ? indentUnit.length : 0;
          textarea.setSelectionRange(start - cursorOffset, start - cursorOffset);
        }
      } else {
        if (hasSelection) {
          const lineStart = value.lastIndexOf("\n", start - 1) + 1;
          const lineEnd = value.indexOf("\n", end);
          const selectionEnd = lineEnd === -1 ? value.length : lineEnd;

          const affected = value.slice(lineStart, selectionEnd);
          const lines = affected.split("\n");
          const newLines = lines.map(line => indentUnit + line);
          const newText = newLines.join("\n");

          textarea.setSelectionRange(lineStart, selectionEnd);
          document.execCommand("insertText", false, newText);
          const added = newText.length - affected.length;
          textarea.setSelectionRange(start, end + added);
        } else {
          document.execCommand("insertText", false, indentUnit);
          textarea.setSelectionRange(start + indentUnit.length, start + indentUnit.length);
        }
      }
      this.resize();
    }
  
    else if (e.key=="Enter") {
      const before = value.slice(0, start);
      const lines = before.split("\n");
      const currentLine = lines[lines.length - 1];
      const indentMatch = currentLine.match(/^\s*/);
      const currentIndent = indentMatch ? indentMatch[0] : "";
      const shouldIndentMore = /[\{\[\(]\s*$/.test(currentLine);
      const newIndent = currentIndent + (shouldIndentMore ? indentUnit : "");
  
      e.preventDefault();
      document.execCommand("insertText", false, "\n" + newIndent);
      this.resize();
    }
  
    /*else if (e.key=="Backspace") {
      if (start !== end) return;
  
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const inLine = value.slice(lineStart, start);
  
      if (inLine.endsWith(indentUnit)) {
        e.preventDefault();
        textarea.setSelectionRange(start - indentUnit.length, start);
        document.execCommand("delete");
        this.resize();
      }
    }*/
    else if (e.key == "Backspace") {
      if (start !== end) return;
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const inLine = value.slice(lineStart, start);
      const spaceMatch = inLine.match(/ *$/);
      const spaceCount = spaceMatch ? spaceMatch[0].length : 0;
      if (spaceCount > 0) {
        e.preventDefault();
        let deleteCount;
        if (spaceCount%indentUnit.length==0) {
          deleteCount = indentUnit.length;
        } else {
          deleteCount = 1;
        }
        textarea.setSelectionRange(start - deleteCount, start);
        document.execCommand("delete");
        this.resize();
      }
    }
  }
  resize() {
    this.textarea.style.width = "";
    this.textarea.style.width = this.textarea.scrollWidth+16+"px";
    this.textarea.style.height = "";
    this.textarea.style.height = this.textarea.scrollHeight+"px";

    const lineCount = Math.max(this.textarea.value.split("\n").length,2);
    this.numbers.style.width = lineCount.toString().length+2+"em";
    this.pre.style.left = this.textarea.style.left = this.numbers.style.width;

    this.numbers.innerHTML = Array.from({ length: lineCount }, (_, index) => {
      return `<div>${index+1}</div>`;
    }).join("");

    if (this.options.height) {
      this.editor.style.height = this.options.height;
    } else {
      this.textarea.style.height = this.numbers.style.height-(lineCount<2?16:0);
    }

    if (this.options.highlight) {
      if (this.options.lang == "glsl") this.code.innerHTML = highlighter.light_glsl_v2(this.textarea.value);
      if (this.options.lang == "js") this.code.innerHTML = highlighter.light_js_v2(this.textarea.value);
    } else {
      this.code.innerHTML = this.textarea.value;
    }
    this.textarea.style.width = this.pre.clientWidth;
    this.textarea.style.height = this.pre.clientHeight;
  }
}
