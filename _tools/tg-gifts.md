---
layout: default
title: "Telegram Gifts"
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

@media screen and (width > 100px) {
  #list {
    grid-template-columns: repeat(1,1fr);
    --font: calc(var(--fw)/4*3);
  }
  #list .item .content {
    width: 75%;
  }
}
@media screen and (width > 300px) {
  #list {
    grid-template-columns: repeat(2,1fr);
    --font: calc(var(--fw)/2);
  }
  #list .item .content {
    width: 100%;
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

</style>

<select id="type">
</select>
<div id="list"></div>

<script>

const gifts = `astralshard
bdaycandle
berrybox
bunnymuffin
cookieheart
crystalball
deskcalendar
diamondring
durovscap
eternalcandle
eternalrose
evileye
flyingbroom
genielamp
gingercookie
hangingstar
hexpot
homemadecake
hypnolollipop
iongem
jellybunny
jesterhat
jinglebells
kissedfrog
lolpop
lootbag
lovecandle
lovepotion
lunarsnake
madpumpkin
magicpotion
minioscar
partysparkler
perfumebottle
plushpepe
preciouspeach
recordplayer
sakuraflower
santahat
scaredcat
sharptongue
signetring
skullflower
sleighbell
snowmittens
spicedwine
spyagaric
starnotepad
swisswatch
tophat
toybear
trappedheart
vintagecigar
voodoodoll
witchhat`.split("\n");

gifts.forEach(gift => {
  const option = document.createElement("option");
  option.value = gift;
  option.textContent = gift.charAt(0).toUpperCase()+gift.slice(1);
  type.appendChild(option);
});

const get_src = (a,b,c=0) => {
  return `https://nft.fragment.com/gift/${a}-${b}.${["small","medium","large"][c]||c}.jpg`
}

load_gifts = (a=1,b=32) => {
  list.innerHTML = "";
  for (i=a;i<=b;i++) {
    const gift = document.createElement("div");
    gift.classList.add("item");

    const img = document.createElement("img");
    img.src = get_src(type.value,i,2);
    gift.appendChild(img);

    const id = document.createElement("div");
    id.classList.add("id");
    id.innerText = "#"+i;
    gift.appendChild(id);

    list.appendChild(gift);
  }
}

type.addEventListener("change",() => {
  //const a = parseInt(from.value);
  //const b = a+parseInt(limit.value);
  load_gifts();
});
load_gifts();
</script>
