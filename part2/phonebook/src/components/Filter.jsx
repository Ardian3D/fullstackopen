const Filter = ({ value, onChange }) => (
  <label className="field">
    <span>Filter shown with</span>
    <input value={value} onChange={onChange} placeholder="Search names" />
  </label>
)

export default Filter
