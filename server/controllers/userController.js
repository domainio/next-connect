const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.getUsers = async (req, res) => {
  const fields = '_id name email createdAt updatedAt';
  const users = await User.find().select(fields);
  res.json(users);
};

exports.getAuthUser = (req, res) => {
  if (!req.isAuthUser) {
    res.status(403).json({
      message: 'your are unauth. plase sign-in or sign-up'
    })
    return res.redirect('/signin');
  }
  res.json(req.user);
};

exports.getUserById = async (req, res, next, id) => {
  const user = await User.findOne({ _id: id });
  req.profile = user;
  const profileId = mongoose.Types.ObjectId(req.profile._id)
  if (profileId.equals(req.user._id)) {
    req.isAuthUser = true;
    return next();
  }
  next();
};

exports.isUserAuth = async (req, res, next, id) => {
  if (!id) {
    req.isAuthUser = false;
    return next();
  }
  const user = await User.findOne({ _id: id });
  if (!user) {
    req.isAuthUser = false;
    return next();
  }
  req.profile = Object.assign({}, user);
  const profileId = mongoose.Types.ObjectId(req.profile._id)
  if (profileId.equals(req.profile._id)) {
    req.isAuthUser = true;
    return next();
  }
  next();
};

exports.getUserProfile = (req, res, next) => {
  if (!req.profile) {
    return res.status(404).json({
      message: 'no user found.'
    })
  }
  const { profile } = req;
  res.send(profile);
};

exports.getUserFeed = () => {

};

exports.uploadAvatar = () => {

};

exports.resizeAvatar = () => {

};

exports.updateUser = () => {

};

exports.deleteUser = async (req, res) => {
  if (!req.isAuthUser) {
    return res.status(400).json({ message: 'you are not autorized to do this action!' });
  }
  const { userId } = req.params;
  const deletedUser = await User.findOneAndDelete({ _id: userId });
  res.json(deletedUser);
};

exports.addFollowing = async (req, res, next) => {
  const { followId } = req.body;
  await User.findOneAndUpdate(
    { _id: req.user._id, },
    { $push: { following: followId } }
  )
  next();
};

exports.addFollower = async (req, res) => {
  const { followId } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: followId },
    { $push: { followers: req.user._id } },
    { new: true }
  )
  res.json(user);
};

exports.deleteFollowing =  async (req, res, next) => {
  const { followId } = req.body;
  await User.findOneAndUpdate(
    { _id: req.user._id, },
    { $pull: { following: followId } }
  )
  next();
};

exports.deleteFollower = async (req, res) => {
  const { followId } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: followId },
    { $pull: { followers: req.user._id } },
    { new: true }
  )
  res.json(user);
};
