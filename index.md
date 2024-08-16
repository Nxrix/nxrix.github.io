---
layout: default
title: "Main"
description: ""
image: "krx.png"
---

# Home

{% for project in site.projects %}
<a href="{{ project.url }}" class="cart">
  <img class="pixelated" src="./img/carts/{{ project.image }}">
  <div class="content">
    <div class="title">{{ project.title }}</div>
    <div class="description">{{ project.description }}</div>
  </div>
</a>
{% endfor %}
