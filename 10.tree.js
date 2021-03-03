class Node {
  constructor(element, parent) {
    this.element = element;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }
}
class Tree {
  constructor() {
    this.root = null;
    this.size = 0;
  }
  add(element) {
    if (this.root) {
      let currentNode = this.root;
      let parent = null;
      let compare;
      while (currentNode) {
        compare = element - currentNode.element;
        parent = currentNode;
        if (compare >= 0) {
          currentNode = currentNode.right;
        } else {
          currentNode = currentNode.left;
        }
      }
      if (compare > 0) {
        parent.right = new Node(element, parent);
      } else {
        parent.left = new Node(element, parent);
      }
    } else {
      this.root = new Node(element, null);
      this.size++;
    }
  }
  preorderTraversal(cb) {
    let fn = (node) => {
      if (!node) return;
      cb(node.element);
      fn(node.left);
      fn(node.right);
    };
    fn(this.root);
  }
  inorderTraversal(cb) {
    let fn = (node) => {
      if (!node) return;
      fn(node.left);
      cb(node.element);
      fn(node.right);
    };
    fn(this.root);
  }
  postOrderTraversal(cb) {
    let fn = (node) => {
      if (!node) return;
      fn(node.left);
      fn(node.right);
      cb(node.element);
    };
    fn(this.root);
  }
  levelOrderTraversal(cb) {
    if (!this.root) return;
    let stack = [this.root];
    for (let i = 0; i < stack.length; i++) {
      cb(stack[i].element);
      stack[i].left && stack.push(stack[i].left);
      stack[i].right && stack.push(stack[i].right);
    }
  }
  invertTree() {
    if (!this.root) return;
    let stack = [this.root];
    for (let i = 0; i < stack.length; i++) {
      [stack[i].left, stack[i].right] = [stack[i].right, stack[i].left];
      stack[i].left && stack.push(stack[i].left);
      stack[i].right && stack.push(stack[i].right);
    }
  }
}
let tree = new Tree();
tree.add(1);
tree.add(2);
tree.add(13);
tree.add(24);
tree.add(8);
tree.levelOrderTraversal((node) => {
  console.log(node);
});
tree.invertTree();
console.dir(tree, { depth: 5 });
