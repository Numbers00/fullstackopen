const mongoose = require('mongoose');

const URL = process.env.MONGODB_URI;

console.log('connecting to', URL);
mongoose
  .connect(URL)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        if (v.includes('-')) {
          return /^\d{2}-\d+$|^\d{3}-\d+$/.test(v);
        }
      }
    },
    required: true
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);
