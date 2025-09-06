const gift_names = window.gift_models.map(i=>i._id).slice(0,-1).join("\n");

const backdrop_pattern = `<svg width="100%" height="100%" viewBox="0 0 416 416" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <filter id="{{n}}-f">
      <feFlood flood-color="{{p}}"></feFlood>
      <feComposite in2="SourceGraphic" operator="in"></feComposite>
    </filter>
    <image id="{{n}}-p" x="-50" y="-50" width="100" height="100" xlink:href="{{s}}"></image>
    <g id="{{n}}-fp">
      <g opacity="0.10" transform="translate(106.08,29.12) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.10" transform="translate(309.92,29.12) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.10" transform="translate(-2.08,166.4) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.10" transform="translate(418.08,166.4) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.10" transform="translate(208,395.2) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.15" transform="translate(208,37.44) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.15" transform="translate(38.688,97.76) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.15" transform="translate(377.728,97.76) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.15" transform="translate(26.208,270.4) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.15" transform="translate(389.376,270.4) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.15" transform="translate(53.248,358.592) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.15" transform="translate(144.768,358.592) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.15" transform="translate(271.232,358.592) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.15" transform="translate(361.92,358.592) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.24" transform="translate(141.44,81.12) scale(0.416)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.24" transform="translate(272.48,81.12) scale(0.416)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.24" transform="translate(92.352,133.12) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.24" transform="translate(323.648,133.12) scale(0.3328)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.24" transform="translate(68.64,201.76) scale(0.4576)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.24" transform="translate(346.528,201.76) scale(0.4576)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.24" transform="translate(99.84,301.6) scale(0.3744)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.24" transform="translate(314.08,301.6) scale(0.3744)"><use xlink:href="#{{n}}-p"></use></g>
      <g opacity="0.24" transform="translate(208,320.32) scale(0.3744)"><use xlink:href="#{{n}}-p"></use></g>
    </g>
  </defs>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><use xlink:href="#{{n}}-fp" filter="url(#{{n}}-f)"></use></g>
</svg>`;

const tag_svg = `<svg style="position:absolute;top:0;right:0;width:40%;height:40%;" width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="bgblur_clip">
      <path d="M21.4214 0C21.9518 0 22.4605 0.210714 22.8356 0.585786L51.4433 29.1935C51.8184 29.5686 52.0291 30.0773 52.0291 30.6077V49.0759C52.0291 50.8577 49.8748 51.75 48.6149 50.4901L1.53901 3.41422C0.279085 2.15429 1.17142 0 2.95323 0H21.4214Z"></path>
    </clipPath>
  </defs>
  <path d="M21.4214 0C21.9518 0 22.4605 0.210714 22.8356 0.585786L51.4433 29.1935C51.8184 29.5686 52.0291 30.0773 52.0291 30.6077V49.0759C52.0291 50.8577 49.8748 51.75 48.6149 50.4901L1.53901 3.41422C0.279085 2.15429 1.17142 0 2.95323 0H21.4214Z" fill="{{tag_background}}"></path>
  <text x="26" y="26" text-anchor="middle" dominant-baseline="middle" transform="rotate(45 34 26)" fill="{{tag_color}}" font-size="9" font-weight="700" font-family="Inter">#{{tag_number}}</text>
</svg>`;

const fix_name2 = (n) => n.replace(/[^a-zA-Z0-9]/g, "");
const fix_name = (n) => fix_name2(n).toLowerCase();

const gift_names0 = fix_name(gift_names);

const gifts = gift_names.split("\n").sort();
const gifts0 = gift_names0.split("\n").sort();

const i2h = (n) => "#"+n.toString(16).padStart(6,"0");

const get_img = (a,b,c=1) => {
  //return `https://nft.fragment.com/gift/${a}-${b}${[".small",".medium",".large",""][c]}${c<3?".jpg":".webp"}`
  return `https://cdn.swap.coffee/frg/${a}-${b}${[".small",".medium",".large",""][c]}${c<3?".jpg":".webp"}`
}

const parse_nums = (str) => {
  if (!str) return null;
  str = str.replaceAll(" ","");
  const nums = [];
  const parts = str.split(",");
  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      nums.push(Number(part));
    } else if (/^\d+-\d+$/.test(part)) {
      let [start, end] = part.split("-").map(Number);
      if (start>end) {
        let temp = start;
        start = end;
        end = temp;
      }
      if (end-start>=2000) return null;
      for (let i = start; i <= end; i++) nums.push(i);
    } else {
      return null;
    }
  }
  return nums;
}

const thermos_search = async ({
  page = 1,
  per_page = 8,
  collections,
  models,
  backdrops,
  symbols,
  number,
  min = 0,
  max = 100000,
  ordering = "PRICE_ASC",
  markets = ["MRKT", "TONNEL", "PORTALS", "GETGEMS"]
} = {}) => {
  return await (
    await fetch("https://proxy.thermos.gifts/api/v1/gifts", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        page,
        per_page,
        collections,
        models,
        backdrops,
        symbols,
        number,
        ordering,
        markets,
        price_range: {
          min: Math.round(min * 1e9).toString(),
          max: Math.round(max * 1e9).toString()
        }
      })
    })
  ).json();
};

