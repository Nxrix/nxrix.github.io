---
layout: default
title: "TG Gifts"
description: "All Upgraded Telegram Gifts"
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
  background: var(--md-sys-color-background);
  color: var(--md-sys-color-on-surface);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 5%;
  left: 5%;
  width: 40%;
  height: 15%;
  border-radius: calc(var(--font)/100*5);
  font-size: calc(var(--font)/100*6);
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

</style>

## Telegram Gifts
With this tool you can view all upgraded Telegram gifts.

<select id="type">
</select>
<div id="list"></div>

<div class="controls">
  <button onclick="page--;load_gifts()"><</button>
  <input type="text" id="pagei" autocomplete="off">
  <button onclick="page++;load_gifts()">></button>
</div>

<br>
<div>Donate TON to support development</div>
<div style="user-select:all;">UQBEsTMky8JjYU2lF0uyWPrg_XtyPNUzix888KF424wHv-Nx</div>

<script>
const gift_names = `Astral Shard
B-Day Candle
Berry Box
Big Year
Bonded Ring
Bow Tie
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
Gem Signet
Genie Lamp
Ginger Cookie
Hanging Star
Heroic Helmet
Hex Pot
Holiday Drink
Homemade Cake
Hypno Lollipop
Ion Gem
Jack-in-the-Box
Jelly Bunny
Jester Hat
Jingle Bells
Kissed Frog
Light Sword
Lol Pop
Loot Bag
Love Candle
Love Potion
Lunar Snake
Mad Pumpkin
Magic Potion
Mini Oscar
Nail Bracelet
Neko Helmet
Party Sparkler
Perfume Bottle
Pet Snake
Plush Pepe
Precious Peach
Record Player
Restless Jar
Sakura Flower
Santa Hat
Scared Cat
Sharp Tongue
Signet Ring
Skull Flower
Sleigh Bell
Snake Box
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
Witch Hat
Xmas Stocking`;

const gift_names0 = gift_names.replaceAll(" ","").replaceAll("-","").replaceAll("'","").toLowerCase();

const gifts = gift_names.split("\n");
const gifts0 = gift_names0.split("\n");

gifts.forEach(gift => {
  const option = document.createElement("option");
  option.value = gift.replaceAll(" ","").replaceAll("-","").replaceAll("'","").toLowerCase();
  option.textContent = gift.charAt(0).toUpperCase()+gift.slice(1);
  type.appendChild(option);
});

const get_src = (a,b,c=0) => {
  return `https://nft.fragment.com/gift/${a}-${b}.${["small","medium","large"][c]||c}.jpg`
}

const add_gift = (c,n,p) => {
  const gift = document.createElement("div");
  gift.classList.add("item");

  const img = document.createElement("img");
  img.src = get_src(c,n,1);
  gift.appendChild(img);

  img.onerror = () => {
    img.remove();
    const q = document.createElement("div");
    q.classList.add("q");
    q.innerText = "?";
    gift.appendChild(q);
    //gift.remove();
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
  
load_gifts = () => {
  list.innerHTML = "";
  page = Math.max(page,0);
  pagei.value = page+1;
  history.replaceState({},null,`../tools/tg-gifts/?c=${type.value}&p=${page}`);
  for (i=page*limit+1;i<=page*limit+limit;i++) {
    add_gift(type.value,i);
  }
}

type.addEventListener("change",() => {
  load_gifts();
});

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
const limit = 32;
let page = Math.max(parseInt(url.searchParams.get("p"))||0,0);
type.value = "plushpepe";
if (gifts0.includes(url.searchParams.get("c"))) {
  type.value = url.searchParams.get("c");
}
load_gifts();

</script>
