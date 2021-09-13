class Node {
  constructor(element, parent) {
    this.element = element
    this.parent = parent
    this.left = null
    this.right = null
  }
}
class Tree {
  constructor() {
    this.root = null
    this.size = 0
  }
  add(element) {
    if (this.root) {
      let currentNode = this.root
      let parent = null
      let compare
      while (currentNode) {
        compare = element - currentNode.element
        parent = currentNode
        if (compare >= 0) {
          currentNode = currentNode.right
        } else {
          currentNode = currentNode.left
        }
      }
      if (compare > 0) {
        parent.right = new Node(element, parent)
      } else {
        parent.left = new Node(element, parent)
      }
    } else {
      this.root = new Node(element, null)
      this.size++
    }
  }
  preorderTraversal(cb) {
    let fn = (node) => {
      if (!node) return
      cb(node.element)
      fn(node.left)
      fn(node.right)
    }
    fn(this.root)
  }
  inorderTraversal(cb) {
    let fn = (node) => {
      if (!node) return
      fn(node.left)
      cb(node.element)
      fn(node.right)
    }
    fn(this.root)
  }
  postOrderTraversal(cb) {
    let fn = (node) => {
      if (!node) return
      fn(node.left)
      fn(node.right)
      cb(node.element)
    }
    fn(this.root)
  }
  levelOrderTraversal(cb) {
    if (!this.root) return
    let stack = [this.root]
    for (let i = 0; i < stack.length; i++) {
      cb(stack[i].element)
      stack[i].left && stack.push(stack[i].left)
      stack[i].right && stack.push(stack[i].right)
    }
  }
  invertTree() {
    if (!this.root) return
    let stack = [this.root]
    for (let i = 0; i < stack.length; i++) {
      ;[stack[i].left, stack[i].right] = [stack[i].right, stack[i].left]
      stack[i].left && stack.push(stack[i].left)
      stack[i].right && stack.push(stack[i].right)
    }
  }
  predesessor(node) {
    if (node === null) return null
    let prev = node.left
    if (prev) {
      while (prev.right) {
        prev = prev.right
      }
      return prev
    }
    let p = node.parent
    while (p && p.left === node) {
      p = p.parent
    }
    return p
  }
  successor(node) {
    if (node === null) return null
    let prev = node.right
    if (prev) {
      while (prev.left) {
        prev = prev.left
      }
      return prev
    }
    let p = node.parent
    while (p && p.right === node) {
      p = p.parent
    }
    return p
  }
  node(element) {
    let currentNode = this.root
    while (currentNode && currentNode.element !== element) {
      let compare = element - currentNode.element
      if (compare > 0) {
        currentNode = currentNode.right
      } else {
        currentNode = currentNode.left
      }
    }
    return currentNode
  }
  remove(element) {
    let node = this.node(element)
    if (node === null) return
    this.size--
    if (node.left && node.right) {
      let pre = this.successor(node)
      let element = pre.element
      this.remove(pre.element)
      node.element = element
    } else if (node.left || node.right) {
      let replace = node.left || node.right
      if (!node.parent) return (this.root = replace)
      replace.parent = node.parent
      if (node === node.parent.left) {
        node.parent.left = replace
      } else {
        node.parent.right = replace
      }
    } else {
      if (!node.parent) return (this.root = null)
      if (node.parent.left === node) {
        node.parent.left = null
      } else {
        node.parent.right = null
      }
    }
  }
}
let tree = new Tree()
tree.add(1)
tree.add(2)
tree.add(13)
tree.add(24)
tree.add(8)
// tree.levelOrderTraversal((node) => {
//   console.log(node)
// })
// tree.invertTree()
tree.remove(13)
console.dir(tree, { depth: 5 })
