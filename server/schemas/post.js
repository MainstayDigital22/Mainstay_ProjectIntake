const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: { type: String, required: true },
  name: { type: String, required: true, default:"N/A" },
  englishName: String,
  title: String,
  subtitle: String,
  description: String,
  year: Number,
  media: [{
    link: { type: String, required: true },
    extension: { type: String, required: true }, //png, jpg, gif, mp4....
    order: { type: Number, required: true },
    description: String
  }], //array of media
  category: [String], //industry, gender, and other tags to sort posts
  layout: { type: Number, required: true, default:0 }, //layout id for different formats
  created: { type: Date, default: Date.now, required: true },
  updated: { type: Date, default: Date.now, required: true },
  order:{ type: Number, required: true, default:0 },
  status: { type: Number, min:0,max:3,required: true } //0: pending, 1: approved, 2:rejected 3:archived
});

const Post = mongoose.model('Posts', postSchema);

module.exports = Post;