const tonnel_search = async ({page=1,sort="d",asset="TON",name,model,backdrop,symbol,tag,pmin,pmax}) => {
  if (tag=="gifts") {
    const ordering = {
      d: { created_at: 1 },
      o: { created_at: -1 },
      p0: { price: 1 },
      p1: { price: -1 },
      i: { num: 1 },
      j: { num: -1 }
    }[sort];
    const tr = s => s.replace(/^(.*?)\s*\(([\d.]+)%\)$/,(_,n,p)=>`${n.trim()}_${Math.round(p*10)}`);
    return (await(await fetch("https://nfttelegram.io/api/search",{
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        skip: (page-1)*36,
        limit: 36,
        sort: ordering,
        filter: {
          titles: name,
          models: model.map(i=>i.split(" (")[0].replaceAll("'","’")),
          colors: backdrop.map(i=>tr(i)),
          icons: symbol.map(i=>tr(i)),
        }
      })
    })).json()).gifts.map(i=>{
      return {
        price: i.price,
        gift_num: i.num,
        name: i.title,
        model: i.model.replaceAll("’","'"),
        backdrop: i.backdrop.name.split("_")[0],
        symbol: i.symbol.name.split("_")[0],
        asset: "TON",
        market: " ",
        gift_id: 1,
        owner_photo: i.ownerPhoto
      }
    });
  }
  if (tag.split("-")[0]=="thermos") {
    const ordering = {
      d: "PRICE_ASC",
      p0: "PRICE_ASC",
      p1: "PRICE_DESC",
      i: "NUMBER_ASC",
      j: "NUMBER_DESC",
      r0: "RARITY_SCORE_ASC",
      r: "RARITY_SCORE_DESC",
      m0: "MODEL_RARITY_ASC",
      m: "MODEL_RARITY_DESC",
      b0: "BACKDROP_RARITY_ASC",
      b: "BACKDROP_RARITY_DESC",
      s0: "SYMBOL_RARITY_ASC",
      s: "SYMBOL_RARITY_DESC"
    }[sort];
    return (await thermos_search({
      page,
      ordering,
      per_page: 20,
      collections: name,
      models: model.map(i=>i.split(" (")[0]),
      backdrops: backdrop.map(i=>i.split(" (")[0]),
      symbols: symbol.map(i=>i.split(" (")[0]),
      number: parseInt(numbers.value),
      min: pmin||0,
      max: pmax||100000,
      ...(tag.split("-")[1]&&{ markets: [tag.split("-")[1].toUpperCase()] })
    })).items.map(i=>{
      return {
        price: Math.round(parseFloat(i.price)/1e8)/10,
        gift_num: i.number,
        name: i.collection,
        backdrop: i.backdrop.name,
        symbol: i.symbol.name,
        market: i.marketplace,
        asset: "TON",
        gift_id: 1
      }
    });
  } else {
    const s0 = {
      d: { message_post_time: -1 , gift_id: -1 },
      o: { message_post_time: 1 , gift_id: -1 },
      p0: { price:  1 , gift_id: -1 },
      p1: { price: -1 , gift_id: -1 },
      i: { gift_num:  1 , gift_id: -1 },
      j: { gift_num: -1 , gift_id: -1 },
      r: { rarity: -1 , gift_id: -1 },
      m: { modelRarity: 1 , gift_id: -1 },
      b: { backdropRarity: 1 , gift_id: -1 },
      s: { symbolRarity: 1 , gift_id: -1 }
    };
    const s1 = {
      d: { auctionStartTime: -1, gift_id: -1 },
      o: { auctionEndTime: 1, gift_id: -1 },
      p0: { "bidHistory.amount":  1 , gift_id: -1 },
      p1: { "bidHistory.amount": -1 , gift_id: -1 },
    }
    return await(await fetch("https://gifts3.tonnel.network/api/pageGifts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        page,
        limit: 24,
        sort: JSON.stringify((tag=="auctions"?s1:s0)[sort]),
        filter: JSON.stringify({
          ...(tag!="auctions" && { price: { $exists: true }}),
          ...(tag!="auctions" && { buyer: { $exists: false }}),
          ...(tag=="nopremarket" && { export_at: { $exists: true } }),
          ...(tag=="telegram" && { telegramMarketplace: true , export_at: { $exists: false } }),
          ...(tag=="premarket" && { premarket: true }),
          ...(tag=="mintable" && { export_at: { $lt: new Date().toISOString() } }),
          ...(tag=="bundle" && { gift_id: { $lt: 0 } }),
          ...(tag=="auctions" && { auction_id:{ $exists: true}, status: "active" }),
          ...(() => {
            return parse_nums(numbers.value)?{ gift_num: parse_nums(numbers.value) }:{}
          })(),
          //export_at: { $exists: true },
          //refunded: { $ne: true },
          ...( name?.length>1 && { gift_name: name }),
          ...( name?.length==1 && { gift_name: name[0] }),
          ...( model?.length && { model: { $in: model } }),
          ...( name?.length
            ?{
              ...(backdrop?.length && { backdrop: { $in: backdrop } }),
              ...(symbol?.length && { symbol: { $in: symbol } })
            }
            :{
              ...(backdrop?.length && { backdrop: { $regex: "^"+backdrop.join("|")+" \\(" } }),
              ...(symbol?.length && { symbol: { $regex: "^"+symbol.join("|")+" \\(" } })
            }
          ),
          asset
        }),
        ref: 0,
        price_range: [pmin||0,pmax||1000000],
        user_auth: ""
      })
    })).json();
  }
}

const i2b64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    return null;
  }
};

const load_patterns = async (img, { slug, symbol, patternColor }) => {
  let pattern;
  if (gift_patterns[symbol]) {
    pattern = gift_patterns[symbol];
  } else {
    pattern = await i2b64(`https://raw.githubusercontent.com/Nxrix/telegram-gifts/refs/heads/main/data/symbols/webp/128/${fix_name(symbol)}.webp`)
    gift_patterns[symbol] = pattern;
  }
  const svg = backdrop_pattern
    .replaceAll("{{n}}", slug)
    .replaceAll("{{s}}",pattern)
    .replaceAll("{{p}}", i2h(patternColor));
  img.src =
    "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
};

