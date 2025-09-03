const gift_names = `Mighty Arm
Artisan Brick
Input Key
Jolly Chimp
Ionic Dryer
Stellar Rocket
Moon Pendant
Snoop Dogg
Low Rider
Westside Sign
Snoop Cigar
Swag Bag
Whip Cupcake
Valentine Box
Joyful Bundle
Cupid Charm
Lush Bouquet
Heart Locket
Heroic Helmet
Bow Tie
Restless Jar
Nail Bracelet
Gem Signet
Light Sword
Bonded Ring
Big Year
Pet Snake
Snake Box
Xmas Stocking
Holiday Drink
Easter Egg
Jack-in-the-Box
Neko Helmet
Snow Globe
Tama Gadget
Electric Skull
Candy Cane
Winter Wreath
Top Hat
Sleigh Bell
Sakura Flower
Record Player
Love Potion
Diamond Ring
Toy Bear
Loot Bag
Durov's Cap
Vintage Cigar
Plush Pepe
Lunar Snake
Genie Lamp
Witch Hat
Jester Hat
Love Candle
Desk Calendar
Hanging Star
Jingle Bells
Cookie Heart
Party Sparkler
Snow Mittens
Mad Pumpkin
Astral Shard
B-Day Candle
Hypno Lollipop
Voodoo Doll
Bunny Muffin
Flying Broom
Swiss Watch
Crystal Ball
Eternal Candle
Ion Gem
Ginger Cookie
Lol Pop
Mini Oscar
Star Notepad
Hex Pot
Kissed Frog
Skull Flower
Homemade Cake
Trapped Heart
Santa Hat
Eternal Rose
Spiced Wine
Spy Agaric
Berry Box
Signet Ring
Scared Cat
Perfume Bottle
Sharp Tongue
Precious Peach
Jelly Bunny
Magic Potion
Evil Eye`;

const fix_name = n => n.replaceAll(" ","").replaceAll("-","").replaceAll("'","").toLowerCase();

