import React from 'react'
import ReactDOM from 'react-dom'
import TodoApp from '../views/main.jsx'

window.onload = () => {
  ReactDOM.render(<TodoApp />, document.getElementById('app'))
}