const start_counter = (e,t) => {
  const endTime = new Date(t).getTime();
  if (!e) return;
  const interval = setInterval(() => {
    if (!document.body.contains(e)) {
      clearInterval(interval);
      return;
    }
    const now = new Date().getTime();
    const distance = endTime - now;
    if (distance <= 0) {
      e.textContent = "0 : 00 : 00 : 00";
      clearInterval(interval);
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const formatNumber = (num) => num.toString().padStart(2,"0");
    e.textContent = `${days} : ${formatNumber(hours)} : ${formatNumber(minutes)} : ${formatNumber(seconds)}`;
  },1000);
}

const add_gift = (c,n,p,i,m,g) => {
  const gift = document.createElement("a");
  gift.classList.add("item");
  if (g.market) {
    gift.href = "https://t.me/nft/"+fix_name2(g.name)+"-"+n;
  } else {
    gift.href = "tg://resolve?domain=tonnel_network_bot&appname=gift&startapp=ref_5829347783_"+i;
  }

  const b = gift_backdrops.find(i=>i.backdrop?.replace(/\s*\(\d+(\.\d+)?%\)/,"")==g.backdrop.split(" (")[0]).color;

  const img = document.createElement("img");
  img.src = get_img(c,n);
  img.style.background = `radial-gradient(circle,${i2h(b.centerColor)} 1%,${i2h(b.edgeColor)} 80%)`;
  gift.appendChild(img);
  
  const fix_gift = () => {
    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4AWJiYGBgAAAAAP//XRcpzQAAAAZJREFUAwAADwADJDd96QAAAABJRU5ErkJggg==";
    const mi = document.createElement("img");
    mi.classList.add("model");
    mi.src = `https://gifts.coffin.meme/${g.name.toLowerCase()}/${g.model.split(" (")[0]}.png`;
    gift.insertBefore(mi, gift.firstChild);
    load_patterns(img, {
      slug: fix_name2(g.name)+"-"+n,
      symbol: g.symbol.split(" (")[0],
      patternColor: b.patternColor
    });
  };

  if (g.premarket) fix_gift();
  img.onerror = fix_gift;

  gift.insertAdjacentHTML("beforeend", tag_svg
    .replaceAll("{{tag_number}}", n)
    .replaceAll("{{tag_background}}",i2h(b.edgeColor))
    .replaceAll("{{tag_color}}",i2h(b.textColor))
  );

  const tg = (!g.premarket)&&(!g.export_at)&&(!g.market);
  if (g.premarket||m||tg||g.auction) {
    const icons = document.createElement("div");
    icons.classList.add("icons");
    if (g.premarket) {
      icons.insertAdjacentHTML("beforeend",`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"/></svg>`);
    }
    if (m) {
      icons.insertAdjacentHTML("beforeend",`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-80 120-436l200-244h320l200 244L480-80ZM183-680l-85-85 57-56 85 85-57 56Zm257-80v-120h80v120h-80Zm335 80-57-57 85-85 57 57-85 85ZM480-192l210-208H270l210 208ZM358-600l-99 120h442l-99-120H358Z"/></svg>`);
    }
    if (tg) {
      icons.insertAdjacentHTML("beforeend",`<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 16 16" fill="currentColor"><path d="M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/></svg>`);
    }
    if (g.auction) {
      icons.insertAdjacentHTML("beforeend",`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M160-120v-80h480v80H160Zm226-194L160-540l84-86 228 226-86 86Zm254-254L414-796l86-84 226 226-86 86Zm184 408L302-682l56-56 522 522-56 56Z"/></svg>`);
    }
    icons.style.background = i2h(b.edgeColor);
    icons.style.color = i2h(b.textColor);
    gift.appendChild(icons);
  }

  if (g.market.trim()) {
    const market = document.createElement("div");
    market.classList.add("market");
    market.innerText = g.market.charAt(0)+g.market.slice(1).toLowerCase();
    market.style.background = i2h(b.edgeColor);
    market.style.color = i2h(b.textColor);
    gift.appendChild(market);
  }

  if (g.auction) {
    const market = document.createElement("div");
    market.classList.add("market");
    market.style.background = i2h(b.edgeColor);
    market.style.color = i2h(b.textColor);
    start_counter(market,g.auction.auctionEndTime);
    gift.appendChild(market);
  }

  if (p) {
    const price = document.createElement("div");
    price.classList.add("price");
    price.style.background = i2h(b.edgeColor);
    price.style.color = i2h(b.textColor);
    price.innerText = p;
    gift.appendChild(price);
  }

  if (g.auction) {
    const price = document.createElement("div");
    price.classList.add("price");
    price.style.background = i2h(b.edgeColor);
    price.style.color = i2h(b.textColor);
    price.innerText = Math.round(((g.auction.bidHistory?.[g.auction?.bidHistory.length-1]?.amount)||g.auction.startingBid)*10)/10+" TON";
    gift.appendChild(price);
  }

  if (g.owner_photo) {
    if (g.owner_photo.split("https://nfttelegram.io/static/users/jpeg/")[1]!=".jpeg") {
      const owner = document.createElement("img");
      owner.classList.add("owner");
      owner.style.background = i2h(b.edgeColor);
      owner.style.color = i2h(b.textColor);
      owner.src = g.owner_photo;
      owner.onerror = () => owner.remove();
      gift.appendChild(owner);
    }
  }

  gifts_list.appendChild(gift);
}

const add_bundle = (b,p,i) => {
  const gift = document.createElement("a");
  gift.classList.add("item", "bundle");
  gift.href = "tg://resolve?domain=tonnel_network_bot&appname=gift&startapp=ref_5829347783_"+i;
  //gift.style.boxShadow = a?"0 0 0 1px var(--md-sys-color-background), 0 0 0 3px 0 0 0 3px #fb0":"";

  const t = b.bundleData.length;
  const c = Math.ceil(Math.sqrt(t));

  gift.style.setProperty("--cols",c);

  for (const g of b.bundleData) {
    const item = document.createElement("div");
    item.classList.add("image");

    const img = document.createElement("img");
    img.src = get_img(fix_name(g.gift_name),g.gift_num);
    item.appendChild(img);

    img.onerror = () => {
      img.remove();
      const q = document.createElement("div");
      q.classList.add("q");
      q.innerText = "?";
      item.appendChild(q);
    };

    gift.appendChild(item);
  }

  const bd = gift_backdrops.find(i=>i.backdrop?.replace(/\s*\(\d+(\.\d+)?%\)/,"")==b.bundleData[0].backdrop.split(" (")[0]).color;

  const icons = document.createElement("div");
  icons.classList.add("icons");
  icons.style.background = i2h(bd.edgeColor);
  icons.style.color = i2h(bd.textColor);
  icons.insertAdjacentHTML("beforeend",`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-80 92L160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11Zm200-528 77-44-237-137-78 45 238 136Zm-160 93 78-45-237-137-78 45 237 137Z"/></svg>`);
  gift.appendChild(icons);

  if (g.auction) {
    icons.insertAdjacentHTML("beforeend",`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M160-120v-80h480v80H160Zm226-194L160-540l84-86 228 226-86 86Zm254-254L414-796l86-84 226 226-86 86Zm184 408L302-682l56-56 522 522-56 56Z"/></svg>`);
    const market = document.createElement("div");
    market.classList.add("market");
    market.style.background = i2h(bd.edgeColor);
    market.style.color = i2h(bd.textColor);
    start_counter(market,g.auction.auctionEndTime);
    gift.appendChild(market);
  }

  if (p) {
    const price = document.createElement("div");
    price.classList.add("price");
    price.style.background = i2h(bd.edgeColor);
    price.style.color = i2h(bd.textColor);
    price.innerText = p;
    gift.appendChild(price);
  }

  if (g.auction) {
    const price = document.createElement("div");
    price.classList.add("price");
    price.style.background = i2h(bd.edgeColor);
    price.style.color = i2h(bd.textColor);
    price.innerText = Math.round(((g.auction.bidHistory?.[g.auction?.bidHistory.length-1]?.amount)||g.auction.startingBid)*10)/10+" TON";
    gift.appendChild(price);
  }

  gifts_list.appendChild(gift);
}

const load_gifts = async () => {
  gifts_list.innerHTML = `<div style="padding:16px;">Loading...</div>`;
  page = Math.max(page,0);
  pagei.value = page+1;

  update_url();
  //apply_effect();
  
  /*for (let i=0;i<24;i++) {
    const gift = document.createElement("a");
    gift.classList.add("item");
    gift.style.boxShadow = "inset 0 0 0 1px var(--md-sys-color-outline-variant)";
    const q = document.createElement("div");
    q.classList.add("q");
    q.innerText = "?";
    gift.appendChild(q);
    gifts_list.appendChild(gift);
  }*/

  const pfix = window.prices?window.prices[format.value][asset.value]:1;//*(asset.value=="TONNEL"?1.06:1.06);
  try {
    const data = await tonnel_search({
      page: page+1,
      sort: sort.value,
      asset: asset.value,

      tag: tag.value,
      pmin: parseFloat(min.value.trim())/pfix,
      pmax: parseFloat(max.value.trim())/pfix,

      name: collections,
      model: models,
      backdrop: get_backdrops(backdrops),
      symbol: get_symbols(symbols),
    });

    gifts_list.innerHTML = "";

    for (g of data) {
      const f = prices[format.value];
      //({"TONNEL":1.06,"MRKT":1.045,"PORTALS":1.05}[g.market])
      const a = g.market?1:(g.asset=="TONNEL"?1.06:1.06);
      const p = g.price?f.n.replace("p",(Math.ceil(g.price*a*f[g.asset]*f.d)/f.d).toLocaleString("en-US")).replace("asset",g.asset):"";
      if (g.gift_id>0) {
        const m = (Date.now()-new Date(g.export_at).getTime())>0;
        add_gift(fix_name(g.name),g.gift_num,p,g.gift_id,m,g);
      } else {
        const b = await(await fetch("https://gifts3.tonnel.network/api/giftData/"+g.gift_id)).json();
        add_bundle(b,p,g.gift_id);
      }
    }

    if (data.length==0) gifts_list.innerHTML = `<div style="padding:16px;">No Gifts Found. Check the filters</div>`;
  } catch (e) {
    gifts_list.innerHTML = `<div style="width:100%;padding:16px;">Error: ${e.stack}</div>`;
  }
  //apply_effect();
}

/*const apply_effect = () => {
  const items = gifts_list.querySelectorAll(".item");
  const h = window.innerHeight-64;
  const t = h * 0.42 * (window.innerHeight/h);
  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top+rect.height/2;
    const dc = itemCenter-h/2-64;
    item.style.transform = "none";
    item.style.transformOrigin = "center";
    //item.style.filter = "saturate("+(100-Math.abs(dc))+")";
    if (Math.abs(dc) > t) {
      const angle = Math.min((Math.abs(dc)-t)/t,0.7)*90*(dc>0?-1:1);
      item.style.transform = `rotateX(${angle}deg)`;
      item.style.transformOrigin = dc<0?"bottom center":"top center";
    }
  });
}*/

//document.querySelector(".body .content.page").addEventListener("scroll",apply_effect);
//window.addEventListener("resize",apply_effect);

const url = new URL(window.location.href);

const loadParam = (key, fallback) => {
  let val = url.searchParams.get(key);
  if (val !== null) return val;
  val = localStorage.getItem(key);
  return val !== null ? val : fallback;
};

const loadInt = (key, fallback) => {
  let val = url.searchParams.get(key);
  if (val !== null) return parseInt(val) || fallback;
  val = localStorage.getItem(key);
  return val !== null ? parseInt(val) || fallback : fallback;
};

const loadFloat = (key, fallback) => {
  let val = url.searchParams.get(key);
  if (val !== null) return parseFloat(val) || fallback;
  val = localStorage.getItem(key);
  return val !== null ? parseFloat(val) || fallback : fallback;
};

let page = Math.max(loadInt("p", 0), 0);
sort.value = loadParam("s", "d");
asset.value = loadParam("a", "TON");
format.value = loadParam("f", "def");
tag.value = loadParam("t", "all");
numbers.value = loadParam("n", "");
min.value = loadFloat("min", "") || "";
max.value = loadFloat("max", "") || "";

const parse = (key) => {
  let val = url.searchParams.get(key) || localStorage.getItem(key);
  return val ? val.split(",") : [];
};

let collections = parse("collections");
let models = parse("models");
let backdrops = parse("backdrops");
let symbols = parse("symbols");

const update_url = () => {
  const set_text = (e, l, a) => {
    if (!e) return;
    e.textContent = a.length ? `${l} (${a.length})` : l;
  };
  set_text(collectionst, "Collections", collections);
  set_text(modelst, "Models", models);
  set_text(backdropst, "Backdrops", backdrops);
  set_text(symbolst, "Symbols", symbols);

  const encode = (arr) => arr.map(encodeURIComponent).join(",");

  const qs = `${location.pathname}?p=${page}&s=${sort.value}&a=${asset.value}&f=${format.value}`
    + (tag.value != "all" ? "&t=" + tag.value : "")
    + (numbers.value ? "&n=" + numbers.value : "")
    + (!isNaN(parseFloat(min.value)) ? "&min=" + parseFloat(min.value) : "")
    + (!isNaN(parseFloat(max.value)) ? "&max=" + parseFloat(max.value) : "")
    + (collections.length ? `&collections=${encode(collections)}` : "")
    + (models.length ? `&models=${encode(models)}` : "")
    + (backdrops.length ? `&backdrops=${encode(backdrops)}` : "")
    + (symbols.length ? `&symbols=${encode(symbols)}` : "")
    + location.hash;

  history.replaceState({}, null, qs);

  localStorage.setItem("p", page);
  localStorage.setItem("s", sort.value);
  localStorage.setItem("a", asset.value);
  localStorage.setItem("f", format.value);
  localStorage.setItem("t", tag.value);
  localStorage.setItem("n", numbers.value);
  localStorage.setItem("min", min.value);
  localStorage.setItem("max", max.value);
  localStorage.setItem("collections", collections.join(","));
  localStorage.setItem("models", models.join(","));
  localStorage.setItem("backdrops", backdrops.join(","));
  localStorage.setItem("symbols", symbols.join(","));
};

const get_backdrops = (list) => {
  if (collections.length>0) {
    let matched = [];
    list.forEach(item => {
      collections.forEach(gift => {
        const gm = gift_models.find(g => g._id == gift);
        if (!gm) return;
          gm.backgrounds.forEach(bg => {
          if (bg.replace(/\s*\(\d+(\.\d+)?%\)/,"")==item && !matched.includes(bg)) {
            matched.push(bg);
          }
        });
      });
    });
    return matched;
  } else {
    return list;
  }
}

const get_symbols = (list) => {
  if (collections.length>0) {
    let matched = [];
    list.forEach(item => {
      collections.forEach(gift => {
        const gm = gift_models.find(g => g._id == gift);
        if (!gm) return;
          gm.symbols.forEach(s => {
          if (s.replace(/\s*\(\d+(\.\d+)?%\)/,"")==item && !matched.includes(s)) {
            matched.push(s);
          }
        });
      });
    });
    return matched;
  } else {
    return list;
  }
}

const no_results = document.createElement("div");
no_results.textContent = "No Collections Found";
no_results.style.display = "none";
collectionsl.appendChild(no_results);

const select_all = document.createElement("div");
select_all.style.display = "none";
select_all.classList.add("filterlsa");
collectionsl.parentNode.insertBefore(select_all,collectionsl);

const select_all_models = document.createElement("div");
select_all_models.style.display = "none";
select_all_models.classList.add("filterlsa");
modelsl.parentNode.insertBefore(select_all_models,modelsl);

const select_all_backdrops = document.createElement("div");
select_all_backdrops.style.display = "none";
select_all_backdrops.classList.add("filterlsa");
backdropsl.parentNode.insertBefore(select_all_backdrops,backdropsl);

const select_all_symbols = document.createElement("div");
select_all_symbols.style.display = "none";
select_all_symbols.classList.add("filterlsa");
symbolsl.parentNode.insertBefore(select_all_symbols,symbolsl);

const update_select_all = () => {
  select_all.innerHTML = collections.length == gifts.length?"Deselect All":"Select All";
};
update_select_all();

const update_select_all_models = () => {
  let allModels = [];
  collections.forEach(gift => {
    const gm = gift_models.find(g => g._id == gift);
    if (gm) allModels.push(...gm.models.slice(0, -1));
  });
  const allSelected = allModels.every(m => models.includes(m));
  select_all_models.innerHTML = allSelected ? "Deselect All" : "Select All";
}

const update_select_all_backdrops = () => {
  let all = [];
  if (collections.length == 0) {
    const allData = gift_models.find(g => g._id == "All Names");
    if (allData) all = allData.backgrounds.slice(0, -1).map(b => b.replace(/\s*\(\d+(\.\d+)?%\)/, ""));
  } else {
    collections.forEach(gift => {
      const gm = gift_models.find(g => g._id == gift);
      if (gm) all.push(...gm.backgrounds.slice(0, -1).map(b => b.replace(/\s*\(\d+(\.\d+)?%\)/, "")));
    });
  }
  all = [...new Set(all)];
  const allSelected = all.every(b => backdrops.includes(b));
  select_all_backdrops.innerHTML = allSelected ? "Deselect All" : "Select All";
}

const update_select_all_symbols = () => {
  let all = [];
  if (collections.length == 0) {
    const allData = gift_models.find(g => g._id == "All Names");
    if (allData) all = allData.symbols.slice(0,-1).map(s => s.replace(/\s*\(\d+(\.\d+)?%\)/, ""));
  } else {
    collections.forEach(gift => {
      const gm = gift_models.find(g => g._id == gift);
      if (gm) all.push(...gm.symbols.slice(0,-1).map(s => s.replace(/\s*\(\d+(\.\d+)?%\)/, "")));
    });
  }
  all = [...new Set(all)];
  const allSelected = all.every(s => symbols.includes(s));
  select_all_symbols.innerHTML = allSelected ? "Deselect All" : "Select All";
}

select_all.onclick = () => {
  const all = collections.length == gifts.length;
  if (all) {
    collections = [];
    if (gift_models) {
      gift_models.forEach(gm => {
        gm.models.forEach(m => {
          const i = models.indexOf(m);
          if (i>-1) models.splice(i,1);
        });
      });
    }
  } else {
    collections = [...gifts];
  }
  update_collections(collectionss.value);
  update_models(modelss.value);
  update_backdrops(backdropss.value);
  update_symbols(symbols.value);
};

select_all_models.onclick = () => {
  let allModels = [];
  collections.forEach(gift => {
    const gm = gift_models.find(g => g._id == gift);
    if (gm) allModels.push(...gm.models.slice(0, -1));
  });
  const allSelected = allModels.every(m => models.includes(m));
  if (allSelected) {
    models = models.filter(m => !allModels.includes(m));
  } else {
    allModels.forEach(m => {
      if (!models.includes(m)) models.push(m);
    });
  }
  update_models(modelss.value);
};

select_all_backdrops.onclick = () => {
  let all = [];
  if (collections.length == 0) {
    const allData = gift_models.find(g => g._id == "All Names");
    if (allData) all = allData.backgrounds.slice(0, -1).map(b => b.replace(/\s*\(\d+(\.\d+)?%\)/, ""));
  } else {
    collections.forEach(gift => {
      const gm = gift_models.find(g => g._id == gift);
      if (gm) all.push(...gm.backgrounds.slice(0, -1).map(b => b.replace(/\s*\(\d+(\.\d+)?%\)/, "")));
    });
  }
  all = [...new Set(all)];
  const allSelected = all.every(b => backdrops.includes(b));
  if (allSelected) {
    backdrops = backdrops.filter(b => !all.includes(b));
  } else {
    all.forEach(b => {
      if (!backdrops.includes(b)) backdrops.push(b);
    });
  }
  update_backdrops(backdropss.value);
};

select_all_symbols.onclick = () => {
  let all = [];
  if (collections.length == 0) {
    const allData = gift_models.find(g => g._id == "All Names");
    if (allData) all = allData.symbols.slice(0, -1).map(s => s.replace(/\s*\(\d+(\.\d+)?%\)/, ""));
  } else {
    collections.forEach(gift => {
      const gm = gift_models.find(g => g._id == gift);
      if (gm) all.push(...gm.symbols.slice(0, -1).map(s => s.replace(/\s*\(\d+(\.\d+)?%\)/, "")));
    });
  }
  all = [...new Set(all)];
  const allSelected = all.every(s => symbols.includes(s));
  if (allSelected) {
    symbols = symbols.filter(s => !all.includes(s));
  } else {
    all.forEach(s => {
      if (!symbols.includes(s)) symbols.push(s);
    });
  }
  update_symbols(symbolss.value);
};

const gift_elements = {};

gifts.forEach(gift => {
  const div = document.createElement("div");
  div.innerHTML = `<img src="https://fragment.com/file/gifts/${fix_name(gift)}/thumb.webp"><span>${gift}</span>`;//<div style="padding:0;margin: -23px 0 0 0;text-align:right;">0 TON</div>
  div.onclick = () => {
    if (collections.includes(gift)) {
      collections = collections.filter(g=>g!=gift);
      remove_models_of_gift(gift);
    } else {
      collections.push(gift);
    }
    update_collections(collectionss.value);
    update_models(modelss.value);
    update_backdrops(backdropss.value);
    update_symbols(symbols.value);
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
  const active = [];
  const inactive = [];
  filtered.forEach(gift => {
    const div = gift_elements[gift];
    if (collections.includes(gift)) {
      active.push(div);
    } else {
      inactive.push(div);
    }
    div.style.display = "flex";
    div.className = collections.includes(gift)?"active" :"";
  });
  [...active,...inactive].forEach(div => {
    collectionsl.appendChild(div);
  });
  gifts.forEach(gift => {
    if (!filtered.includes(gift)) {
      gift_elements[gift].style.display = "none";
    }
  });
  //select_all.style.display = filtered.length==gifts.length?"block":"none";
  no_results.style.display = filtered.length==0?"block":"none";
  update_select_all();
  update_url();
}

/*const update_models = (filter = "") => {
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
    if (gm) {
    const sorted = gm.models.slice(0, -1).sort((a, b) => {
      const pa = parseFloat(a.match(/\(([\d.]+)%\)/)?.[1] || 0);
      const pb = parseFloat(b.match(/\(([\d.]+)%\)/)?.[1] || 0);
      return pa - pb;
    });
    all = all.concat(sorted.map(m => ({gift,model:m})));
  }
  });
  const filtered = all.filter(({model}) => model.toLowerCase().includes(filter.toLowerCase()));
  if (filtered.length == 0) {
    const div = document.createElement("div");
    div.innerText = "No Models Found";
    modelsl.appendChild(div);
    return;
  }
  filtered.sort((a, b) => {
    const ain = models.includes(a.model)?-1:1;
    const bin = models.includes(b.model)?-1:1;
    if (ain != bin) return ain-bin;
    if ( a.gift<b.gift ) return -1;
    if ( a.gift>b.gift ) return  1;
    if (a.model<b.model) return -1;
    if (a.model>b.model) return  1;
    return 0;
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
  select_all_models.style.display = filtered.length>0?"block":"none";
  update_select_all_models();
  update_url();
}*/

const model_elements = {};

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
    if (gm) {
      const sorted = gm.models.slice(0, -1).sort((a, b) => {
        const pa = parseFloat(a.match(/\(([\d.]+)%\)/)?.[1] || 0);
        const pb = parseFloat(b.match(/\(([\d.]+)%\)/)?.[1] || 0);
        return pa - pb;
      });
      all = all.concat(sorted.map(m => ({gift, model: m})));
    }
  });

  const filtered = all.filter(({model}) => model.toLowerCase().includes(filter.toLowerCase()));

  if (filtered.length == 0) {
    const div = document.createElement("div");
    div.innerText = "No Models Found";
    modelsl.appendChild(div);
    return;
  }

  filtered.sort((a, b) => {
    const ain = models.includes(a.model)?-1:1;
    const bin = models.includes(b.model)?-1:1;
    if (ain != bin) return ain - bin;
    if (a.gift < b.gift) return -1;
    if (a.gift > b.gift) return 1;
    if (a.model < b.model) return -1;
    if (a.model > b.model) return 1;
    return 0;
  }).forEach(({gift, model}) => {
    let div;

    if (model_elements[model]) {
      div = model_elements[model];
      div.className = models.includes(model) ? "active" : "";
    } else {
      div = document.createElement("div");

      const img = document.createElement("img");
      img.src = `https://gifts.coffin.meme/${gift.toLowerCase()}/${model.split(" (")[0]}.png`;
      img.alt = model;
      img.style.width = "32px";
      img.style.height = "32px";

      div.appendChild(img);
      div.appendChild(document.createTextNode(`${model}`));
      div.className = models.includes(model) ? "active" : "";

      div.onclick = () => {
        if (models.includes(model)) {
          models = models.filter(m => m != model);
        } else {
          models.push(model);
        }
        update_models(filter);
      };
      model_elements[model] = div;
    }
    modelsl.appendChild(div);
  });
  select_all_models.style.display = filtered.length > 0 ? "block" : "none";
  update_select_all_models();
  update_url();
};

