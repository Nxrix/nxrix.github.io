/*

const n = new Date();
e = events[0];
a = events_parse(e);
events.push(
`${n.getMonth()+1}:${n.getDate()+(a.s&&events_leap(n.getYear()+a.o))}:`+
  e.replace(/^([^:]*:){2}/,"")
);

  Jan  Feb  Mar
  Apr  May  Jun
  Jul  Aug  Sep
  Oct  Nov  Dec

  Far  Ord  Kho
  Tir  Mor  Sha
  Meh  Aba  Aza
  Dey  Bah  Esf

  Jan (Dey, Bah)  Feb (Bah, Esf)  Mar (Esf, Far)
  Apr (Far, Ord)  May (Ord, Kho)  Jun (Kho, Tir)
  Jul (Tir, Mor)  Aug (Mor, Sha)  Sep (Sha, Meh)
  Oct (Meh, Aba)  Nov (Aba, Aza)  Dec (Aza, Dey)

*/

let events = [
  "1:10:7:25:5,6,wwfwwfffffbfffb2fbf2wb2bww2w2w",
  "1:24:7:0:5,6,wwfwwfffffbfffb2fbf2wb2bww2w2w",
  "2:14:0:5:5,6,55w55565654565424542w242www2ww",
  "3:20,21:1:9,12:7,6,wwwwwcdccgwcdgcddcdg22ccg22ww22gwwww88k88w",
  "12:25:0:5,16,2:5,6,wwfwwwgg6ww6ccwggggg22822ww2ww"
];

const events_leap = year => (year%4==0&&year%100!=0)||(year%400==0);

const events_parse = (str) => {
  const parts = str.split(":");
  let [ mraw , draw , braw , craw , i ] = parts;
  const m = parseInt(mraw);
  const d = draw.split(",").map(x=>parseInt(x));
  const b = parseInt(braw);
  const s = (b&0b001);
  const o = (b&0b110)>>1;
  const c = craw.split(",").map(x=>parseInt(x));
  return { m , d , s , o , c , i };
}

const events_find = (input) => {
  const date = input instanceof Date?input:new Date(input);
  const year = date.getFullYear();
  const month = date.getMonth()+1;
  const day = date.getDate();
  const e = events.map(parse_event);
  for (const event of e) {
    if (event.m == month) {
      for (const d of event.d) {
        if (day == ( d - (event.s&&events_leap(year+event.o)) )) {
          return event;
        }
      }
    }
  }
  return null;
}
