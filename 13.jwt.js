const crypto = require("crypto");
const jwt = {
  toBase64Url(content) {
    return content.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
  },
  toBase64(content) {
    return this.toBase64Url(
      Buffer.from(JSON.stringify(content)).toString("base64")
    );
  },
  sign(content, secret) {
    return this.toBase64Url(
      crypto.createHmac("sha256", secret).update(content).digest("base64")
    );
  },
  encode(payload, secret) {
    let header = this.toBase64({ type: "JWT", alg: "HS256" });
    let content = this.toBase64(payload);
    let sign = this.sign(header + "." + content, secret);
    return header + "." + content + "." + sign;
  },
  base64urlUnescape(str) {
    str += new Array(5 - (str.length % 4)).join("=");
    return str.replace(/\-/g, "+").replace(/\_/g, "/");
  },
  decode(token, secret) {
    let [header, content, sign] = token.split(".");
    let newSign = this.sign(header + "." + content, secret);
    if (newSign === sign) {
      return JSON.parse(
        Buffer.from(this.base64urlUnescape(content), "base64").toString()
      );
    } else {
      throw new Error("令牌错误");
    }
  },
};
let token = jwt.encode({ name: "lee", expire: "100" }, "lee");
console.log(token); //eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJuYW1lIjoibGVlIiwiZXhwaXJlIjoiMTAwIn0.j-2Bsx17LGizjqKnw8vReMpMg-WffMTJY6rvd1feSF0
const data = jwt.decode(
  "eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJuYW1lIjoibGVlIiwiZXhwaXJlIjoiMTAwIn0.j-2Bsx17LGizjqKnw8vReMpMg-WffMTJY6rvd1feSF0",
  "lee"
);
console.log(data); //{ name: 'lee', expire: '100' }
