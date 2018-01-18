import React from 'react'
import { render } from 'react-dom'

const apiUrl = 'http://localhost:5000/api/todo'

const Title = ({todoCount}) => {
  return (
    <header>
      <h1>TODO List <span className='badge'>{todoCount}</span></h1>
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
        <button onClick={() => {remove(todo.key)}} type="button" className="btn btn-danger"><span className="glyphicon glyphicon-remove"></span> Delete</button>
      </span>
    </li>
  )
}

const TodoList = ({items, remove}) => {
  const todoElements = items.map((todo) => {
    return (<TodoItem todo={todo} key={todo.key} remove={remove}/>)
  })
  return (
    </div>
  )
}

export default class TodoApp extends React.Component {
  constructor(props) {
    // Pass props to parent class
    super(props)
    // Set initial state
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    const component = this
    fetch(apiUrl, {
       method: 'get'
    }).then((response) => {
      return response.json()
    }).then((items) => {
    	component.setState({items: items})
    }).catch((err) => {
      // TODO: Get some better error handling in here.
      component.setState({items: [{key: Date.now(), title: 'FAIL: Start the server at ' + apiUrl}]})
    })
  }

  addTodo(val) {
    const component = this
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
      component.setState({items: component.state.items})
    }).catch((err) => {
      // TODO: Get some better error handling in here.
      component.state.items.push({key: 0, title: 'Failed to add TODO item. FIX YOUR CODEZ!'})
      component.setState({items: component.state.items})
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
      component.setState({items: remainder})
    }).catch((err) => {
      // TODO: Get some better error handling in here.
      component.state.items.push({key: 0, title: 'Failed to delete TODO item. FIX YOUR CODEZ!'})
      component.setState({items: component.state.items})
    })
  }

  render() {
      return (
        <div>
          <Title todoCount={this.state.items.length}/>
          <TodoForm addTodo={this.addTodo.bind(this)} />
          <TodoList
             items={this.state.items}
             remove={this.handleRemove.bind(this)}
           />
        </div>
      )
    }
}
