// business.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

import mongoose from 'mongoose';
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

let businessSchema = new Schema({
  name: {type: String, required: true, index: true},
  categories: [{type: ObjectId, ref: 'category'}],
  address: {type: String},
  lat: {type: Number},
  lng: {type: Number},
  createdAt: {type: Date, 'default': Date.now},
  updatedAt: {type: Date, 'default': Date.now}
});

let businessModel = mongoose.model('business', businessSchema);

export default businessModel;