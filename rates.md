---
layout: default
title: "Rates"
description: ""
image: "rates.png"
---

<style>

@font-face {
  font-family: "sfr";
  src: url("./fonts/SFRounded/SFRounded-Semibold.ttf");
}

#list * {
  font-family: "sfr";
}

#list {
  display: grid;
  width: auto;
  height: max-content;
  grid-template-columns: repeat(1,1fr);
  margin: 0 15px 15px 0;
  user-select: none;
  --fw: min(calc(100vw - 56px),980px)
}

@media screen and (width > 100px) {
  #list {
    grid-template-columns: repeat(1,1fr);
    --font: var(--fw);
  }
}
@media screen and (width > 350px) {
  #list {
    grid-template-columns: repeat(2,1fr);
    --font: calc(var(--fw)/2);
  }
}
@media screen and (width > 700px) {
  #list {
    grid-template-columns: repeat(3,1fr);
    --font: calc(var(--fw)/3);
  }
}
@media screen and (width > 900px) {
  #list {
    grid-template-columns: repeat(4,1fr);
    --font: calc(var(--fw)/4);
  }
}

#list .item {
  height: min-content;
  margin: 15px 0 0 15px;
}

#list .item .content {
  overflow: hidden;
  background-color: var(--md-sys-color-surface);
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10%;
  outline: 2px solid var(--md-sys-color-outline-variant);
}

#list .item .content .info {
  position: absolute;
  width: 100%;
  height: 30%;
  display: flex;
  padding: 5%;
  z-index: 2;
}

#list .item .content .info .names {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: auto;
  padding-right: 5%;
  text-align: right;
}

#list .item .content .info .names .name {
  font-size: calc(var(--font)/100*8);
  font-weight: 500;
}

#list .item .content .info .names .slug {
  font-size: calc(var(--font)/100*6);
  font-weight: 500;
  color: var(--md-sys-color-outline);
}

#list .item .content .info .image {
  height: 100%;
  aspect-ratio: 1;
  padding: 2%;
}

#list .item .content .info .image img {
  width: 100%;
  height: 100%;
}

#list .item .content .info .image div {
  background-color: #fc0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

#list .item .content .price {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8.5% 10%;
  font-size: calc(var(--font)/100*12);
  font-weight: 600;
  z-index: 3;
}

#list .item .content .change {
  color: var(--md-sys-color-outline);
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 25% 10%;
  font-size: calc(var(--font)/100*7);
  font-weight: 600;
  z-index: 3;
}

#list .item .content .change.green {
  color: #16C784;
}
#list .item .content .change.red {
  color: #EA3943;
}

#list .item .content:has(.chart) .price, #list .item .content:has(.chart) .change {
  -webkit-text-stroke: calc(var(--font)/75) var(--md-sys-color-background);
  paint-order: stroke fill;
  /*&:after {
    content: attr(data-text);
    position: absolute;
    bottom: 0;
    left: 0;
    -webkit-text-stroke: calc(var(--font)/75) var(--md-sys-color-background);
    z-index: 2;
    font-weight: 600;
  }*/
}
/*#list .item .content:has(.chart) .price:after {
  font-size: calc(var(--font)/100*12);
  padding: 8.5% 10%;
}
#list .item .content:has(.chart) .change:after {
  font-size: calc(var(--font)/100*7);
  padding: 25% 10%;
}*/

#list .item .content .chart {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}

#list .item .content .chart svg {
  width: 100%;
  height: 100%;
}
  
#list .item .content .limage {
  position: absolute;
  top: 6%;
  left: 6%;
  width: 17.5%;
  height: 17.5%;
  border-radius: 50%;
}

#list .item .content .lname {
  position: absolute;
  top: 6%;
  right: 6%;
  width: 60%;
  height: 9%;
  border-radius: calc(var(--font)/100*5);
}

#list .item .content .lslug {
  position: absolute;
  top: 16%;
  right: 6%;
  width: 30%;
  height: 7%;
  border-radius: calc(var(--font)/100*5);
}

#list .item .content .lprice {
  position: absolute;
  bottom: 10%;
  left: 10%;
  width: 80%;
  height: 15%;
  border-radius: calc(var(--font)/100*5);
}

.limage,.lname,.lslug,.lprice {
  background: linear-gradient(to right,var(--md-sys-color-outline-variant),var(--md-sys-color-surface-container),var(--md-sys-color-outline-variant));
  width: 100%;
  background-size: 400%;
  animation: loading 8s infinite;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
}

