// A Growing React Component

// A problem in React where HOC's can be used as a solution.  Let's assume
// the app has a TodoList component.

function App(props) {
  return (
    <TodoList todos={props.todos} />
  )
}

function TodoList({ todos }) {
  return (
    <div>
      { todos.map(todo => <TodoItem key={ todo.id } todo={ todo } />)}
    </div>
  )
}

// Now let's examine the "edge cases."

// What happens when the todos are null?  A conditional rendering can help:

function TodoList({ todos }) {
  if (!todos) {
    return null
  }

  return (
    <div>
      { todos.map(todo => <TodoItem key={ todo.io } todo={ todo } />)}
    </div>
  )
}

// And what happens when your todos are not null but empty?  

function TodoList({ todos }) {
  if (!todos) {
    return null
  }

// conditional function
  if (!todos.length) {
    return (
      <div>
        <p>You have no Todos</p>
      </div>
    )
  }

  return (
    <div>
      { todos.map(todo => <TodoItem key={ todo.io } todo={ todo } />)}
    </div>
  )
}

// Want to show a loading indicator?
function TodoList({ todos, isLoadingTodos }) {
  if (isLoadingTodos) {
    return (
      <div>
        <p>Loading todos ...</p>
      </div>
    );
  }

  if (!todos) {
    return null;
  }

  if (!todos.length) {
    return (
      <div>
        <p>You have no Todos.</p>
      </div>
    );
  }

  return (
    <div>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}

// That's a lot of edge cases!  Let's see how a HOC can help so that the TodoList
// doesn't have to worry about it.

/*
    Higher order components usually take a component and optional arguments as input and return an enhanced component of the input component.  The goal here is to take care of all of the edge cases from the TodoList component.
*/

// Starting with teh case where the todos are null:

function TodoList({ todos, isLoadingTodos }) {
  if (isLoadingTodos) {
    return (
      <div>
        <p>Loading todos ...</p>
      </div>
    );
  }

// SAYONARA SUCKA!

  if (!todos.length) {
    return (
      <div>
        <p>You have no Todos.</p>
      </div>
    );
  }

  return (
    <div>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}

// Now let's create the HOC to take control of this part of things.
// HOC's by convention start with "with."

function withTodosNull(Component) {
  return function(props) {
    ...
  }
}

/*
  withTodosNull is a HOC that takes an input and returns another function.  This is not returning another component yet, but it will return a functional stateless component.  HOCs can return ES6 class components as well.  A functional stateless component should be sufficient for conditional rendering.  If this.state or React lifecycle methods need to me accessed then return an ES6 class component.
*/

// Let's add the rendered output of the enhanced component.
function withTodosNull(Component) {
  return function (props) {
    return !props.todos
      ? null
      : <Component { ...props } />
  }
}

/* 
  The HOC uses the ternary operator to determine what to show based on the input condition.  If the todos are null, it shows nothing.  If they're not, it shows the input components.

  All of the props are passed down the component tree to the input component.  For instance, using withTodosNull to enhance the TodoList would pass all of the props through the HOC as input wiht the JavaScript spread operator.
*/

// Let's tidy it up a bit with ES6
const withTodosNull = (Component) => (props) =>{
    return !props.todos
      ? null
      : <Component { ...props } />
  }
}

  const TodoList = ({ todos }) => {
    ...
  }

  const TodoListWithNull = withTodosNull(TodoList)

  function App(props) {
    return (
      <TodoListWithNull todos={ props.todos } />
    )
  }
}

// Clearly, HOCs are reusable!  Let's finish it off with the other two edge cases, loading indicator and empty list.

const withTodosEmpty = (Component) => (props) =>
  !props.todos.length
    ? <div><p>You have no Todos.</p></div>
    : <Component { ...props } />

const withLoadingIndicator = (Component) => (props) =>
  props.isLoadingTodos
    ? <div><p>Loading todos...</p></div>
    : <Component { ...props } />

// One issue here is that the withLoadingIndicator passes all of the props to the input components, even through it's not interested in isLoadingTodos.  ES6 once again to the rescue!  Using rest destructuring (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

const withLoadingIndicator = (Component) => ({ isLoadingTodos, ...others }) =>
  isLoadingTodos
    ? <div><p>Loading todos...</p></div>
    : <Component { ...others } />

// Now the isLoadingTodos is split out from the props and only used in the HOC.  All the "others" props are passed to the input component.

// Let's use all HOCs for our TodoList component:
const withTodosNull = (Component) => (props) =>
  ...

const withTodosEmpty = (Component) => (props) =>
  ...

const withLoadingIndicator = (Component) => ({ isLoadingTodos, ...others }) =>
  ...

function TodoList({ todos }) {
  ...
}

const TodoListOne = withTodosEmpty(TodoList);
const TodoListTwo = withTodosNull(TodoListOne);
const TodoListThree = withLoadingIndicator(TodoListTwo);

function App(props) {
  return (
    <TodoListThree
      todos={props.todos}
      isLoadingTodos={props.isLoadingTodos}
    />
  );
}

// Oooh, some fancy chaining!  The order to apply the HOCs should be the same as in the previous TodoList with all implemented conditional renderings.  Otherewise you would of course run into bugs because of the length check on a null todos object.

// So now what's left in the TodoList component?
function TodoList({ todos, isLoadingTodos }) {
  return (
    <div>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}

// Gone are the conditional renderings, this only renders todos.

// And if this seems tedious...

const TodoListOne = withTodosEmpty(TodoList);
const TodoListTwo = withTodosNull(TodoListOne);
const TodoListThree = withLoadingIndicator(TodoListTwo);

// Why not wrap them all together?!  
const TodoListsWithConditionalRendering = withLoadingIndicator(withTodosNull(withTodosEmpty(TodoList)))

// Well but that kinda sucks!  How about some functional programming?

// At this point the author points the fair user to the library Recompose.  The author of Recompose, however, suggests using Hooks!  So onward to hooks!
