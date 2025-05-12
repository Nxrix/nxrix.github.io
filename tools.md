---
layout: default
title: "Tools"
description: ""
---

<h2><img src="./img/icons/tools-0.png" class="pixelated h2-icon">Tools</h2>
<div class="cart_set">
  {% assign sorted_tools = site.tools | sort: "cid" | reverse %}
  {% for tool in sorted_tools %}
    {% unless tool.hidden %}
      <a href="{{ tool.rdurl | default: tool.url }}" class="cart">
        <img {% unless tool.pixelated == false %}class="pixelated"{% endunless %} src="./img/carts/{{ tool.image }}">
        <div class="content">
          <div class="title">{{ tool.title }}</div>
          <div class="description">{{ tool.description }}</div>
        </div>
      </a>
    {% endunless %}
  {% endfor %}
</div>
