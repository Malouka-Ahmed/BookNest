const mongoose = require('mongoose');

// One document = one book on one user's reading list.
// Status values are shared with userController.getSummary (Profile page).
const STATUSES = ['want-to-read', 'reading', 'completed'];

const userBookSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    status: { type: String, enum: STATUSES, default: 'want-to-read' },
    startedAt: { type: Date },
    finishedAt: { type: Date },
  },
  { timestamps: true }
);

// A user can only have each book once in their library
userBookSchema.index({ user: 1, book: 1 }, { unique: true });

// Keep the reading dates in sync with the status
userBookSchema.pre('save', function () {
  if (!this.isModified('status')) return;
  if (this.status === 'reading' && !this.startedAt) this.startedAt = new Date();
  if (this.status === 'completed') {
    if (!this.startedAt) this.startedAt = new Date();
    this.finishedAt = new Date();
  }
  if (this.status !== 'completed') this.finishedAt = undefined;
});

const UserBook = mongoose.model('UserBook', userBookSchema);
UserBook.STATUSES = STATUSES;

module.exports = UserBook;
