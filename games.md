---
layout: default
title: "Games"
description: ""
---

<h2>Games</h2>
<div class="cart_set">
  {% for game in site.games %}
  {% unless game.hidden %}
  <a href="{{ game.rdurl | default: game.url }}" class="cart">
    <img class="pixelated" src="./img/carts/{{ game.image }}">
    <div class="content">
      <div class="title">{{ game.title }}</div>
      <div class="description">{{ game.description }}</div>
    </div>
  </a>
  {% endunless %}
  {% endfor %}
</div>