const get_img = (a,b,c=1) => {
  return `https://nft.fragment.com/gift/${a}-${b}${[".small",".medium",".large",""][c]}${c<3?".jpg":".webp"}`
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

const tonnel_search = async ({page=1,limit=8,sort="d",asset="TON",name,model,backdrop,symbol,tag,pmin,pmax}) => {
  const s = {
    d: { message_post_time: -1 , gift_id: -1 },
    p0: { price:  1 , gift_id: -1 },
    p1: { price: -1 , gift_id: -1 },
    i: { gift_num:  1 , gift_id: -1 },
    j: { gift_num: -1 , gift_id: -1 },
    r: { rarity: -1 , gift_id: -1 },
    m: { modelRarity: 1 , gift_id: -1 },
    b: { backdropRarity: 1 , gift_id: -1 },
    s: { symbolRarity: 1 , gift_id: -1 }
  };
  return await(await fetch("https://gifts3.tonnel.network/api/pageGifts", {
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
        buyer: { $exists: false },
        ...(tag=="nopremarket" && { export_at: { $exists: true } }),
        ...(tag=="telegram" && { telegramMarketplace: true , export_at: { $exists: false } }),
        ...(tag=="premarket" && { premarket: true }),
        ...(tag=="mintable" && { export_at: { $lt: new Date().toISOString() } }),
        ...(tag=="bundle" && { gift_id: { $lt: 0 } }),
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

const gift_names0 = fix_name(gift_names);

const gifts = gift_names.split("\n");
const gifts0 = gift_names0.split("\n");

const backdrop_pattern = `<svg width="100%" height="100%" viewBox="0 0 416 416" class="absolute inset-0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <filter id="{{gift_n}}-f">
      <feFlood flood-color="{{gift_pattern}}"></feFlood>
      <feComposite in2="SourceGraphic" operator="in"></feComposite>
    </filter>
    <image id="{{gift_n}}-p" x="-50" y="-50" width="100" height="100" xlink:href="{{gift_symbol}}"></image>
    <g id="{{gift_n}}-fp">
      <g opacity="0.10" transform="translate(106.08,29.12) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.10" transform="translate(309.92,29.12) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.10" transform="translate(-2.08,166.4) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.10" transform="translate(418.08,166.4) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.10" transform="translate(208,395.2) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.15" transform="translate(208,37.44) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.15" transform="translate(38.688,97.76) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.15" transform="translate(377.728,97.76) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.15" transform="translate(26.208,270.4) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.15" transform="translate(389.376,270.4) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.15" transform="translate(53.248,358.592) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.15" transform="translate(144.768,358.592) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.15" transform="translate(271.232,358.592) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.15" transform="translate(361.92,358.592) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.24" transform="translate(141.44,81.12) scale(0.416)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.24" transform="translate(272.48,81.12) scale(0.416)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.24" transform="translate(92.352,133.12) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.24" transform="translate(323.648,133.12) scale(0.3328)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.24" transform="translate(68.64,201.76) scale(0.4576)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.24" transform="translate(346.528,201.76) scale(0.4576)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.24" transform="translate(99.84,301.6) scale(0.3744)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.24" transform="translate(314.08,301.6) scale(0.3744)"><use xlink:href="#{{gift_n}}-p"></use></g>
      <g opacity="0.24" transform="translate(208,320.32) scale(0.3744)"><use xlink:href="#{{gift_n}}-p"></use></g>
    </g>
  </defs>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><use xlink:href="#{{gift_n}}-fp" filter="url(#{{gift_n}}-f)"></use></g>
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
    .replaceAll("{{gift_n}}", slug)
    .replaceAll("{{gift_symbol}}",pattern)
    .replaceAll("{{gift_pattern}}", i2h(patternColor));
  img.src =
    "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
};

const add_gift = (c,n,p,i,a,m,g) => {
  const gift = document.createElement("a");
  gift.classList.add("item");
  gift.href = "tg://resolve?domain=tonnel_network_bot&appname=gift&startapp=ref_5829347783_"+i;
  //gift.style.boxShadow = a?("0 0 0 1px var(--md-sys-color-background), "+(m?"0 0 0 2px #48f, 0 0 0 3px #fb0":"0 0 0 3px #fb0")):(m?"0 0 0 1px var(--md-sys-color-background), 0 0 0 3px #48f":"");

  const img = document.createElement("img");
  img.src = get_img(c,n);
  img.style.transform = "scale(0.975)";
  img.style.borderRadius = "calc(var(--font)/100*10)";
  gift.appendChild(img);
  
  const b = gift_backdrops.find(i=>i.backdrop?.replace(/\s*\(\d+(\.\d+)?%\)/,"")==g.backdrop.split(" (")[0]).color;

  img.onerror = () => {
    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4AWJiYGBgAAAAAP//XRcpzQAAAAZJREFUAwAADwADJDd96QAAAABJRU5ErkJggg==";
    /*const q = document.createElement("div");
    q.classList.add("q");
    q.innerText = (gifts.find(i=>fix_name(i)==c)||"").replaceAll(" ","").replaceAll("-","?")+"-"+n//"?";
    gift.appendChild(q);*/
    img.style.background = `radial-gradient(circle,${i2h(b.centerColor)} 1%,${i2h(b.edgeColor)} 80%)`;
    const mi = document.createElement("img");
    mi.src = `https://gifts.coffin.meme/${g.name.toLowerCase()}/${g.model.split(" (")[0]}.png`
    mi.style.width = "100%";
    mi.style.height = "100%";
    mi.style.position = "absolute";
    mi.style.transform = "scale(0.625)";
    mi.style.zIndex = "1";
    gift.insertBefore(mi, gift.firstChild);
    load_patterns(img, {
      slug: (gifts.find(i=>fix_name(i)==c)||"").replaceAll(" ","").replaceAll("-","?")+"-"+n,
      symbol: g.symbol.split(" (")[0],
      patternColor: b.patternColor
    });
  };

  /*const id = document.createElement("div");
  id.classList.add("id");
  id.innerText = "#"+n;
  gift.appendChild(id);*/
  gift.insertAdjacentHTML("beforeend", tag_svg
    .replaceAll("{{tag_number}}", n)
    .replaceAll("{{tag_background}}",i2h(b.edgeColor))
    .replaceAll("{{tag_color}}",i2h(b.textColor))
  );

  if (p) {
    const price = document.createElement("div");
    price.classList.add("price");
    price.style.background = i2h(b.edgeColor);
    price.innerText = p;
    gift.appendChild(price);
  }

  gifts_list.appendChild(gift);
}

const add_bundle = (b,p,i,a) => {
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

  if (p) {
    const price = document.createElement("div");
    price.classList.add("price");
    price.innerText = p;
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

  const pfix = prices[format.value][asset.value]*(asset.value=="TONNEL"?1.06:1.06);

  const data = await tonnel_search({
    page: page+1,
    limit,
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
    const a = g.asset=="TONNEL"?1.06:1.06;
    const p = f.n.replace("p",(Math.ceil(g.price*a*f[g.asset]*f.d)/f.d).toLocaleString("en-US")).replace("a",g.asset);
    if (g.gift_id>0) {
      const m = (Date.now() - new Date(g.export_at).getTime())>0;
      add_gift(fix_name(g.name),g.gift_num,p,g.gift_id,g.promoted,m,g);
    } else {
      const b = await(await fetch("https://gifts3.tonnel.network/api/giftData/"+g.gift_id)).json();
      add_bundle(b,p,g.gift_id,g.promoted);
    }
  }

  if (data.length==0) gifts_list.innerHTML = `<div style="padding:16px;">No Gifts Found</div>`;
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

const url_string = window.location.href;
const url = new URL(url_string);
const limit = 24;

let page = Math.max(parseInt(url.searchParams.get("p"))||0,0);
sort.value = url.searchParams.get("s")||"d";
asset.value = url.searchParams.get("a")||"TON";
format.value = url.searchParams.get("f")||"def";
tag.value = url.searchParams.get("t")||"all";
numbers.value = url.searchParams.get("n")||"";
min.value = parseInt(url.searchParams.get("min"))||"";
max.value = parseInt(url.searchParams.get("max"))||"";

const parse = (key) => {
  const val = url.searchParams.get(key);
  return val?val.split(","):[];
}

let collections = parse("collections");
let models = parse("models");
let backdrops = parse("backdrops");
let symbols = parse("symbols");

const update_url = () => {
  const encode = (arr) => arr.map(encodeURIComponent).join(",");
  history.replaceState({},null,`${location.pathname}?p=${page}&s=${sort.value}&a=${asset.value}&f=${format.value}${tag.value!="all"?"&t="+tag.value:""}${parse_nums(numbers.value)?"&n="+numbers.value:""}${!isNaN(parseInt(min.value))?"&min="+parseInt(min.value):""}${!isNaN(parseInt(max.value))?"&max="+parseInt(max.value):""}` +
    (collections.length ? `&collections=${encode(collections)}`:"") +
    (models.length ? `&models=${encode(models)}`:"") +
    (backdrops.length ? `&backdrops=${encode(backdrops)}`:"") +
    (symbols.length ? `&symbols=${encode(symbols)}`:"") +
    location.hash
  );
}

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
  select_all.style.display = filtered.length==gifts.length?"block":"none";
  no_results.style.display = filtered.length==0?"block":"none";
  update_select_all();
  update_url();
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
}

const i2h = (n) => "#"+n.toString(16).padStart(6,"0");

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

collectionst.onclick = () => {
  collectionsd.style.display = collectionsd.style.display=="flex"?"none":"flex";
  modelsd.style.display = "none";
  backdropsd.style.display = "none";
  symbolsd.style.display = "none";
  //apply_effect();
}

modelst.onclick = () => {
  modelsd.style.display = modelsd.style.display=="flex"?"none":"flex";
  collectionsd.style.display = "none";
  backdropsd.style.display = "none";
  symbolsd.style.display = "none";
  //apply_effect();
}

backdropst.onclick = () => {
  backdropsd.style.display = backdropsd.style.display=="flex"?"none":"flex";
  collectionsd.style.display = "none";
  modelsd.style.display = "none";
  symbolsd.style.display = "none";
  //apply_effect();
}

symbolst.onclick = () => {
  symbolsd.style.display = symbolsd.style.display=="flex"?"none":"flex";
  collectionsd.style.display = "none";
  modelsd.style.display = "none";
  backdropsd.style.display = "none";
  //apply_effect();
}

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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" style="width:100%;height:100%;">
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

window.onload = async () => {
  //const proxy = "https://corsproxy.io/?url=";
  //window.proxy = "https://api.codetabs.com/v1/proxy/?quest=";
  window.gift_models = await(await fetch("./json/gift-models.json")).json();
  window.gift_backdrops = await(await fetch("./json/gift-backdrops.json")).json();
  window.gift_patterns = [];

  //const ton = (await(await fetch(proxy+"https://api.diadata.org/v1/assetQuotation/Ton/0x0000000000000000000000000000000000000000")).json())?.Price||0;
  //const ton = (await(await fetch("https://min-api.cryptocompare.com/data/price?fsym=TON&tsyms=USD")).json())?.USD||0;
  //const tnl = (await(await fetch(proxy+"https://dyor.io/api/v4/jettons/slug/tonnel/details")).json());
  //const tonnel = tnl.cachedJetton.price*ton||0;
  
  const tnl = await(await fetch("https://api.dyor.io/v1/jettons/EQDNDv54v_TEU5t26rFykylsdPQsv5nsSZaH_v7JSJPtMitv/price")).json();
  const tonnel = (parseFloat(tnl.usd.price.value)/10**tnl.usd.price.decimals)||0;
  const ton = tonnel/(parseFloat(tnl.ton.price.value)/10**tnl.ton.price.decimals)||0;

  //const arz = (await(await fetch("https://raw.githubusercontent.com/CertMusashi/Chande-api/refs/heads/main/arz.json")).json())?.currencies||[];
  //const usd = arz.find(i=>i.code=="usd")?.price||0;
  //const rub = arz.find(i=>i.code=="rub")?.price||1;
  //const eur = arz.find(i=>i.code=="eur")?.price||1;
  
  //const rndn = (n,d=100) => ((n*d+0.5|0)/d).toLocaleString("en-US");
  
  //ton_price.innerText = `1 TON = $${rndn(ton)}`;
  //tonnel_price.innerText = `1 TONNEL = $${rndn(tonnel)} = ${rndn(tonnel/ton)} TON`;
  //usd_price.innerText = `1 USD = ${rndn(usd)} IRT = ${rndn(usd/rub)} RUB`;
  
  window.prices = {
    def: {
      n: "p a",
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
    /*irt: {
      n: "p IRT",
      d: 1,
      TON: ton*usd,
      TONNEL: tonnel*usd,
      USDT: usd
    },
    rub: {
      n: "p RUB",
      d: 1,
      TON: ton*usd/rub,
      TONNEL: tonnel*usd/rub,
      USDT: usd/rub
    },
    eur: {
      n: "p EUR",
      d: 100,
      TON: ton*usd/eur,
      TONNEL: tonnel*usd/eur,
      USDT: usd/eur
    }*/
  }

  update_collections();
  update_models();
  update_backdrops();
  update_symbols();

  load_gifts();
  //load_charts();
}