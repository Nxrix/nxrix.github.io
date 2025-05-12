/*const t = new Date();
const d = t.getDate();
const m = t.getMonth();
events[m+1]=[{
  day: d,
  solar: true,
  icon: "0,0,",
  w: 0,
  c1: 0,
  c2: 1,
}];
m+1+" "+d*/

/*

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

let events = {
  1: [
    {
      day: 10,
      solar: true,
      offset: 3,
      icon: "5,6,wwfwwfffffbfffb2fbf2wb2bww2w2w",
      c: 25
    },
    {
      day: 24,
      solar: true,
      offset: 3,
      icon: "5,6,wwfwwfffffbfffb2fbf2wb2bww2w2w",
      c: 0
    }
  ],
  2: [
    {
      day: 14,
      solar: false,
      icon: "5,6,55w55565654565424542w242www2ww",
      c: 5
    }
  ],
  3: [
    {
      day: 20,
      solar: true,
      icon: "7,6,wwwwwcdccgwcdgcddcdg22ccg22ww22gwwww88k88w",
      c: [9,12]
    },
    {
      day: 21,
      solar: true,
      icon: "7,6,wwwwwcdccgwcdgcddcdg22ccg22ww22gwwww88k88w",
      c: [9,12]
    }
  ],
  12: [
    {
      day: 25,
      solar: false,
      icon: "5,6,wwfwwwgg6ww6ccwggggg22822ww2ww",
      c: [5,16,2]
    }
  ]
};