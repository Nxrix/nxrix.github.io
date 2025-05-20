---
layout: default
title: "Telegram Gifts Market"
description: "Telegram Gifts Market"
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

.filter {
  display: flex;
  width: 100%;
  height: 32px;
}

.filter div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.filter .button {
  display: none;
  justify-content: center;
  align-items: center;
  height: 100%;
  aspect-ratio: 1;
}

.controls {
  display: flex;
  width: 100%;
  height: 48px;
  padding: 4px;
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
  width: calc(100% - 128px);
  height: 100%;
  text-align: center;
  margin: 0 auto;
}

</style>

## Telegram Gifts Market

<div class="filter">
  <input id="collectionsi" type="text" placeholder="Collection">
  <div id="collectionss" class="suggestion"></div>
  <div id="collectionsb" class="button">Add</div>
</div>
<div id="collectionsl"></div>

<div class="filter">
  <input id="modelsi" type="text" placeholder="Model">
  <div id="modelss" class="suggestion"></div>
  <div id="modelsb" class="button">Add</div>
</div>
<div id="modelsl"></div>

<div class="filter">
  <input id="backdropsi" type="text" placeholder="Backdrop">
  <div id="backdropss" class="suggestion"></div>
  <div id="backdropsb" class="button">Add</div>
</div>
<div id="backdropsl"></div>

<div class="filter">
  <input id="symbolsi" type="text" placeholder="Symbol">
  <div id="symbolss" class="suggestion"></div>
  <div id="symbolsb" class="button">Add</div>
</div>
<div id="symbolsl"></div>

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
  
load_gifts = async () => {
  list.innerHTML = "Loading...";
  page = Math.max(page,0);
  pagei.value = page+1;
  //history.replaceState({},null,`../tools/tg-gifts-market/?p=${page}`);
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
  if (data.length==0) list.innerHTML = "No Gifts Found"
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

let collections = [];
let models = [];
let backdrops = [];
let symbols = [];

const update_collections = () => {
  collectionsl.innerHTML = "";
  collections.forEach((c,i) => {
    const d = document.createElement("div");
    const n = document.createElement("div");
    n.innerText = c;
    const x = document.createElement("div");
    x.innerText = "x";
    x.onclick = () => {
      collections.splice(i,1);
      update_collections();
      load_gifts();
    };
    d.appendChild(n);
    d.appendChild(x);
    collectionsl.appendChild(d);
  });
}

collectionsi.addEventListener("input",() => {
  if (collectionsi.value.trim().length>0) {
    collectionsb.style.display = "flex";
    const s = gifts.filter(g => g.toLowerCase().includes(collectionsi.value.toLowerCase()));
    collectionss.innerText = s[0] || "";
  } else {
    collectionsb.style.display = "none";
  }
});

collectionsb.onclick = () => {
  const s = collectionss.innerText;
  if (s&&!collections.includes(s)) {
    collectionsb.style.display = "none";
    collectionsi.value = "";
    collectionss.innerText = "";
    collections.push(s);
    load_gifts();
  }
};

load_gifts();

</script>
