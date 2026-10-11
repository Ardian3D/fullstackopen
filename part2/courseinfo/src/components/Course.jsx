const Header = ({ title }) => <h2>{title}</h2>

const Part = ({ name, exercises }) => (
  <p>{name} {exercises}</p>
)

const Content = ({ parts }) => (
  <div>
    {parts.map(part => (
      <Part key={part.id} name={part.name} exercises={part.exercises} />
    ))}
  </div>
)

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return <p><strong>Total of {total} exercises</strong></p>
}

const Course = ({ course }) => (
  <section className="course">
    <Header title={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </section>
)

export default Course
