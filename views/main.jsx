import React from 'react'
import { render } from 'react-dom'
//HELLO NDC!!
const apiUrl = 'http://localhost:5000/api/todo'

const Title = ({todoCount}) => {
  return (
    <header>
      <h1>To-do List <span className='badge'>{todoCount}</span></h1>
    </header>
  )
}

const Messenger = ({message}) => {
  if (message) {
    return (<div className="error">
      <h2>{message}</h2>
    </div>)
  }
  return null
}
// Please hurry up.
const Title = ({todoCount}) => {
  return (
    <header>
      <h1>To-do List <span className='badge'>{todoCount}</span></h1>
    </header>
  )
}

const TodoForm = ({addTodo}) => {
  let input
  return (
    <form onSubmit={(e) => {
        e.preventDefault()
        addTodo(input.value)
        input.value = ''
      }}>
      <input ref={element => { input = element }} placeholder="enter task" />
      <button type="submit">add</button>
    </form>
  )
}

const TodoItem = ({todo, remove}) => {
  return (
    <li className="list-group-item clearfix">
      <span>{todo.title}</span>
      <span className="pull-right button-group">
        <button onClick={() => {remove(todo.key)}} type="button" className="btn" aria-label="Delete"><span className="glyphicon glyphicon-remove"></span></button>
      </span>
    </li>
  )
}

const TodoList = ({items, remove}) => {
  const todoElements = items.map((todo) => {
    return (<TodoItem todo={todo} key={todo.key} remove={remove}/>)
  })
  return (
    <div className='list-group-container'>
      <ul className="list-group">{todoElements}</ul>
    </div>
  )
}

export default class TodoApp extends React.Component {
  constructor(props) {
    // Pass props to parent class
    super(props)
    // Set initial state
    this.state = {
      items: [],
      message: ''
    }
  }

  componentDidMount() {
    const component = this
    fetch(apiUrl, {
       method: 'get'
    }).then((response) => {
      return response.json()
    }).then((items) => {
    	component.setState({items: items, message: ''})
    }).catch((err) => {
      // TODO: Get some better error handling in here.
      component.setState({items: [], message: 'FAILURE! Please start the server at ' + apiUrl})

    })
  }

  addTodo(val) {
    const component = this

    if (!val) {
      component.setState({item: component.state.items, message: 'The task cannot be empty'})
      return
    }

    fetch(apiUrl, {
    	method: 'post',
      headers: new Headers({
    		'Content-Type': 'application/json'
    	}),
    	body: JSON.stringify({
    		title: val,
    		key: 0
    	})
    }).then((response) => {
      return response.json()
    }).then((newTodo) => {
      component.state.items.push(newTodo)
      component.setState({items: component.state.items, message: ''})
    }).catch((err) => {
      component.setState({items: component.state.items, message: 'FAIL: to add TODO item. Fix the code!'})

    })
  }

  handleRemove(id) {
    const component = this
    fetch(apiUrl + '/' + id, {
    	method: 'delete'
    }).then((response) => {
      // Filter all todos except the one to be removed
      const remainder = component.state.items.filter((todo) => {
        if(todo.key !== id) return todo
      })
      component.setState({items: remainder, message: ''})
    }).catch((err) => {
      // TODO: Get some better error handling in here.
      component.setState({items: component.state.items, message: 'FAIL: to delete TODO item. Fix the code!'})
    })
  }

  render() {
      return (
        <div>
          <Title todoCount={this.state.items.length}/>
          <Messenger message={this.state.message} />
          <TodoForm addTodo={this.addTodo.bind(this)} />
          <TodoList
             items={this.state.items}
             remove={this.handleRemove.bind(this)}
           />
        </div>
      )
    }
}
