---
layout: default
title: "Posts"
description: ""
---

<h2>Posts</h2>
<div class="cart_set">
  {% assign sorted_posts = site.pages | sort: "cid" | reverse %}
  {% for post in sorted_posts %}
    {% unless post.hidden %}
      <a href="{{ post.rdurl | default: post.url }}" class="cart">
        <img {% unless post.pixelated == false %}class="pixelated"{% endunless %} src="./img/carts/{{ post.image }}">
        <div class="content">
          <div class="title">{{ post.title }}</div>
          <div class="description">{{ post.description }}</div>
        </div>
      </a>
    {% endunless %}
  {% endfor %}
</div>
