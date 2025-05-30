/**
 * @copyright (c) 2025 Nxrix. All rights reserved.
 */

/*

0:	User Metadata
1:	Short Text Note
2:	Recommend Relay
3:	Follows
4:	Encrypted Direct Messages
5:	Event Deletion Request
6:	Repost
7:	Reaction

 1000 <= n < 10000 || 4 <= n < 45 || n == 1 || n == 2, they're all expected to be stored by relays. - stored.
10000 <= n < 20000 || n == 0 || n == 3, for each combination of pubkey and kind, only the latest event MUST be stored by relays, older versions MAY be discarded. - replaceable.
20000 <= n < 30000, they are not expected to be stored by relays. - ephemeral.
30000 <= n < 40000, for each combination of pubkey, kind and d tag, only the latest event MUST be stored by relays, older versions MAY be discarded. - replaceable 2.

sent:
  ["EVENT",<event JSON>]    - publish events.
  ["REQ",<id>,<...filters>] - request events and subscribe to new updates.
  ["CLOSE",<id>]            - stop previous subscriptions.

filter: {
  "ids"         event ids
  "authors"     lowercase pubkeys
  "kinds"       kind numbers
  "#(a-zA-Z)"   tag values
  "since"       integer unix timestamp in seconds. created_at >=
  "until"       integer unix timestamp in seconds. created_at <=
  "limit"       limit
}

received:
  ["EVENT", <id>, <event JSON>], events requested.
  ["OK", <id>, <true|false>, <message>], acceptance or denial of an EVENT message.
  ["EOSE", <subscription_id>] indicate the end of stored events and the beginning of events newly received in real-time.
  ["CLOSED", <subscription_id>, <message>] indicate that a subscription was ended on the server side.
  ["NOTICE", <message>] human-readable error messages or other things.

scripts:
  <script src="https://bitcoincore.tech/apps/bitcoinjs-ui/lib/bitcoinjs-lib.js"></script>
  <script src="https://bundle.run/noble-secp256k1@1.2.14"></script>
  <script src="https://nxrix.github.io/assets/js/nxstr.js"></script>

*/

const nxstr = {

  sk: null,
  pk: null,
  socket: null,

  sha256: bitcoinjs.crypto.sha256,
  schnorr: nobleSecp256k1.schnorr,

  h2b: (h) => Uint8Array.from(h.match(/.{1,2}/g).map(b=>parseInt(b,16))),

  b642h: (b) => Array.from(atob(b)).map(c=>c.charCodeAt(0).toString(16).padStart(2,"0")).join(""),

  generate_keys: () => {
    nxstr.sk = bitcoinjs.ECPair.makeRandom().privateKey.toString("hex");
    nxstr.pk = nxstr.schnorr.getPublicKey(nxstr.sk);
  },

  login: (sk) => {
    if (sk) {
      nxstr.pk = nxstr.schnorr.getPublicKey(sk);
      nxstr.sk = sk;
    } else {
      nxstr.generate_keys();
    }
  },

  change_base: (i,c1,c2) => {
    const b1 = c1.length;
    const b2 = c2.length;
    let lz = 0;
    while (i[lz]==c1[0]) {
      lz++;
    }
    let d = "0";
    for (let n=lz;n<i.length; n++) {
      d = (BigInt(d)*BigInt(b1)+BigInt(c1.indexOf(i[n]))).toString();
    }
    if (d=="0") {
      return c2[0].repeat(lz+1);
    }
    let o = "";
    while (d!="0") {
      let r = BigInt(d)%BigInt(b2);
      o = c2[Number(r)]+o;
      d = (BigInt(d)/BigInt(b2)).toString();
    }
    return c2[0].repeat(lz)+o;
  },

  raw2friendly: (k,f=[0,0,0,0]) => {
    let bytes = f;
    for (let i=0;i<32;i++) bytes.push(+("0x"+k[i*2]+k[i*2+1]));
    return btoa(String.fromCodePoint(...bytes)).replace(/\+/g,"-").replace(/\//g,"_");
  },

  sign: async (event,sk) => {
    if (!event.pubkey) event.pubkey = nxstr.pk;
    if (!event.created_at) event.created_at = Math.floor(Date.now()/1000);
    if (!event.content) event.content = "";
    const data = JSON.stringify([
      0,
      event.pubkey,
      event.created_at,
      event.kind,
      event.tags,
      event.content
    ]);
    event.id = nxstr.sha256(data).toString("hex");
    event.sig = await nxstr.schnorr.sign(event.id,sk||nxstr.sk);

    return event;
  },

  encrypt: async (text,pk,sk) => {
    if (!sk) sk = nxstr.sk;
    const sharedSecret = nobleSecp256k1.getSharedSecret(sk,"02"+pk,true).substring(2);
    const key = await crypto.subtle.importKey("raw",nxstr.h2b(sharedSecret),{name:"AES-CBC"},false,["encrypt"]);
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const ciphertext = await crypto.subtle.encrypt({name:"AES-CBC",iv},key,new TextEncoder().encode(text));
    return btoa(String.fromCharCode(...new Uint8Array(ciphertext)))+"?iv="+btoa(String.fromCharCode(...iv));
  },

  decrypt: async (text,pk,sk) => {
    if (!sk) sk = nxstr.sk;
    const [encryptedMessage,ivB64] = text.split("?iv=");
    const sharedSecret = nobleSecp256k1.getSharedSecret(sk,"02"+pk,true).substring(2);
    const key = await crypto.subtle.importKey("raw",nxstr.h2b(sharedSecret),{name:"AES-CBC"},false,["decrypt"]);
    const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
    const decrypted = await crypto.subtle.decrypt({name:"AES-CBC",iv },key,Uint8Array.from(atob(encryptedMessage),c=>c.charCodeAt(0)));
    return new TextDecoder().decode(decrypted);
  },

  connect: (url="wss://nos.lol") => {
    if (nxstr.socket) nxstr.socket.close();
    nxstr.socket = new WebSocket(url);
  }

};
