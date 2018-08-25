'use strict';

const mongoose = require('mongoose');

// this is our schema to represent a restaurant
const restaurantSchema = mongoose.Schema({
  name: { type: String, required: true },
  borough: { type: String, required: true },
  cuisine: { type: String, required: true },
  address: {
    building: String,
    // coord will be an array of string values
    coord: [String],
    street: String,
    zipcode: String
  },
  // grades will be an array of objects
  grades: [
    {
      date: Date,
      grade: String,
      score: Number
    }
  ]
});

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the address object
// we're storing in Mongo.
restaurantSchema.virtual('addressString').get(function() {
  return `${this.address.building} ${this.address.street}`.trim();
});

// this virtual grabs the most recent grade for a restaurant.
restaurantSchema.virtual('grade').get(function() {
  const gradeObj =
    this.grades.sort((a, b) => {
      return b.date - a.date;
    })[0] || {};
  return gradeObj.grade;
});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
restaurantSchema.methods.serialize = function() {//property like a virtual, but it is a function that belongs to an object. serialize is for building the object that we are going to send over the network
  return {
    id: this._id,
    name: this.name,
    cuisine: this.cuisine,
    borough: this.borough,
    grade: this.grade,
    address: this.addressString
  };
};

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Restaurant = mongoose.model('Restaurant', restaurantSchema);//this collection is going to use this schema, and together with the collection and the schema we are making a model

module.exports = { Restaurant };//object that handles the whole collection and allows us to get individual restaurants through it
