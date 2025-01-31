/**
 * @copyright   (c) 2025 Nxrix. All rights reserved.
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
    `<span class="${token.type}">${token.value}</span>`
  ).join("");
};

highlighter.light_glsl = (code) => {
  const regexes = [
    { regex: /\/\/.*|\/\*[\s\S]*?\*\//g, name: "c" },
    { regex: /"(?:[^"\\]|\\.)*"/g, name: "s" },
    { regex: /\b(true|false)\b/g, name: "b" },
    { regex: /\b(?:float|int|bool|void|vec2|vec3|vec4|mat2|mat3|mat4|if|else|for|while|return|discard|f|f[234]|i|i[234]|b|b[234]|m[234])\b/g, name: "k" },
    { regex: /\b[a-zA-Z_]\w*(?=\s*\()/g, name: "f" },
    { regex: /\d+(\.\d+)?/g, name: "n" },
    { regex: /[{}[\]().,;]/g, name: "d" },
    { regex: /[+\-*/%=~^&|<>!]+/g, name: "o" },
  ];
  return highlighter.light(highlighter.tok(code,regexes));
}

highlighter.light_js = (code) => {
  const regexes = [
    { regex: /\/\/.*|\/\*[\s\S]*?\*\//g, name: "c" },
    { regex: /"(?:[^"\\]|\\.)*"/g, name: "s" },
    { regex: /\b(true|false)\b/g, name: "b" },
    { regex: /\b(?:const|let|var|function|if|else|for|while|return|class|new|this|async|await)\b/g, name: "k" },
    { regex: /\b[a-zA-Z_]\w*(?=\s*\()/g, name: "f" },
    { regex: /\d+(\.\d+)?/g, name: "n" },
    { regex: /[{}[\]().,;]/g, name: "d" },
    { regex: /[+\-*/%=^&|<>!]+/g, name: "o" }
  ];
  return highlighter.light(highlighter.tok(code,regexes));
};
