import { useEffect, useState } from 'react';
import axios from 'axios';

import personService from './services/personService.js';

const Filter = (props) => {
  const {nameFilter, handleFilterChange} = props;
  return (
    <div>
      filter shown with <input value={nameFilter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = (props) => {
  const {newName, handleNameChange, newNumber, handleNumberChange,  handleFormSubmit} = props;
  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      &nbsp;
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      &nbsp;
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = (props) => {
  const {persons, nameFilter} = props
  return (
    <>
      {persons.map(e => {
        return e.name.toLowerCase().includes(nameFilter) ? 
            <p key={e.id}>{e.name} {e.number}</p> :
                '';}
      )}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  const getPersons = () => {
    personService
      .getAll()
      .then(returnedPersons => {
        setPersons(returnedPersons);
      })
      .catch(error => {
        alert(error.response);
      });
  }

  useEffect(getPersons, []);

  const handleFilterChange = (event) => {
    setNameFilter(event.target.value);
  }

  const createPerson = () => {
    personService
      .create({
        name: newName,
        number: newNumber
      })
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        alert(error.response);
      });
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (persons.filter(e => e.name === newName).length > 0) {
      alert(`${newName} is already added to phonebook`);
    } else {
      createPerson();
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nameFilter={nameFilter} handleFilterChange={handleFilterChange} />
      &nbsp;
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleFormSubmit={handleFormSubmit}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} nameFilter={nameFilter} />
    </div>
  )
}

export default App;