@keyframes loading {
  0% { background-position:   0%; }
  100% { background-position: 400%; }
}
  
</style>

<h2><img src="./img/icons/rates-0.png" class="pixelated h2-icon">Rates</h2>

<div id="list"></div>
<div id="update_time" style="display:none;width:100%;padding:20px 0 0 0;text-align:center;color:var(--md-sys-color-outline);"></div>

<script src="./js/storage.js"></script>

<script>

const make_chart = (prices,color,w,h,s=8,p=0,o=0) => {
  const viewBoxWidth = w;
  const viewBoxHeight = h;
  const padding = viewBoxHeight*p;
  const effectiveHeight = viewBoxHeight-2*padding;
  const colors = {
    green: "#16C784",
    red: "#EA3943"
  };
  const hex = colors[color.toLowerCase()]||color;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice-minPrice;
  let linePath = "";
  let areaPath = `M 0 ${viewBoxHeight} `;
  prices.forEach((price,index) => {
    const x = (index/(prices.length-1))*viewBoxWidth;
    const normalized = priceRange==0?0.5:(price-minPrice)/priceRange;
    const y = padding+(1-normalized+o)*effectiveHeight;
    if (index == 0) {
      linePath += `M ${x.toFixed(6)} ${y.toFixed(6)}`;
    } else {
      linePath += ` L ${x.toFixed(6)} ${y.toFixed(6)}`;
    }
    areaPath += `L ${x.toFixed(6)} ${y.toFixed(6)} `;
  });
  areaPath += `L ${viewBoxWidth} ${viewBoxHeight} Z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}">
    <defs>
      <linearGradient id="color${hex}" x1="0%" x2="0%" y1="0%" y2="100%">
        <stop offset="0%" style="stop-color:${hex};stop-opacity:0.4;"></stop>
        <stop offset="100%" style="stop-color:${hex};stop-opacity:0.0;"></stop>
      </linearGradient>
    </defs>
    <g>
      <path stroke="${hex}" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round" fill="none" d="${linePath}"></path>
      <path stroke="none" fill-opacity="0.6" fill="url(#color${hex})" d="${areaPath}"></path>
    </g>
  </svg>`;
}

