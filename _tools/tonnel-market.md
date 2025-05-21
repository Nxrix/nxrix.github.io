---
layout: default
title: "Tonnel Marketplace"
description: ""
image: ".png"
cid: 0
hidden: true
---
<style>

#list {
  display: grid;
  --fw: min(calc(100vw - 56px),980px);
}
#list .item {
  position: relative;
  background-color: var(--md-sys-color-background);
  box-sizing: border-box;
  overflow: hidden;
  width: 96%;
  margin: 2%;
  border-radius: calc(var(--font)/100*10);
  font-size: 0;
  outline: 1px solid var(--md-sys-color-outline-variant);
}
#list img {
  width: 100%;
  aspect-ratio: 1;
}
#list .q {
  color: var(--md-sys-color-outline-variant);
  font-size: calc(var(--font)/100*30);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  aspect-ratio: 1;
}
#list .id {
  background-color: #0014;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10%;
  position: absolute;
  top: 0;
  right: 0;
  transform-origin: center center;
  transform: translateX(45%) rotateZ(45deg) translateY(80%);
  font-size: calc(var(--font)/100*6);
}

#list .price {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 9%;
  left: 10%;
  font-family: "mono";
  font-size: calc(var(--font)/100*8);
  text-shadow: 0 0 1px black;
  color: #fff;
}

@media screen and (width > 100px) {
  #list {
    grid-template-columns: repeat(2,1fr);
    --font: calc(var(--fw)/2);
  }
}
@media screen and (width > 500px) {
  #list {
    grid-template-columns: repeat(3,1fr);
    --font: calc(var(--fw)/3);
  }
}
@media screen and (width > 700px) {
  #list {
    grid-template-columns: repeat(4,1fr);
    --font: calc(var(--fw)/4);
  }
}
@media screen and (width > 900px) {
  #list {
    grid-template-columns: repeat(5,1fr);
    --font: calc(var(--fw)/5);
  }
}

.controls {
  display: flex;
  width: 100%;
  height: 48px;
  padding: 4px;
  margin-top: 8px;
}

.controls button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  aspect-ratio: 1;
  margin: 0;
  min-width: 0;
}

.controls button:first-of-type {
  border-radius: 16px 8px 8px 16px;
}

.controls button:last-of-type {
  border-radius: 8px 16px 16px 8px;
}

.controls input {
  width: calc(100% - 90px);
  height: 100%;
  text-align: center;
  margin: 0 auto;
}

.filteri {
  margin: 8px 2px;
}
.filterd {
  display: none;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  max-height: 256px;
  padding: 8px;
  border-radius: 12px;
  outline: 1px solid var(--md-sys-color-outline-variant);
}
.filterd .filters {
  margin-bottom: 8px;
}
.filterd .filterl {
  padding: 4px;
  overflow-y: auto;
}
.filterd .filterl div img {
  width: 15px;
  margin-left: 4px;
  margin-right: 4px;
}
.filterd .filterl div {
  cursor: pointer;
  padding: 4px;
}
.filterd .filterl div.active {
  border-left: 2px solid var(--md-sys-color-primary-container);
}
.filterd .filterl div.hidden {
  diplay: none;
}

</style>

## Tonnel Marketplace

<div style="display:flex;align-items:center;justify-content:center;width:100%;max-width:400px;margin:0 auto;">
  <button id="collectionst" class="filteri">Collection</button>
  <button id="modelst" class="filteri">Model</button>
</div>
<div style="display:flex;align-items:center;justify-content:center">

  <div id="collectionsd" class="filterd">
    <input id="collectionss" class="filters" type="text" autocomplete="false" placeholder="Search...">
    <div id="collectionsl" class="filterl"></div>
  </div>

  <div id="modelsd" class="filterd" style="display:none">
    <input id="modelss" class="filters" type="text" autocomplete="false" placeholder="Search...">
    <div id="modelsl" class="filterl"></div>
  </div>

</div>

<select id="sort">
  <option value="d">Sort: Latest</option>
  <option value="p0">Sort: Price low to high</option>
  <option value="p1">Sort: Price high to low</option>
  <option value="i">Sort: ID</option>
  <option value="r">Sort: Rarity</option>
  <option value="m">Sort: Model</option>
  <option value="b">Sort: Backdrop</option>
  <option value="s">Sort: Symbol</option>
</select>
<button onclick="page=0;load_gifts()">Search</button>

<div id="list"></div>