const update_backdrops = (filter = "") => {
  backdropsl.innerHTML = "";
  let all = [];
  if (collections.length == 0) {
    const allData = gift_models.find(g => g._id == "All Names");
    if (allData) all = allData.backgrounds.slice(0, -1).map(b => b.replace(/\s*\(\d+(\.\d+)?%\)/, ""));
  } else {
    collections.forEach(gift => {
      const gm = gift_models.find(g => g._id == gift);
      if (gm) all = all.concat(gm.backgrounds.slice(0, -1).map(b => b.replace(/\s*\(\d+(\.\d+)?%\)/, "")));
    });
  }
  all = [...new Set(all)];
  const filtered = all.filter(b => b.toLowerCase().includes(filter.toLowerCase()));
  if (filtered.length == 0) {
    const div = document.createElement("div");
    div.innerText = "No Backdrops Found";
    backdropsl.appendChild(div);
    return;
  }
  filtered.sort((a,b) => {
    const ain = backdrops.includes(a)?-1:1;
    const bin = backdrops.includes(b)?-1:1;
    if (ain != bin) return ain - bin;
    return a.localeCompare(b);
  }).forEach(b => {
    const div = document.createElement("div");
    const color = gift_backdrops.find(x => x.backdrop?.replace(/\s*\(\d+(\.\d+)?%\)/,"")==b)?.color;
    const dot = document.createElement("div");
    dot.style.background = `radial-gradient(circle,${i2h(color.centerColor)} 1%,${i2h(color.edgeColor)} 80%)`;
    dot.classList.add("color");
    div.appendChild(dot);
    div.appendChild(document.createTextNode(b));
    div.className = backdrops.includes(b)?"active":"";
    div.onclick = () => {
      if (backdrops.includes(b)) {
        backdrops = backdrops.filter(x => x != b);
      } else {
        backdrops.push(b);
      }
      update_backdrops(filter);
    };
    backdropsl.appendChild(div);
  });
  select_all_backdrops.style.display = filtered.length>0?"block":"none";
  update_select_all_backdrops();
  update_url();
}

