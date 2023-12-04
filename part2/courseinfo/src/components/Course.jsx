const Course = ({ course }) => {

    const Header = ({ course }) => <h1>{course}</h1>
  
    const Total = ({parts}) => {
      const exercises = parts.map(part => part.exercises)
      const sum = exercises.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
      
      return(
        <h4>total of {sum} exercises</h4>
      )
    }
  
    const Part = ({ part }) => 
      <p>
        {part.name} {part.exercises}
      </p>
  
    const Content = ({ parts }) => 
      <>
        {parts.map(part => 
            <Part key={part.id} part={part} />
          )}    
      </>
  
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts = {course.parts} />
      </div>
    )
  }

export default Course