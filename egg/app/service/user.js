const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
class UserService extends Service {
  get User() {
    return this.app.model.User;
  }
  findByUsername(username) {
    return this.User.findOne({ username });
  }
  findByEmail(email) {
    return this.User.findOne({ email }).select('+password');
  }
  findById(id) {
    return this.User.findById(id)
  }
  async createUser(data) {
    data.password = this.ctx.helper.md5(data.password);
    const user = new this.User(data);
    await user.save();
    return user;
  }
  createToken(data) {
    const token = jwt.sign(data, this.app.config.jwt.secret, {
      expiresIn: this.app.config.jwt.expiresIn,
    });
    return token;
  }
  verifyToken(token) {
    return jwt.verify(token, this.config.jwt.secret);
  }
  updateUser(data) {
    return this.User.findByIdAndUpdate(this.ctx.user._id, data, {
      new: true,
    });
  }
  async subscribe(userId, channelId) {
    const { Subscription, User } = this.app.model;
    const record = await Subscription.findOne({
      user: userId,
      channel: channelId,
    });
    const user = await User.findById(channelId);
    if (!record) {
      await new Subscription({
        user: userId,
        channel: channelId,
      }).save();
      user.subscribersCount++;
      await user.save();
    }
    return user;
  }
  async unsubscribe(userId, channelId) {
    const { Subscription, User } = this.app.model;
    const record = await Subscription.findOne({
      user: userId,
      channel: channelId,
    });
    const user = await User.findById(channelId);
    if (record) {
      await record.remove(); // 删除订阅记录
      // 更新用户的订阅数量
      user.subscribersCount--;
      await user.save(); // 更新到数据库中
    }
    // 3. 返回用户信息
    return user;
  }
}

module.exports = UserService;
