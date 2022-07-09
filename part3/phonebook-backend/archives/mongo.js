// const mongoose = require('mongoose');

// if (process.argv.length < 3) {
//   console.log('Please provide the password as an argument: node index.js <password>');
//   process.exit(1);
// }

// const PASSWORD = process.argv[2];
// const URL = `mongodb+srv://Numbers00:${PASSWORD}@cluster0.mozfuxe.mongodb.net/?retryWrites=true&w=majority`;

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// });

// const Person = mongoose.model('Person', personSchema);

// if (process.argv.length === 5) {
//   const NEW_NAME = process.argv[3];
//   const NEW_NUMBER = process.argv[4];
//   mongoose
//     .connect(URL)
//     .then((result) => {
//       const NEW_PERSON = new Person({
//         name: NEW_NAME,
//         number: NEW_NUMBER
//       });

//       return NEW_PERSON.save();
//     })
//     .then(() => {
//       console.log(`Added ${NEW_NAME} ${NEW_NUMBER} to phonebook`);
//       return mongoose.connection.close();
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// } else if (process.argv.length === 3) {
//   mongoose
//     .connect(URL)
//     .then((result) => {
//       Person
//         .find({})
//         .then((result2) => {
//         result2.forEach(e => {
//           console.log('phonebook:');
//           console.log(e);
//         })
//         mongoose.connection.close();
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// } else {
//   console.log(
//     `
//       the arguments are wrong; either use:
//       node mongo.js <password> for viewing persons
//       node mongo.js <password> <new name> <new password> for adding another person
//       (note) enclose argument in "<new name>" for example if you're adding a string that contains space(s)
//     `
//   );
// }
