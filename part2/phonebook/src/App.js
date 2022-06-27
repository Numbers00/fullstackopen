import { useState } from 'react'

const Filter = (props) => {
  const {nameFilter, handleFilterChange} = props
  return (
    <div>
      filter shown with <input value={nameFilter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = (props) => {
  const {newName, handleNameChange, newNumber, handleNumberChange,  handleFormSubmit} = props
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
            <p key={e.name}>{e.name} {e.number}</p> :
                '';}
      )}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  const handleFilterChange = (event) => {
    setNameFilter(event.target.value);
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (persons.filter(e => e.name === newName).length > 0) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat({name: newName, number: newNumber}));
      setNewName('');
      setNewNumber('');
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
