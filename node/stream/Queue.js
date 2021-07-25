const LinkList = require("./LinkList");
class Queue {
  constructor() {
    this.ll = new LinkList();
  }
  pop(element) {
    this.ll.add(0, element);
  }
  poll() {
    return this.ll.remove(0);
  }
}
module.exports = Queue;
