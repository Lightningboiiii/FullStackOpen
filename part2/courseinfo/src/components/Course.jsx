const Header = ({ course }) => <h1>{course.name}</h1>

const Content = ({ course }) => {
  return (
    course.parts.map(p =>
      <Part key={p.id} name={p.name} exercise={p.exercises}/>
    )
  )
}

const Part = ({ name, exercise }) => <p>{name} {exercise}</p>

const Total = ({ course }) => {
  const total = course.parts.reduce((s, p) => s + p.exercises, 0)
  return <p><b>Total of exercises {total} exercises</b></p>
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )
}

export default Course