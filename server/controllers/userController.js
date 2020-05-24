const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.getUsers = async (req, res) => {
  const fields = '_id name email createdAt updatedAt';
  const users = await User.find().select(fields);
  res.json(users);
};

exports.getAuthUser = () => { };

exports.getUserById = () => { };

exports.getUserProfile = () => { };

exports.getUserFeed = () => { };

exports.uploadAvatar = () => { };

exports.resizeAvatar = () => { };

exports.updateUser = () => { };

exports.deleteUser = () => { };

exports.addFollowing = () => { };

exports.addFollower = () => { };

exports.deleteFollowing = () => { };

exports.deleteFollower = () => { };