<div class="controls">
  <button onclick="page--;load_gifts()"><</button>
  <input type="text" id="pagei">
  <button onclick="page++;load_gifts()">></button>
</div>

<script>

const gift_names = `Astral Shard
B-Day Candle
Berry Box
Bunny Muffin
Candy Cane
Cookie Heart
Crystal Ball
Desk Calendar
Diamond Ring
Durov's Cap
Easter Egg
Electric Skull
Eternal Candle
Eternal Rose
Evil Eye
Flying Broom
Genie Lamp
Ginger Cookie
Hanging Star
Hex Pot
Homemade Cake
Hypno Lollipop
Ion Gem
Jack-in-the-Box
Jelly Bunny
Jester Hat
Jingle Bells
Kissed Frog
LolPop
Loot Bag
Love Candle
Love Potion
Lunar Snake
Mad Pumpkin
Magic Potion
Mini Oscar
Neko Helmet
Party Sparkler
Perfume Bottle
Plush Pepe
Precious Peach
Record Player
Sakura Flower
Santa Hat
Scared Cat
Sharp Tongue
Signet Ring
Skull Flower
Sleigh Bell
Snow Globe
Snow Mittens
Spiced Wine
Spy Agaric
Star Notepad
Swiss Watch
Tama Gadget
Top Hat
Toy Bear
Trapped Heart
Vintage Cigar
Voodoo Doll
Winter Wreath
Witch Hat`;

const fix_name = n => n.replaceAll(" ","").replaceAll("-","").replaceAll("'","").toLowerCase();

const get_img = (a,b,c=0) => {
  return `https://nft.fragment.com/gift/${a}-${b}.${["small","medium","large"][c]||c}.jpg`
}

const tonnel_search = async (page=1,limit=8,sort="d",asset="TON",{name,model,backdrop,symbol}) => {
  const s = {
    d: { message_post_time: -1 , gift_id: -1 },
    p0: { price:  1 , gift_id: -1 },
    p1: { price: -1 , gift_id: -1 },
    i: { gift_num: 1 , gift_id: -1 },
    r: { rarity: -1 , gift_id: -1 },
    m: { modelRarity: 1 , gift_id: -1 },
    b: { backdropRarity: 1 , gift_id: -1 },
    s: { symbolRarity: 1 , gift_id: -1 }
  };
  return await(await fetch("https://gifts2.tonnel.network/api/pageGifts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      page,
      limit,
      sort: JSON.stringify(s[sort]),
      filter: JSON.stringify({
        price: { $exists: true },
        refunded: { $ne: true },
        buyer: { $exists: false },
        export_at: { $exists: true },
        asset,
        ...(     name?.length && { gift_name: name }),
        ...(    model?.length && {     model: { $in:    model } }),
        ...( backdrop?.length && {  backdrop: { $in: backdrop } }),
        ...(   symbol?.length && {    symbol: { $in:   symbol } })
      }),
      ref: 0,
      price_range: null,
      user_auth: ""
    })
  })).json();
}

const gift_names0 = fix_name(gift_names);

const gifts = gift_names.split("\n");
const gifts0 = gift_names0.split("\n");

const add_gift = (c,n,p) => {
  const gift = document.createElement("div");
  gift.classList.add("item");

  const img = document.createElement("img");
  img.src = get_img(c,n,1);
  gift.appendChild(img);

  img.onerror = () => {
    img.remove();
    const q = document.createElement("div");
    q.classList.add("q");
    q.innerText = "?";
    gift.appendChild(q);
  };

  const id = document.createElement("div");
  id.classList.add("id");
  id.innerText = "#"+n;
  gift.appendChild(id);

  if (p) {
    const price = document.createElement("div");
    price.classList.add("price");
    price.innerText = p;
    gift.appendChild(price);
  }

  list.appendChild(gift);
}
  
const load_gifts = async () => {
  list.innerHTML = `<div style="padding:8px;">Loading...</div>`;
  page = Math.max(page,0);
  pagei.value = page+1;

  const encode = (arr) => arr.map(encodeURIComponent).join(",");
  history.replaceState({},null,`../tools/tonnel-market/?p=${page}&s=${sort.value}` +
    (collections.length ? `&collections=${encode(collections)}` : "") +
    (models.length ? `&models=${encode(models)}` : "") +
    (backdrops.length ? `&backdrops=${encode(backdrops)}` : "") +
    (symbols.length ? `&symbols=${encode(symbols)}` : "")
  );

  const data = await tonnel_search(page+1,limit,sort.value,"TON",{
    name: collections,
    model: models,
    backdrop: backdrops,
    symbols: symbols
  });
  list.innerHTML = "";
  for (g of data) {
    const p = g.price+" "+g.asset;
    //const p = Math.ceil(g.price*ton*usd/1000).toLocaleString("en-US")+"K IRT";
    add_gift(fix_name(g.name),g.gift_num,p);
  }
  if (data.length==0) list.innerHTML = `<div style="padding:8px;">No Gifts Found</div>`;
}