const update_symbols = (filter = "") => {
  symbolsl.innerHTML = "";
  let all = [];
  if (collections.length == 0) {
    const allData = gift_models.find(g => g._id == "All Names");
    if (allData) all = allData.symbols.slice(0,-1).map(b => b.replace(/\s*\(\d+(\.\d+)?%\)/,""));
  } else {
    collections.forEach(gift => {
      const gm = gift_models.find(g => g._id == gift);
      if (gm) all = all.concat(gm.symbols.slice(0,-1).map(b => b.replace(/\s*\(\d+(\.\d+)?%\)/,"")));
    });
  }
  all = [...new Set(all)];
  const filtered = all.filter(s => s.toLowerCase().includes(filter.toLowerCase()));
  if (filtered.length == 0) {
    const div = document.createElement("div");
    div.innerText = "No Symbols Found";
    symbolsl.appendChild(div);
    return;
  }
  filtered.sort((a,b) => {
    const ain = symbols.includes(a)?-1:1;
    const bin = symbols.includes(b)?-1:1;
    if (ain != bin) return ain - bin;
    return a.localeCompare(b);
  }).forEach(s => {
    const div = document.createElement("div");
    div.innerText = s;
    div.className = symbols.includes(s)?"active":"";
    div.onclick = () => {
      if (symbols.includes(s)) {
        symbols = symbols.filter(x => x != s);
      } else {
        symbols.push(s);
      }
      update_symbols(filter);
    };
    symbolsl.appendChild(div);
  });
  select_all_symbols.style.display = filtered.length>0?"block":"none";
  update_select_all_symbols();
  update_url();
}

