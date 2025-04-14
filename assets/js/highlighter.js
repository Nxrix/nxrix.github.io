/**
 * @copyright (c) 2025 Nxrix. All rights reserved.
 */

const highlighter = {};

highlighter.tok = (code,regexes) => {
  let tokens = [];
  let match;
  while (code) {
    let minIndex = code.length;
    let minMatch = null;
    let minName = null;
    for (const { regex, name } of regexes) {
      regex.lastIndex = 0;
      match = regex.exec(code);
      if (match && match.index < minIndex) {
        minIndex = match.index;
        minMatch = match;
        minName = name;
      }
    }
    if (minMatch) {
      if (minIndex > 0) {
        tokens.push({ type: "def", value: code.slice(0, minIndex) });
      }
      tokens.push({ type: minName, value: minMatch[0] });
      code = code.slice(minIndex + minMatch[0].length);
    } else {
      tokens.push({ type: "def", value: code });
      break;
    }
  }
  return tokens;
};

highlighter.light = (tokens) => {
  return tokens.map(token => 
    `<span class="${token.type}">${token.value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}</span>`
  ).join("");
};

highlighter.glsl_regex = [
  { regex: /\/\/.*|\/\*[\s\S]*?\*\//g, name: "c" },
  { regex: /"(?:[^"\\]|\\.)*"/g, name: "s" },
  { regex: /\b(true|false)\b/g, name: "b" },
  { regex: /\b(?:float|int|bool|void|vec2|vec3|vec4|mat2|mat3|mat4|if|else|for|while|return|discard|f|f[234]|i|i[234]|b|b[234]|m[234])\b/g, name: "k" },
  { regex: /\b[a-zA-Z_]\w*(?=\s*\()/g, name: "f" },
  { regex: /\b(?:0[xX][0-9a-fA-F]+|\d+(\.\d+)?|\.\d+)\b/g, name: "n" },
  { regex: /[{}[\]().,:;]/g, name: "d" },
  { regex: /[+\-*/%=~^&|<>!]+/g, name: "o" },
];

highlighter.js_regex = [
  { regex: /\/\/.*|\/\*[\s\S]*?\*\//g, name: "c" },
  { regex: /"(?:[^"\\]|\\.)*"/g, name: "s" },
  { regex: /'(?:[^'\\]|\\.)*'/g, name: "s" },
  { regex: /`(?:[^`\\]|\\.)*`/g, name: "s" },
  { regex: /\b(true|false)\b/g, name: "b" },
  { regex: /\b(?:const|let|var|function|if|else|for|while|return|class|new|this|async|await)\b/g, name: "k" },
  { regex: /\b[a-zA-Z_]\w*(?=\s*\()/g, name: "f" },
  { regex: /\b(?:0[xX][0-9a-fA-F]+|0[bB][01]+|\d+(\.\d+)?|\.\d+)\b/g, name: "n" },
  { regex: /[{}[\]().,:;]/g, name: "d" },
  { regex: /[+\-*/%=^&|<>!]+/g, name: "o" }
];

highlighter.light_glsl = (code) => {
  return highlighter.light(highlighter.tok(code,highlighter.glsl_regex));
}

highlighter.light_js = (code) => {
  return highlighter.light(highlighter.tok(code,highlighter.js_regex));
};

highlighter.glsl_cache = {
  text: "",
  lines: [],
  highlighted_lines: []
};

highlighter.js_cache = {
  text: "",
  lines: [],
  highlighted_lines: []
};

highlighter.light_js_v2 = (newCode) => {
  const newLines = newCode.split("\n");
  const prevLines = highlighter.glsl_cache.lines;
  const prevHighlighted = highlighter.glsl_cache.highlighted_lines;
  let highlighted_lines = [];
  for (let i = 0; i < newLines.length; i++) {
    if (i < prevLines.length && newLines[i] == prevLines[i]) {
      highlighted_lines[i] = prevHighlighted[i];
    } else {
      highlighted_lines[i] = highlighter.light(highlighter.tok(newLines[i],highlighter.glsl_regex));
    }
  }
  highlighted_lines = highlighted_lines.slice(0,newLines.length);
  highlighter.glsl_cache.text = newCode;
  highlighter.glsl_cache.lines = newLines;
  highlighter.glsl_cache.highlighted_lines = highlighted_lines;
  return highlighted_lines.join("\n");
};

highlighter.light_js_v2 = (newCode) => {
  const newLines = newCode.split("\n");
  const prevLines = highlighter.js_cache.lines;
  const prevHighlighted = highlighter.js_cache.highlighted_lines;
  let highlighted_lines = [];
  for (let i = 0; i < newLines.length; i++) {
    if (i < prevLines.length && newLines[i] == prevLines[i]) {
      highlighted_lines[i] = prevHighlighted[i];
    } else {
      highlighted_lines[i] = highlighter.light(highlighter.tok(newLines[i],highlighter.js_regex));
    }
  }
  highlighted_lines = highlighted_lines.slice(0,newLines.length);
  highlighter.js_cache.text = newCode;
  highlighter.js_cache.lines = newLines;
  highlighter.js_cache.highlighted_lines = highlighted_lines;
  return highlighted_lines.join("\n");
};
