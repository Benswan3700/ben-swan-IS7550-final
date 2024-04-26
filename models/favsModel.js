const mongoose = require('mongoose');

const mustacheFavoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mustacheStyleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MustacheStyle',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MustacheFavorite = mongoose.model('MustacheFavorite', mustacheFavoriteSchema);

module.exports = MustacheFavorite;
