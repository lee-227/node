/**
 * 封包与解包
 * 为了解决 tcp 的粘包问题
 * 再多次 write 发送数据时，会默认将数据加入到缓冲区中，然后一次性的将所有的数据发送出去
 * 这样做有效避免了多次的网络传输浪费性能问题，但是会导致数据粘连，无法分清每段数据。
 * 所以需要自己配合封包解包使用
 */
module.exports = class Transform {
  constructor() {
    this.no = 0;
    this.noLen = 2;
    this.headerLen = 4;
  }
  encode(data, no) {
    const dataBuf = Buffer.from(data);
    let headerBuf = Buffer.alloc(this.headerLen);
    headerBuf.writeInt16BE(no || ++this.no);
    headerBuf.writeInt16BE(dataBuf.length, this.noLen);
    return Buffer.concat([headerBuf, dataBuf]);
  }
  decode(data) {
    const headerBuf = data.slice(0, this.headerLen);
    const dataBuf = data.slice(this.headerLen);
    return {
      no: headerBuf.readInt16BE(),
      bodyLength: headerBuf.readInt16BE(this.noLen),
      body: dataBuf.toString(),
    };
  }
  getLen(data) {
    if (data.length < this.headerLen) {
      return 0;
    } else {
      return this.headerLen + data.readInt16BE(this.noLen);
    }
  }
};
