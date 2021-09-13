class Node {
  constructor(val, prev, next) {
    this.val = val
    this.prev = prev
    this.next = next
  }
}
class LinkList {
  constructor() {
    this.size = 0
    this.head = null
    this.tail = null
  }
  get(index) {
    if (index < 0 || index >= this.size) {
      throw new Error('index error')
    }
    if (this.size === 0) return null
    let current
    if (index > this.size >> 1) {
      current = this.tail
      for (let i = this.size - 1; i > index; i--) {
        current = current.prev
      }
    } else {
      current = this.head
      for (let i = 0; i < index; i++) {
        current = current.next
      }
    }
    return current
  }
  add(index, val) {
    if (index < 0 || index >= this.size) {
      throw new Error('index error')
    }
    if (index === this.size) {
      let oldLast = this.tail
      this.tail = new Node(val, oldLast, this.head)
      if (oldLast) {
        oldLast.next = this.tail
        this.head.prev = this.tail
      } else {
        this.head = this.tail
        this.tail.next = this.tail
        this.tail.prev = this.tail
      }
    } else {
      let nextNode = this.get(index)
      let prevNode = nextNode.prev
      let node = new Node(val, prevNode, nextNode)
      prevNode.next = node
      nextNode.prev = node
      if (index === 0) {
        this.head = node
      }
    }
  }
  remove(index) {
    if (index < 0 || index >= this.size) {
      throw new Error('index error')
    }
    if (this.size == 1) {
      this.tail = null
      this.head = null
    } else {
      let node = this.get(index)
      let prevNode = node.prev
      let nextNode = node.next
      prevNode.next = nextNode
      nextNode.prev = prevNode
      if (index == 0) {
        this.head = nextNode
      }
      if (index == this.size - 1) {
        this.tail = prevNode
      }
      this.size--
    }
  }
}
