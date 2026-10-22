const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, "token is required to be added in blacklist"]
  },
  // Token will be automatically removed after 7 days
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: '7d'
  }
}, { timestamps: true });

const tokenBlacklistModel = mongoose.model('tokenBlacklistModel', blacklistTokenSchema);

module.exports = tokenBlacklistModel;


