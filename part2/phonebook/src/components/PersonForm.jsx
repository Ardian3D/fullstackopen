const PersonForm = ({ onSubmit, newName, onNameChange, newNumber, onNumberChange }) => (
  <form onSubmit={onSubmit}>
    <label className="field">
      <span>Name</span>
      <input required value={newName} onChange={onNameChange} />
    </label>
    <label className="field">
      <span>Number</span>
      <input required value={newNumber} onChange={onNumberChange} />
    </label>
    <button type="submit">Add / update</button>
  </form>
)

export default PersonForm