const extract_chart = (svg,rv=0) => {
  const m = svg.match(/<path[^>]*stroke=["'][^"']+["'][^>]*fill=["']none["'][^>]*d=["']([^"']+)["']/);
  if (m) return [];
  const d = m[1];
  const v = [...d.matchAll(/([ML])\s*([0-9.]+)\s+([0-9.]+)/g)].map(i=>parseFloat(i[3]));
  const min = Math.min(...v);
  const max = Math.max(...v);
  const r = max-min||1;
  return v.map(y=>rv?((y-min)/r):(1-(y-min)/r));
}
const extract_chart2 = (svg,rv=0) => {
  const m = [...svg.matchAll(/<line[^>]*y1=["']([^"']+)["'][^>]*y2=["']([^"']+)["']/g)];
  if (!m.length) return [];
  const v = m.flatMap(i=>[parseFloat(i[1]),parseFloat(i[2])]);
  const min = Math.min(...v);
  const max = Math.max(...v);
  const r = max-min||1;
  return v.map(y=>rv?((y-min)/r):(1-(y-min)/r));
}
const extract_chart3 = (svg,rv=0) => {
  const m = svg.match(/<polyline[^>]*points=["']([^"']+)["'][^>]*>/);
  if (!m) return [];
  const d = m[1];
  const v = [...d.matchAll(/(?:\d+(\.\d+)?),\s*(\d+(\.\d+)?)/g)].map(i=>parseFloat(i[2]));
  const min = Math.min(...v);
  const max = Math.max(...v);
  const r = max-min||1;
  return v.map(y=>rv?((y-min)/r):(1-(y-min)/r));
}

const types = ["gold","currency","cryptocurrency"];

const items = [
  {
    type: 1,
    name: "دلار آمریکا",
    ename: "US Dollar",
    slug: "USD",
    icon: "us"
  },{
    type: 2,
    name: "تتر",
    ename: "Tether",
    slug: "USDT",
    icon: "tether"
  },{
    type: 2,
    name: "بیت کوین",
    ename: "Bitcoin",
    slug: "BTC",
    icon: "btc",
    unit: "usd"
  },{
    type: 2,
    name: "تون کوین",
    ename: "Toncoin",
    slug: "TON",
    icon: "ton",
    unit: "usd"
  },{
    type: 2,
    name: "اتریوم",
    ename: "Ethereum",
    slug: "ETH",
    icon: "eth",
    unit: "usd"
  },{
    type: 2,
    name: "لایت کوین",
    ename: "Litecoin",
    slug: "LTC",
    icon: "ltc",
    unit: "usd"
  },{
    type: 2,
    name: "تانل",
    ename: "Tonnel",
    slug: "TONNEL",
    icon: "tonnel",
    unit: "usd"
  },{
    type: 1,
    name: "یورو",
    ename: "Euro",
    slug: "EUR",
    icon: "eu"
  },{
    type: 1,
    name: "پوند انگلستان",
    ename: "British Pound",
    slug: "GBP",
    icon: "gb"
  },{
    type: 1,
    name: "روبل روسیه",
    ename: "Russian Ruble",
    slug: "RUB",
    icon: "ru"
  },/*{
    type: 1,
    name: "ریال عمان",
    ename: "Omani Rial",
    slug: "OMR",
    icon: "om"
  },{
    type: 1,
    name: "یوان چین",
    ename: "Chinese Yuan",
    slug: "CNY",
    icon: "cn"
  },*/{
    type: 0,
    name: "انس طلا",
    ename: "Gold",
    slug: "XAU",
    icon: "gold",
    unit: "usd"
  },{
    type: 0,
    name: "طلا 18 عیار",
    ename: "18 Karat Gold",
    slug: "18KGOLD",
    icon: "gold"
  },{
    type: 0,
    name: "مثقال طلا",
    ename: "Mithqal",
    slug: "MITHQAL",
    icon: "gold"
  },{
    type: 0,
    name: "سکه بهار آزادی",
    ename: "Azadi",
    slug: "AZADI",
    icon: "gold"
  },{
    type: 0,
    name: "سکه امامی",
    ename: "Emami",
    slug: "EMAMI",
    icon: "gold"
  },{
    type: 0,
    name: "نیم سکه",
    ename: "Half",
    slug: "HALF",
    icon: "gold"
  },{
    type: 0,
    name: "ربع سکه",
    ename: "Quarter",
    slug: "QUARTER",
    icon: "gold"
  },{
    type: 0,
    name: "سکه گرمی",
    ename: "Gram",
    slug: "GRAM",
    icon: "gold"
  }
];

const format_num = (n) => {
  const format = (value,suffix) => {
    //const str = (value).toFixed(2);
    //return (str.endsWith(".00")?parseInt(value):str.replace(/\.?0+$/,""))+suffix;
    return Math.round(value*100)/100+suffix;
  };
  if (n>=1_000_000_000) {
    return format(n/1_000_000_000,"T");
  } else if (n>=1_000_000) {
    return format(n/1_000_000,"M");
  } else {
    return n.toLocaleString("en-US");
  }
};

const format_num1 = (n) => {
  const format = (value,suffix) => {
    //const str = (value).toFixed(2);
    //return (str.endsWith(".00")?parseInt(value):str.replace(/\.?0+$/,""))+suffix;
    return Math.round(value*100)/100+suffix;
  };
  if (n>=1_000_000_000) {
    return format(n/1_000_000_000,"T");
  } else if (n>=1_000_000) {
    return format(n/1_000_000,"M");
  } else if (n>=1_000) {
    return format(n/1_000,"K");
  } else {
    return n.toLocaleString("en-US");
  }
};

const load_items = (data) => {
  if (!data.error) {
    list.innerHTML = "";
    for (let i=0;i<items.length;i++) {
      const item = items[i];
      const info = data["currencies"].find(e=>e.name==item.name);
      if (info) {
        list.innerHTML += `
        <div class="item">
          <div class="content">
            <div class="info">
              <div class="image">${item.type==0?"<div></div>":`<img src="./img/svg/circle/${item.icon+"."+(info.iconf?info.iconf:"svg")}">`}</div>
              <div class="names">
                <div class="name">
                  ${item.ename}
                </div>
                <div class="slug">
                  ${item.slug}
                </div>
              </div>
            </div>
            <div class="price">${(item.unit=="usd"?"$":"")+format_num(info.price)}</div>
            <div class="change ${(parseFloat(info.change_percent)>0?" green\">↑":(parseFloat(info.change_percent)==0?"\">":"red\">↓"))+format_num1(Math.abs(info.change_percent))}</div>
            ${info.chart?`<div class="chart">${info.chart}</div>`:""}
          </div>
        </div>`;
      }
    }
  }
}

const calc_change = (a,b) => {
  return Math.round((b-a)/a*100);
}

const storage = new Storage("nxrix-rates","store");

window.onload = async () => {
  for (let i=0;i<items.length;i++) {
    list.innerHTML += `
      <div class="item">
        <div class="content">
          <div class="limage"></div>
          <div class="lname"></div>
          <div class="lslug"></div>
          <div class="lprice"></div>
        </div>
      </div>`;
  }
  let data = await(await fetch("https://raw.githubusercontent.com/CertMusashi/Chand-api/refs/heads/main/arz.json?t="+Date.now())).json();
  let data1;
  try {
    await storage.init();
    const last_commit = await storage.get("last_commit")||"";
    if (last_commit&&((new Date().getTime()-24*60*60*1000)-last_commit.split(",")[0])<60*11000) {
      const res = await fetch(`https://raw.githubusercontent.com/CertMusashi/Chand-api/${last_commit.split(",")[1]}/arz.json`);
      data1 = await res.json();
    } else {
      const yesterday = new Date(new Date().getTime()-24*60*60*1000);
      const until = new Date(yesterday.getTime()+10*60*1000).toISOString();
      //const res = await fetch(`https://api.github.com/repos/CertMusashi/Chand-api/commits?path=arz.json&until=${until}&per_page=1`);
      const res = await fetch(`https://api.github.com/repositories/930913626/commits?path=arz.json&until=${until}&per_page=1`);
      const commits = await res.json();
      const target = yesterday.getTime();
      for (const commit of commits) {
        await storage.set("last_commit",yesterday.getTime()+","+commit.sha);
        const res = await fetch(`https://raw.githubusercontent.com/CertMusashi/Chand-api/${commit.sha}/arz.json`);
        data1 = await res.json();
      }
    }
  } catch (err) {
  }
  if (data.currencies == null) {
    data = data1;
  }
  update_time.style.display = "block";
  update_time.innerText = data.date;

  for (let i=0;i<data.currencies.length;i++) {
    //data.currencies[i].change_percent = ((data.currencies[i]||data1.currencies[i]).price-(data1.currencies[i]||data.currencies[i]).price);
    if (data.currencies[i]&&data1.currencies[i]) {
      data.currencies[i].change_percent = (data.currencies[i].price-data1.currencies[i].price);
    } else {
      data.currencies[i].change_percent = 0;
    }
  }
  const ton_data = await(await fetch("https://api.diadata.org/v1/assetQuotation/Ton/0x0000000000000000000000000000000000000000")).json();
  const ton_chart = await(await fetch("https://corsproxy.io/?url=https://storage.dyor.io/jettons/10778/chart_dark_w1.svg")).text();
  data.currencies.push({
    code: "ton",
    en: "Toncoin",
    name: "تون کوین",
    price: ton_data.Price,
    change_percent: Math.round((ton_data.Price-ton_data.PriceYesterday)*100)/100,
    chart: make_chart(extract_chart(ton_chart,1),ton_data.Price>ton_data.PriceYesterday?"green":"red",400,400,4,0.2,0.25)
  });

  const tonnel_data = await(await fetch("https://corsproxy.io/?url=https://dyor.io/api/v4/jettons/slug/tonnel/details")).json();
  const tonnel_chart = await(await fetch("https://corsproxy.io/?url=https://storage.dyor.io/jettons/239/chart_dark_w1.svg")).text();
  data.currencies.push({
    code: "tonnel",
    en: "Tonnel",
    name: "تانل",
    iconf: "png",
    price: parseFloat(tonnel_data.cachedJetton.priceUsd),
    change_percent: tonnel_data.cachedJetton.priceUsd*tonnel_data.cachedJetton.priceChange24h/100,
    chart: make_chart(extract_chart(tonnel_chart),tonnel_data.cachedJetton.priceChange24h>0?"green":"red",400,400,4,0.2,0.25)
  });

  const btc_data = data.currencies.find(c=>c.code=="btc");
  const btc_chart = await(await fetch("https://corsproxy.io/?url=https://www.coingecko.com/coins/1/sparkline.svg")).text();
  btc_data.chart = make_chart(extract_chart3(btc_chart),btc_data.change_percent>0?"green":"red",400,400,4,0.2,0.25);
  
  load_items(data);
}

</script>
