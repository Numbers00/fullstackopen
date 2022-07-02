import { useEffect, useState } from 'react';

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
  const {newName, handleNameChange, newNumber, handleNumberChange,  handleFormSubmit, successMessage, errorMessage} = props;

  const successMessageStyle = {
    border: '3px solid green',
    borderRadius: '8px',
    backgroundColor: 'lightgray',
    padding: '5px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'green'
  }
  const errorMessageStyle = {
    border: '3px solid red',
    borderRadius: '8px',
    backgroundColor: 'lightgray',
    padding: '5px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'red'
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div  style={{display: 'flex'}}>
        <h2>or add a new person here</h2>&nbsp;
        {successMessage !== '' ? <p style={successMessageStyle}>{successMessage}</p> : ''}
        {errorMessage !== '' ? <p style={errorMessageStyle}>{errorMessage}</p> : ''}
      </div>
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
  const {persons, nameFilter, handleDelete} = props;
  return (
    <>
      {persons.map(e => {
        return e.name.toLowerCase().includes(nameFilter) ? 
            <p key={e.id}>
              <span>{e.name} {e.number}</span>&nbsp; 
              <button onClick={() => handleDelete(e.id)}>delete</button>
            </p> : '';}
      )}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage]  = useState('');

  const getPersons = () => {
    personService
      .getAll()
      .then(returnedPersons => {
        setPersons(returnedPersons);
      })
      .catch(error => {
        alert(`Error ${error.response.status}, ${error.response.statusText}`);
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
      .then(addedPerson => {
        setPersons(persons.concat(addedPerson));
        setSuccessMessage(`Added ${addedPerson.name}`);
        setErrorMessage('');
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        alert(`Error ${error.response.status}, ${error.response.statusText}`);
        setSuccessMessage('');
      });
  }

  const updateNumber = () => {
    const TARGET = persons.find(e => e.name === newName);
    personService
      .update(TARGET.id, {...TARGET, number: newNumber})
      .then(changedPerson => {
        setPersons(persons.map(e => e.id !== TARGET.id ? e : changedPerson));
        setSuccessMessage(`Edited ${changedPerson.name}'s number`);
      })
      .catch(error => {
        if (error.response.status === 404) {
          setErrorMessage(`Information of ${TARGET.name} might have been removed from the server`);
        } else {
          alert(`Error ${error.response.status}, ${error.response.statusText}`);
        }
        setSuccessMessage('');
      });
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (persons.filter(e => e.name === newName).length > 0) {
      if (persons.find(e => e.name === newName).number === newNumber) {
        alert(`${newName} is already added to phonebook, change the number to edit ${newName}'s number`);
      } else {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
          updateNumber();
        }
      }
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

  const handleDelete = (id) => {
    if (window.confirm(`Delete ${persons.find(e => e.id === id).name}?`)) {
      personService
      .remove(id, persons)
      .then(() => {
        setPersons(persons.filter(e => e.id !== id));
      })
      .catch(error => {
        console.log(error);
        if (error.response.status === 404) {
          setErrorMessage(`Information of ${persons.find(e => e.id === id).name} might have been removed from the server`);
        } else {
          alert(`Error ${error.response.status}, ${error.response.statusText}`);
        }
        setSuccessMessage('');
      });
    }
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
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} nameFilter={nameFilter} handleDelete={handleDelete} />
    </div>
  )
}

export default App;
