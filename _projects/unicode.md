---
layout: default
title: "Unicode Table"
description: "Search & View Unicode characters"
image: "unicode.png"
---

<style>
  #table {
    width: 100%;
    max-width: 400px;
    margin: 2% auto;
    padding: 20px;
    box-shadow: 0 0 0 1px var(--md-sys-color-surface-dim);
    border-radius: 15px;
  }
  #table .char {
    display: inline-block;
    overflow: hidden;
    margin: 0 0 -3px 0;
    width: calc(100%/8);
    aspect-ratio : 1;
    box-shadow: 0 0 0 1px var(--md-sys-color-surface-dim);
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
  #table .char .inner_char {
    display: flex;
    aspect-ratio: 1;
    align-items: center;
    justify-content: center;
  }
  #table .selected {
    background: var(--md-sys-color-on-surface);
    color: var(--md-sys-color-background);
  }
  #input {
    background: #0000;
    font-size: medium;
    text-align: center;
    width: 70%;
    padding: 2.5%;
    margin: 5% 5% 0 0;
    box-shadow: 0 0 0 1px var(--md-sys-color-surface-dim);
    border: 0;
  }
  .button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 25%;
    padding: 2.5%;
    margin: 5% 0 0 0;
    box-shadow: 0 0 0 1px var(--md-sys-color-surface-dim);
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
  .buttons {
    width: 100%;
    aspect-ratio : 8 / 1;
    box-shadow: 0 0 0 1px var(--md-sys-color-surface-dim);
    margin: 5% auto 0 0;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
  .buttons div {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: calc(100%/4);
    aspect-ratio : 2 / 1;
    border-radius: 100px;
  }
  .outchar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
    aspect-ratio: 1 / 1;
    font-size: xxx-large;
    margin: 0 auto;
    box-shadow: 0 0 0 1px var(--md-sys-color-surface-dim);
    border-radius: 15px;
  }
</style>
## Unicode Table

<div id="table"></div>
<script>
var url_string = window.location.href;
var url = new URL(url_string);
page = parseInt(url.searchParams.get("page"));
selected = parseInt(url.searchParams.get("char"));
if (isNaN(page)) {page = 0;} else {page = page-1;}
if (isNaN(selected)) {selected = 0;}
update = (x,y) => {
  if (y==null||y<0) selected=y=0;
  if (y>63) selected=y=63;
  if (x<0) page=x=0;
  if (x>17406) page=x=17406;
  history.replaceState({}, null, `../projects/unicode/?page=${x+1}&char=${y}`);
  table.innerHTML = "";
  var r = 8;
  for (var i=0;i<r;i++) {
    for (var j=0;j<r;j++) {
      table.innerHTML += `<div class="char${(y==(i*r+j)?" selected":"")}" onclick="update(page,selected=${i*r+j})"><div class="inner_char">&#x${(i*r+j+x*r*r).toString(16)};</div></div>`;
    }
  }
  table.innerHTML += `
    <input id="input" autocomplete="off" value="${page+1}"><div class="button" onclick="update(page=(parseInt(input.value-1))||0,selected)">Go</div>
    <div class="buttons">
      <div onclick="update(page-=1,selected)"><</div><div onclick="update(page-=2,selected)"><<</div><div onclick="update(page+=2,selected)">>></div><div onclick="update(page+=1,selected)">></div>
    </div><br>
    <div class="outchar">&#x${(y+x*r*r).toString(16)};</div><br>
    Unicode: <span>U+${(y+x*r*r).toString(16).padStart(4,"0")}</span><br>
    HTML: <span>&amp#x${(y+x*r*r).toString(16)};</span><br>
    CSS: <span>\\${(y+x*r*r).toString(16).padStart(4,"0")}</span>`;
}
update(page,selected);
</script>
