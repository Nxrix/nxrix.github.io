---
layout: default
title: "Name Generator"
description: "Generate names"
image: "name.png"
---

## Name Generator

The generator uses a JSON configuration to determine how names are generated. You can modify the following parameters:
   - seed: A number that initializes the random name generation. Changing this value will produce different sets of names.
   - limit: The maximum number of names to generate. Set this to any positive integer.
   - length: An array specifying the lengths of the names to generate. For example, `[5, 7]` will generate names that are 5 or 7 characters long.
   - chars: A string of characters that can be used in the names. By default, it uses lowercase letters from "a" to "z".
   - patterns: An array of string patterns that define the structure of the names. For example, `["*a", "*b"]` will generate names that their second character is "a" or "b".
   - capitalize: A boolean value that determines whether the first letter of each generated name should be capitalized.

<div id="editor"></div>
<div id="result" class="info-result"></div>

<script src="./js/highlighter.js"></script>
<script src="./js/core_editor.js"></script>

<script>
"use strict";

const editor = new CoreEditor("#editor", { highlight: true , lang: "js" , value: `{
  "seed": 0,
  "limit": 16,
  "length": [5],
  "patterns": [],
  "capitalize": true
}` });

const generate_names = ({
  seed = Date.now(),
  limit = 10,
  length = [5],
  chars = "abcdefghijklmnopqrstuvwxyz",
  patterns = [],
  capitalize = true
  }) => {

  if (chars.length==0) chars = "abcdefghijklmnopqrstuvwxyz";

  const mulberry32 = (a) => {
    return () => {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t^t>>>15,t|1);
      t ^= t+Math.imul(t^t>>>7,t|61);
      return ((t^t>>>14)>>>0)/4294967296;
    }
  }

  const pairs = {
    a: "bcdflmnprstvxz",
    b: "aeiloruy",
    c: "aehiou",
    d: "aeiloruy",
    e: "bcdghklmnprstvxz",
    f: "aeiloruy",
    g: "aeiloruy",
    h: "aeiou",
    i: "bcdghklmnprstvxz",
    j: "aeiou",
    k: "aeiloruy",
    l: "aeiou",
    m: "aeiloruy",
    n: "aeiloruy",
    o: "bcdflmnprstvxz",
    p: "aeiloruy",
    q: "u",
    r: "aeiou",
    s: "aeiloruy",
    t: "aeiloruy",
    u: "bcdghklmnprstvxz",
    v: "aeioruy",
    w: "aeiou",
    x: "aeiou",
    y: "aeiou",
    z: "aeiou"
  };
  const npairs = Object.fromEntries(
    [...chars].map(char=>[char,pairs[char]]).filter(([c,v])=>v!=undefined)
  );

  const rand = mulberry32(seed);
  const lengths = Array.isArray(length)?length:[length];

  const next_char = (last) => {
    const next = npairs[last]||chars;
    return next[Math.floor(rand()*next.length)];
  }

  const generate_name = (pattern) => {
    let name = "";
    const pattern_length = pattern.length;
    const target_length = lengths[Math.floor(rand()*lengths.length)];
    for (let i=0;i<pattern_length;i++) {
      const char = pattern[i];
      if (char=="*") {
        name += next_char(name[name.length-1]||null);
      } else {
        name += char;
      }
    }
    while (name.length<target_length) {
      name += next_char(name[name.length-1]||null);
    }
    return name;
  }
  const names = [];
  for (let i=0;i<limit;i++) {
    let pattern = null;
    if (patterns.length>0) {
      pattern = patterns[Math.floor(rand()*patterns.length)];
    } else {
      pattern = "*".repeat(lengths[Math.floor(rand()*lengths.length)]);
    }
    let name = generate_name(pattern);
    if (capitalize) name = name.charAt(0).toUpperCase()+name.slice(1);
    names.push(name);
  }
  return names;
}

const update = () => {
  const val = editor.textarea.value;
  try {
    const names = generate_names(JSON.parse(val));
    result.innerText = names.join("\n");
  } catch (err) {
    result.innerText = "Error: "+err.toString();
  }
}
  
editor.textarea.addEventListener("input",() => {
  update();
});
update();

</script>