pagei.onkeydown = e => {
  if (e.key=="Enter"){
    let n = +pagei.value;
    if(n>0&&Number.isInteger(n)) {
      page = n-1;
      load_gifts();
    }
  }
};

const url_string = window.location.href;
const url = new URL(url_string);
const limit = 24;

let page = Math.max(parseInt(url.searchParams.get("p"))||0,0);
sort.value = url.searchParams.get("s")||"d";
const parse = (key) => {
  const val = url.searchParams.get(key);
  return val?val.split(",").map(decodeURIComponent):[];
}
let collections = parse("collections");
let models = parse("models");
let backdrops = parse("backdrops");
let symbols = parse("symbols");

collectionst.onclick = () => {
  collectionsd.style.display = collectionsd.style.display=="flex"?"none":"flex";
  modelsd.style.display = "none";
}

modelst.onclick = () => {
  modelsd.style.display = modelsd.style.display=="flex"?"none":"flex";
  collectionsd.style.display = "none";
}

const gift_elements = {};

gifts.forEach(gift => {
  const div = document.createElement("div");
  div.innerHTML = `<img src="https://fragment.com/file/gifts/${fix_name(gift)}/thumb.webp">${gift}`;
  div.onclick = () => {
    if (collections.includes(gift)) {
      collections = collections.filter(g=>g!=gift);
      remove_models_of_gift(gift);
    } else {
      collections.push(gift);
    }
    update_collections(collectionss.value);
    update_models(modelss.value);
  };
  gift_elements[gift] = div;
  collectionsl.appendChild(div);
});

const remove_models_of_gift = (gift) => {
  if (!gift_models) return;
  const gm = gift_models.find(g => g._id == gift);
  if (!gm) return;
  gm.models.forEach(m => {
    const i = models.indexOf(m);
    if (i > -1) models.splice(i,1);
  });
}

const update_collections = (filter = "") => {
  const filtered = gifts.filter(g => g.toLowerCase().includes(filter.toLowerCase()));
  gifts.forEach(gift => {
    const div = gift_elements[gift];
    if (filtered.includes(gift)) {
      div.style.display = "block";
    } else {
      div.style.display = "none";
    }
    div.className = collections.includes(gift)?"active":"";
  });
}

const update_models = (filter = "") => {
  modelsl.innerHTML = "";
  if (collections.length == 0) {
    models.length = 0;
    const div = document.createElement("div");
    div.innerText = "No Models Found";
    modelsl.appendChild(div);
    return;
  }
  let all = [];
  collections.forEach(gift => {
    const gm = gift_models.find(g => g._id == gift);
    if (gm) all = all.concat(gm.models.slice(0, -1).map(m => ({gift,model:m})));
  });
  const filtered = all.filter(({model}) => model.toLowerCase().includes(filter.toLowerCase()));
  if (filtered.length == 0) {
    const div = document.createElement("div");
    div.innerText = "no models found";
    modelsl.appendChild(div);
    return;
  }
  filtered.sort((a,b) => {
    const ain = models.includes(a.model)?-1:1;
    const bin = models.includes(b.model)?-1:1;
    return ain - bin;
  }).forEach(({gift, model}) => {
    const div = document.createElement("div");
    div.innerText = gift + " - " + model;
    div.className = models.includes(model)?"active":"";
    div.onclick = () => {
      if (models.includes(model)) {
        models = models.filter(m=>m!=model);
      } else {
        models.push(model);
      }
      update_models(filter);
    };
    modelsl.appendChild(div);
  });
}

collectionss.oninput = () => {
  update_collections(collectionss.value);
  update_models(modelss.value);
}

modelss.oninput = () => {
  update_models(modelss.value);
}

window.onload = async () => {
  window.gift_models = await(await fetch("./json/gift-models.json")).json();
  update_collections();
  update_models();
  load_gifts();
}

</script>
