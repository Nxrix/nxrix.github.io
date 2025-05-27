---
layout: default
title: "Tonnel Marketplace"
description: ""
image: ".png"
cid: 0
hidden: true
---

<style>

/*@font-face {
  font-family: "sfr";
  src: url("./fonts/SFRounded/SFRounded-Semibold.ttf");
}

#list * {
  font-family: "sfr";
}*/

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
  text-decoration: none;
  /*outline: 1px solid var(--md-sys-color-outline-variant);*/
}
#list .item.bundle {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  aspect-ratio: 1;
}
#list .item.bundle .image {
  flex: 1 1 calc(100% / var(--cols));
  width: 100%;
  aspect-ratio: 2;
}
#list img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
#list .q {
  color: var(--md-sys-color-outline-variant);
  font-size: calc(var(--font)/100*30);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  aspect-ratio: 1;
  border-radius: calc(var(--font)/100*10);
  box-shadow: inset 0 0 0 2px var(--md-sys-color-outline-variant);
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
  top: 45%;
  right: 0;
  transform-origin: center center;
  transform: rotateZ(45deg) translateY(-525%);
  font-size: calc(var(--font)/100*6);
}
#list .price {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 8%;
  left: 10%;
  font-size: calc(var(--font)/100*8);
  color: #fff;
}
#list .price.stroke {
  -webkit-text-stroke: calc(var(--font)/100*1.5) #000;
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
  width: 100%;
  margin: 0;
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
  margin-bottom: 8px;
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

.filters1 {
  width: 100%;
  max-width: 400px;
  display: grid;
  grid-template-columns: auto auto;
  justify-items: center;
  margin: 0 auto;
  gap: 4px;
  margin-bottom: 8px;
}

.filters2 {
  display:flex;
  justify-content:center;
  align-items:center;
}

.filters3 {
  width: 100%;
  max-width: 400px;
  display: grid;
  grid-template-columns: auto auto;
  justify-items: center;
  margin: 0 auto;
  gap: 4px;
  margin-bottom: 8px;
}

.filters3 .range {
  display: flex;
  gap: 4px;
}

.filters3 select, .filters3 input, .filters3 button {
  width: 100%;
  height: 100%;
}

.filters3 button {
  padding: px;
  margin: 0;
  grid-column: span 2;
}

</style>

### Tonnel Market

<div>Donate TON to support development</div>
<div style="user-select:all;">UQBEsTMky8JjYU2lF0uyWPrg_XtyPNUzix888KF424wHv-Nx</div>
<br>

<div id="loading0" style="display:flex;justify-content:center;align-items:center;aspect-ratio:2;font-size:32px;">
  Loading...
</div>
<div id="loading1" style="display: none;">
  <div id="ton_price"></div>
  <div id="tonnel_price"></div>
  <div id="tonnel_chart"></div>
  <br>
  <div class="filters1">
    <button id="collectionst" class="filteri" style="border-radius: 11px 4px 2px 4px;">Collection</button>
    <button id="modelst" class="filteri" style="border-radius: 4px 11px 4px 2px;">Model</button>
    <button id="backdropst" class="filteri" style="border-radius: 4px 2px 4px 11px;">Backdrop</button>
    <button id="symbolst" class="filteri" style="border-radius: 2px 4px 11px 4px;">Symbol</button>
  </div>
  <div class="filters2">
    <div id="collectionsd" class="filterd">
      <input id="collectionss" class="filters" type="text" autocomplete="off" placeholder="Search...">
      <div id="collectionsl" class="filterl"></div>
    </div>
    <div id="modelsd" class="filterd" style="display:none">
      <input id="modelss" class="filters" type="text" autocomplete="off" placeholder="Search...">
      <div id="modelsl" class="filterl"></div>
    </div>
    <div id="backdropsd" class="filterd" style="display:none">
      <input id="backdropss" class="filters" type="text" autocomplete="off" placeholder="Search...">
      <div id="backdropsl" class="filterl"></div>
    </div>
    <div id="symbolsd" class="filterd" style="display:none">
      <input id="symbolss" class="filters" type="text" autocomplete="off" placeholder="Search...">
    <div id="symbolsl" class="filterl"></div>
    </div>
  </div>

  <div class="filters3">
    <select id="sort">
      <option value="d">Sort by Latest</option>
      <option value="p0">Sort by Price low to high</option>
      <option value="p1">Sort by Price high to low</option>
      <option value="i">Sort by ID 1,2,3</option>
      <option value="j">Sort by ID 3,2,1</option>
      <option value="r">Sort by Rarity</option>
      <option value="m">Sort by Model</option>
      <option value="b">Sort by Backdrop</option>
      <option value="s">Sort by Symbol</option>
    </select>
    <select id="asset">
      <option value="TON">Ton</option>
      <option value="TONNEL">Tonnel</option>
      <option value="USDT">USDT</option>
    </select>
    <select id="format">
      <option value="def">Price by Asset</option>
      <option value="usd">Price in USD</option>
      <option value="irt">Price in IRT</option>
      <option value="rub">Price in RUB</option>
      <option value="eur">Price in EUR</option>
    </select>
    <select id="tag">
      <option value="all">All Gifts</option>
      <option value="telegram">Telegram</option>
      <option value="premarket">Premarket</option>
      <option value="bundle">Bundles</option>
    </select>
    <input id="numbers" type="text" autocomplete="off" placeholder="Gift ID">
    <div class="range">
      <input id="min" type="text" autocomplete="off" placeholder="Min">
      <input id="max" type="text" autocomplete="off" placeholder="Max">
    </div>
    <button id="btn_s">Search</button>
  </div>

  <div class="controls">
    <button id="btn_q1"><</button>
    <input id="pagei1" type="text" autocomplete="off">
    <button id="btn_p1">></button>
  </div>

  <div id="list"></div>

  <div class="controls">
    <button id="btn_q2"><</button>
    <input id="pagei2" type="text" autocomplete="off">
    <button id="btn_p2">></button>
  </div>
  <!--h3>Donations</h3>
  <div id="donations"></div-->
