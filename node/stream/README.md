## 流的优势
1. 时间效率：流的分段处理可以同时操作多个数据chunk
2. 空间效率：同一时间，流无需占据大内存空间
3. 使用方便：流容易管理

## node 中流的分类
1. Stream 模块实现了几中流
   1. Readable：可读流，实现数据的读取
   2. Writeable：可写流，实现数据的写操作
   3. Duplex：双工流，即可读可写，websocket
   4. Transform：转换流，可读可写，用于实现数据的转换
2. 所有的流都继承了 EventEmitter 模块