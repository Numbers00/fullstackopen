// can be import express from 'express', below is CommonJS, "import express" is for ES6 and above
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const Person = require('./models/person');

// middlewares
app.use(express.static('build'));
app.use(express.json());
app.use(cors());
app.use(morgan(function (tokens, req, res) {
  let params = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ');
  if (tokens.method(req, res) === 'POST') {
    params += ` ${JSON.stringify(req.body)}`;
  }
  return params;
}));

app.get('/info', (request, response) => {
  Person
    .find({})
    .then((persons) => {
      response.send(
        `<div>
          <p>Phonebook has info for ${persons.length} people</p>
          <p>${new Date()}</p>
        </div>`
      );
    })
    .catch(() => {
      response.status(500).end();
    });
});

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => {
      console.log(error);
      response.status(500).end();
    });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/api/persons', (request, response, next) => {
  const BODY = request.body;
  if ('name' in BODY && 'number' in BODY) {
    if (BODY.name.length && BODY.number.length) {
      Person
        .find({})
        .then((persons) => {
          if (persons.map(e => e.name).includes(BODY.name)) {
            return response.status(400).json({
              error: 'name must be unique'
            });
          } else {
            const NEW_PERSON = new Person({
              name: BODY.name,
              number: BODY.number
            });
            NEW_PERSON
              .save()
              .then(addedPerson => {
                response.json(addedPerson);
              })
              .catch((error) => {
                next(error);
              });
          }
        })
        .catch((error) => {
          next(error);
        });
      return;
    }
  }

  return response.status(400).json({
    error: 'POST request must have the person\'s name and number'
  });
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => {
      next(error);
    });
});

app.put('/api/persons/:id', (request, response, next) =>  {
  const BODY = request.body;
  const PERSON = {
    name: BODY.name,
    number: BODY.number,
  };

  Person
    .findByIdAndUpdate(
      request.params.id,
      PERSON,
      { new: true, runValidators: true, context: 'query' }
    )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