const load_floors = async () => {
  for (i in gifts) {
    const d = await tonnel_search(page+1,1,"p0",asset.value,{ name: gifts[i] });
    collectionsl.children[i].children[2].innerText = d[0].price+" "+d[0].asset;
  }
}

[
  {btn: collectionst, panel: collectionsd},
  {btn: modelst, panel: modelsd},
  {btn: backdropst, panel: backdropsd},
  {btn: symbolst, panel: symbolsd},
].forEach(({btn, panel}) => {
  btn.onclick = () => {
    const open = panel.style.display === "flex";
    [collectionsd, modelsd, backdropsd, symbolsd].forEach(p => p.style.display = "none");
    panel.style.display = open ? "none" : "flex";
  };
});

collectionss.oninput = () => {
  update_collections(collectionss.value);
  update_models(modelss.value);
  update_backdrops(backdropss.value);
  update_symbols(symbolss.value);
}

modelss.oninput = () => update_models(modelss.value);
backdropss.oninput = () => update_backdrops(backdropss.value);
symbolss.oninput = () => update_symbols(symbolss.value);

collectionssd.onclick = () => { collectionss.value = ""; collectionss.oninput(); };
modelssd.onclick = () => { modelss.value = ""; modelss.oninput(); };
backdropssd.onclick = () => { backdropss.value = ""; backdropss.oninput(); };
symbolssd.onclick = () => { symbolss.value = ""; symbolss.oninput(); };

