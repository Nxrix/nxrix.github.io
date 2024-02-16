const profile_colors = [
  "5dadde",
  "79ca7b",
  "e39552",
  "e35a62",
  "a480dd",
  "5ac1d0",
  "e75089"
];

const calculateColor = (name) => {
  var a = 0;
  for (n in name) {
    a += name.charCodeAt(n);
  }
  return profile_colors[a%profile_colors.length];
}

const numberToString = (num) => {
  const isNegative = num < 0;
  const absoluteNum = Math.abs(num);
  const numString = absoluteNum.toString();
  const digits = numString.split("");
  digits.reverse();
  const formattedDigits = [];
  for (let i = 0; i < digits.length; i++) {
    formattedDigits.push(digits[i]);
    if ((i + 1) % 3 === 0 && i !== digits.length - 1) {
      formattedDigits.push(",");
    }
  }
  formattedDigits.reverse();
  const formattedNumString = formattedDigits.join("");
  if (isNegative) {
    return "-" + formattedNumString;
  } else {
    return formattedNumString;
  }
}

const leaderboard = document.getElementById("leaderboard");
const update = (data) => {
  leaderboard.innerHTML = "";
  for (var n=4;n>=0;n--) {
    var profile = data.data.leaderboard[n];
    leaderboard.insertAdjacentHTML("afterend",`
      <div class="profile">
        <div class="avatar"><img src="${profile.avatar==null?"https://ui-avatars.com/api/?name="+profile.user.firstName+"&background="+calculateColor(profile.user.firstName)+"&color=fff":profile.avatar}" alt="avatar"></div>
        <div class="name"><div>
          ${profile.user.firstName} ${profile.user.lastName||""} ${profile.user.isPremium==true?`<img class="premium" src="./img/premium.png">`:""}
          <br>
          ${profile.user.username!=null?`<a class="link" href="https://t.me/${profile.user.username}" target="_blank">@${profile.user.username}</a>`:""}
        </div></div>
        ${n<3?`<img class="medal" src="./img/emoji/${n==0?"first":n==1?"second":"third"}-place-medal.png">`:""}
        <hr>
        <div class="data">
          <div><img class="emoji" src="./img/coin.png"> Mined today: ${numberToString(profile.lcoins)}</div>
          <div><img class="emoji" src="./img/emoji/coin.png"> Total score: ${numberToString(profile.totalCoins)}</div>
          <div><img class="emoji" src="./img/emoji/coin.png"> Balance: ${numberToString(profile.balanceCoins)}</div>
          ${""/*<div><img class="emoji" src="./img/emoji/fire.png"> Spent: ${numberToString(profile.spentCoins)}</div>*/}
        </div>
      </div>
    `);
  }leaderboard.insertAdjacentHTML("afterend","<hr>")
  for (var n=0;n<100;n++) {
    var profile = data.data.leaderboard[n];
    leaderboard.innerHTML += `<div class="user">
      <div class="rank" ${n>2?`style="font-size: small;"`:""}>${n>2?(n+1):n==0?"🥇":n==1?"🥈":"🥉"}</div>
      <div class="avatar"><img src="${profile.avatar==null?"https://ui-avatars.com/api/?name="+profile.user.firstName+"&background="+calculateColor(profile.user.firstName)+"&color=fff":profile.avatar}" alt="avatar"></div>
      <div class="name"><div>
        ${profile.user.firstName} ${profile.user.lastName||""} ${profile.user.isPremium==true?`<img class="premium" src="./img/premium.png">`:""}
        <br>
        ${profile.user.username!=null?`<a class="link" href="https://t.me/${profile.user.username}" target="_blank">@${profile.user.username}</a>`:""}
      </div></div>
      <div class="coins"><img class="coin" src="./img/coin.png">${numberToString(profile.lcoins)}</div>
    </div>`;
  }
}
