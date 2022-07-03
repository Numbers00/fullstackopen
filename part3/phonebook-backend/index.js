// can be import express from 'express', below is CommonJS, "import express" is for ES6 and above
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

// middleware
app.use(express.json());
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
app.use(cors());
app.use(express.static('build'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

app.get('/info', (request, response) => {
  response.send(
    `<div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    </div>`
  );
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const ID = Number(request.params.id);
  const PERSON = persons.find(e => e.id === ID);

  if (PERSON) {
    response.json(PERSON);
  } else {
    response.status(404).end();
  }
});

app.post('/api/persons', (request, response) => {
  const USED_IDS = persons.map(e => e.id);
  let rand = Math.round(Math.random()*10000);
  while (USED_IDS.includes(rand)) {
    rand = Math.round(Math.random()*10000);
  }

  const BODY = request.body;
  if ('name' in BODY && 'number' in BODY) {
    if (BODY.name.length && BODY.number.length) {
      if (persons.map(e => e.name).includes(BODY.name)) {
        return response.status(400).json({
          error: 'name must be unique'
        });
      }
      let new_person = {
        id: rand,
        name: BODY.name,
        number: BODY.number
      };
      persons = persons.concat(new_person);

      return response.json(new_person);
    }
  }

  return response.status(400).json({
    error: 'POST request must have the person\'s name and number'
  });
});

app.delete('/api/persons/:id', (request, response) => {
  const ID = Number(request.params.id);
  persons = persons.filter(e => e.id !== ID);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port  ${PORT}`);
})