</div>

<script src="./js/telegram-web-app.js?{{site.time|date:'%s%N'}}"></script>
<script>
window.Telegram.WebApp.disableVerticalSwipes();
</script>
<script src="./js/tonnel-market.js?{{site.time|date:'%s%N'}}"></script>
<script>

/*(async () => {
  const crc16 = (data) => {
    let reg = 0;
    const message = new Uint8Array(data.length+2);
    message.set(data);
    for (let byte of message) {
      let mask = 0x80;
      while (mask>0) {
        reg <<= 1;
        if (byte&mask) {
          reg += 1;
        }
        mask >>= 1
        if (reg>0xffff) {
          reg &= 0xffff;
          reg ^= 0x1021;
        }
      }
    }
    return new Uint8Array([Math.floor(reg/256),reg%256]);
  }
  const raw2friendly = (raw,bounceable = true,testnet = false) => {
    try {
      raw = raw.split(":");
      const workchain = raw[0];
      raw = raw[1];
      let bytes = [(bounceable?0x11:0x51)|(testnet?0x80:0),workchain=="-1"?0xFF:parseInt(workchain)];
      for (let i=0;i<32;i++) bytes.push(+("0x"+raw[i*2]+raw[i*2+1]));
      const crc = crc16(bytes.slice(0,34));
      bytes.push(crc[0],crc[1]);
      return btoa(String.fromCodePoint(...bytes)).replace(/\+/g,"-").replace(/\//g,"_");
    } catch (error) {
      throw new Error("Failed to parse address :(");
    }
  }
  const w = "0:44b13324cbc263614da5174bb258fae0fd7b723cd5338b1f3cf0a178db8c07bf";
  const fix_address = (a) => a.substr(2,4)+".."+a.substr(a.length-4);
  const data = await (await fetch(`https://tonapi.io/v2/accounts/${w}/events?limit=32&start_date=1717627010`)).json();
  data.events.forEach(event => {
    const action = event.actions[0];
    const preview = action.simple_preview;
    const sender = action[action.type]?.sender?.address;
    const recipient = action[action.type]?.recipient?.address;
    if (recipient==w && sender!=w && action.type!="NftItemTransfer" && ((action.type=="JettonTransfer" && action.JettonTransfer.jetton.verification=="whitelist") || action[action.type].amount>50000000)) {
      const name = preview.accounts?.[0]?.name || fix_address(raw2friendly(preview.accounts?.[0]?.address,false)) || sender;
      const line = document.createElement("div");
      line.innerHTML = `<a href="https://tonviewer.com/transaction/${action.base_transactions?.[0]}" target="_blank">${name}</a> has donated ${preview.value}`;
      donations.appendChild(line);
    }
  });
})();*/

</script>
