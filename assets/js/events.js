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

let events = {
  1: [
    {
      day: 10,
      solar: true,
      offset: 3,
      icon: "5,6,wwfwwfffffbfffb2fbf2wb2bww2w2w",
      w: 5,
      c1: 25,
      c2: 26,
    },
    {
      day: 24,
      solar: true,
      offset: 3,
      icon: "5,6,wwfwwfffffbfffb2fbf2wb2bww2w2w",
      w: 5,
      c1: 0,
      c2: 20,
    }
  ],
  2: [
    {
      day: 14,
      solar: false,
      icon: "5,6,55w55565654565424542w242www2ww",
      w: 5,
      c1: 5,
      c2: 6,
    }
  ],
  3: [
    {
      day: 20,
      solar: true,
      icon: "7,6,wwwwwcdccgwcdgcddcdg22ccg22ww22gwwww88k88w",
      w: 7,
      c1: [4,12,11],
      c2: [8,13,15],
    },
    {
      day: 21,
      solar: true,
      icon: "7,6,wwwwwcdccgwcdgcddcdg22ccg22ww22gwwww88k88w",
      w: 7,
      c1: [4,12,11],
      c2: [8,13,15],
    }
  ],
  12: [
    {
      day: 25,
      solar: false,
      icon: "5,6,wwfwwwgg6ww6ccwggggg22822ww2ww",
      w: 5,
      c1: [5,16,2],
      c2: [6,17,3],
    }
  ]
};