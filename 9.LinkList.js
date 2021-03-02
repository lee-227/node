class Node {
  constructor(element, next) {
    this.element = element;
    this.next = next;
  }
}
class LinkList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  add(index, element) {
    if (arguments.length === 1) {
      element = index;
      index = this.size;
    }
    if (index < 0 || index > this.size) {
      throw new Error("index error");
    }
    if (index === 0) {
      let head = this.head;
      this.head = new Node(element, head);
    } else {
      let node = this.getNode(index - 1);
      node.next = new Node(element, node.next);
    }
    this.size++;
  }
  remove(index) {
    if (index < 0 || index > this.size) {
      throw new Error("index error");
    }
    let node;
    if (this.size === 0) return null;
    if (index === 0) {
      node = this.head;
      this.head = node && node.next;
    } else {
      let preNode = this.getNode(index - 1);
      node = preNode.next;
      preNode.next = node.next;
    }
    this.size--;
    return node.element;
  }
  print() {
    let arr = [];
    let node = this.head;
    for (let i = 0; i < this.size; i++) {
      arr.push(node.element);
      node = node.next;
    }
    return arr;
  }
  reverse() {
    let node = null;
    for (let i = 0; i < this.size; i++) {
      let nextNode = this.head.next;
      this.head.next = node;
      node = this.head;
      this.head = nextNode;
    }
    this.head = node;
  }
  dfReverse() {
    function dfs(node) {
      if (!node || !node.next) return node;
      let head = dfs(node.next);
      node.next.next = node;
      node.next = null;
      return head;
    }
    this.head = dfs(this.head);
  }
  getNode(index) {
    let element = this.head;
    for (let i = 0; i < index; i++) {
      element = element.next;
    }
    return element;
  }
  get length() {
    return this.size;
  }
}
module.exports = LinkList;
let ll = new LinkList();
ll.add(0, 2);
ll.add(0, 1);
ll.add(3);
ll.dfReverse();
ll.reverse();
console.log(ll.print());