pagei.onkeydown = e => {
  if (e.key=="Enter"){
    let n = +pagei.value;
    if(n>0&&Number.isInteger(n)) {
      page = n-1;
      load_gifts();
    }
  }
}

btn_q.onclick = () => {
  page--;
  load_gifts();
}
btn_p.onclick = () => {
  page++;
  load_gifts();
}

btn_s.onclick = () => {
  page=0;
  load_gifts();
}

window.onload = async () => {
  
  //window.gift_models = await(await fetch("./json/gift-models.json")).json();
  //window.gift_backdrops = await(await fetch("./json/gift-backdrops.json")).json();
  window.gift_patterns = [];

  const collections = await fetch("https://proxy.thermos.gifts/api/v1/collections").then(r=>r.json());
  Object.keys(gift_elements).forEach(gift => {
    const div = gift_elements[gift];
    const span = div.querySelector("span");
    const name = span.textContent;
    const extra = parseFloat(collections.find(i=>fix_name(i.name)==fix_name(name))?.stats.floor)/1e9 || "";
    span.textContent = extra?`${name} - ${(Math.round(extra*10)/10).toLocaleString("en-US")} TON`:name;
  });

  const tnl = await(await fetch("https://api.dyor.io/v1/jettons/EQDNDv54v_TEU5t26rFykylsdPQsv5nsSZaH_v7JSJPtMitv/price")).json();
  const tonnel = (parseFloat(tnl.usd.price.value)/10**tnl.usd.price.decimals)||0;
  const ton = tonnel/(parseFloat(tnl.ton.price.value)/10**tnl.ton.price.decimals)||0;
  
  window.prices = {
    def: {
      n: "p asset",
      d: 100,
      TON: 1,
      TONNEL: 1,
      USDT: 1
    },
    usd: {
      n: "$p",
      d: 100,
      TON: ton,
      TONNEL: tonnel,
      USDT: 1
    },
    stars: {
      n: "p Stars",
      d: 1,
      TON: ton/0.015,
      TONNEL: tonnel/0.015,
      USDT: 1/0.015
    }
  }

  update_collections();
  update_models();
  update_backdrops();
  update_symbols();

  load_gifts();
}
