// event.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let eventSchema = new Schema({
  name: {type: String, required: true, index: true},
  address: {type: String},
  lat: {type: Number},
  lng: {type: Number},
  description: {type: String},
  createdAt: {type: Date, 'default': Date.now},
  updatedAt: {type: Date, 'default': Date.now}
});

let eventModel = mongoose.model('event', eventSchema);

export default eventModel;