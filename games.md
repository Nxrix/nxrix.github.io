---
layout: default
title: "Games"
description: ""
---

<h2>Games</h2>
<div class="cart_set">
  {% assign sorted_games = site.games | sort: "cid" | reverse %}
  {% for game in sorted_games %}
    {% unless game.hidden %}
      <a href="{{ game.rdurl | default: game.url }}" class="cart">
        <img {% unless game.pixelated == false %}class="pixelated"{% endunless %} src="./img/carts/{{ game.image }}">
        <div class="content">
          <div class="title">{{ game.title }}</div>
          <div class="description">{{ game.description }}</div>
        </div>
      </a>
    {% endunless %}
  {% endfor %}
</div>
