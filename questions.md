## 1. What is the difference between Component and PureComponent? Give an example where it might break my app.

- React.Component re-renders whenever its state or props change, unless shouldComponentUpdate() is overridden
- React.PureComponent implements shouldComponentUpdate() with a shallow comparison of props and state, re-rendering only if they differ
- Using React.Component with complex object props can lead to unnecessary re-renders and performance issues.

An example scenario where using React.Component instead of React.PureComponent might break your app involves a component that receives complex objects as props and updates these objects frequently. If the component uses React.Component, it will re-render every time the parent component re-renders or the props change, even if the actual data hasn't changed. This can lead to unnecessary re-renders and degrade performance, especially in larger applications

```sh
// Using React.Component
class MyComponent extends React.Component {
  render() {
    console.log('MyComponent renders');
    return <div>{this.props.data}</div>;
  }
}

// Using React.PureComponent
class MyPureComponent extends React.PureComponent {
  render() {
    console.log('MyPureComponent renders');
    return <div>{this.props.data}</div>;
  }
}
```

In this example, if the data prop changes, MyComponent will re-render every time, potentially leading to performance issues if data changes frequently. However, MyPureComponent will only re-render if the data prop actually changes, thanks to the shallow comparison performed by React.PureComponent.

## 2.Context + ShouldComponentUpdate might be dangerous. Why is that?

In complex applications using context extensively, components may not update correctly if they use shouldComponentUpdate and don't handle context changes properly. This can lead to parts of the UI not reflecting the current context state. To mitigate this, components should receive context only once, treating it like a dependency injection system, to avoid issues with shouldComponentUpdate blocking context propagation. This approach requires careful design to ensure stable context values throughout the component's lifecycle.

## 3. Describe 3 ways to pass information from a component to its PARENT.

## 1. Callback Functions

One of the most straightforward methods is to use callback functions. This involves defining a function in the parent component that will be called by the child component to pass data back up to the parent.

- Parent Component: Define a callback function that updates the parent's state with the data received from the child.
- Child Component: Call the parent's callback function, passing the data as an argument.

```sh
// Parent Component
class Parent extends React.Component {
  state = {
    childData: null,
  };

  handleCallback = (childData) => {
    this.setState({ childData });
  };

  render() {
    return <Child parentCallback={this.handleCallback} />;
  }
}

// Child Component
function Child({ parentCallback }) {
  const sendData = () => {
    parentCallback("Data from child");
  };

  return <button onClick={sendData}>Send Data</button>;
}
```

## 2. Lifting State Up

Another approach is to "lift the state up" to a common ancestor component. This involves moving the state to the nearest common ancestor of both the parent and child components, and then passing the state and a function to update it down to the child.

- Common Ancestor Component: Holds the state and provides it to both the parent and child components.
- Parent Component: Receives the state and the update function as props.
- Child Component: Calls the update function to modify the state.

```sh
// Common Ancestor Component
class Ancestor extends React.Component {
  state = {
    data: null,
  };

  updateData = (newData) => {
    this.setState({ data: newData });
  };

  render() {
    return (
      <>
        <Parent data={this.state.data} updateData={this.updateData} />
        <Child updateData={this.updateData} />
      </>
    );
  }
}

// Parent Component
function Parent({ data, updateData }) {
  return <div>Data: {data}</div>;
}

// Child Component
function Child({ updateData }) {
  const sendData = () => {
    updateData("Data from child");
  };

  return <button onClick={sendData}>Send Data</button>;
}
```

## 3. Context API

For more complex scenarios where data needs to be shared across many components, the Context API can be used. This allows you to create a global state that can be accessed by any component in the tree, without having to pass props down manually at every level.

- Create a Context: Define a context with React.createContext().
- Provide the Context: Use the Provider component to wrap the part of the tree that needs access to the context.
- Consume the Context: Use the useContext hook in child components to access the context data.

```sh
// Create a Context
const DataContext = React.createContext();

// Parent Component
function Parent() {
  const [data, setData] = React.useState(null);

  return (
    <DataContext.Provider value={{ data, setData }}>
      <Child />
    </DataContext.Provider>
  );
}

// Child Component
function Child() {
  const { data, setData } = React.useContext(DataContext);

  const sendData = () => {
    setData("Data from child");
  };

  return <button onClick={sendData}>Send Data</button>;
}
```

## 4. Give 2 ways to prevent components from re-rendering.

## 1. React.memo

This is a higher-order component that performs a shallow comparison of the current and next props. If the props are the same, React.memo prevents the component from re-rendering. This is particularly useful for functional components that receive props and render based on those props. Here's an example of how to use React.memo:

```sh
const Button = React.memo(() => {
  console.log("Button Rendered!");
  window.alert("Button Rendered");
  return <button onClick="">Press me</button>;
});
```

## 2. useRef Hook

The useRef hook allows you to store a mutable value that persists across renders without causing a re-render when it changes. This is useful for storing values that are used in event handlers or for accessing DOM elements directly without triggering a re-render. Here's an example of using useRef to focus an input field without causing a re-render:

```sh
import React, { useRef, useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        ref={inputRef}
      />
      <button onClick={handleClick}>Focus</button>
    </div>
  );
}
```

In this example, useRef is used to create a reference (inputRef) to the input element. When the button is clicked, the handleClick function focuses the input field using inputRef.current.focus(). Since useRef does not cause a re-render when its value changes, this operation is efficient and does not affect the component's rendering cycle.

## 5. What is a fragment and why do we need it? Give an example where it might break my app.

A fragment, in the context of React, is a syntax that allows developers to group a list of children without adding extra nodes to the DOM. This is particularly useful when a component needs to return multiple elements but you don't want to wrap them in a container element like a <div> because it might introduce unnecessary styling or layout issues. Fragments are a way to keep the structure clean and focused on the content rather than the wrappers.

For example, consider a simple React component that returns two elements:

```sh
const App = () => {
  return (
    <h1>This is heading1 text</h1>
    <p>This is paragraph text</p>
  );
}
```

Without using a fragment, trying to return multiple elements like this will result in a SyntaxError, causing the application to crash in development mode. To fix this, you would typically wrap the elements in a <div> or another suitable container element:

```sh
const App = () => {
  return (
    <div>
      <h1>This is heading1 text</h1>
      <p>This is paragraph text</p>
    </div>
  );
};
```

However, using a fragment allows us to avoid this unnecessary wrapper:

```sh
import React, { Fragment } from 'react';

const App = () => {
  return (
    <Fragment>
      <h1>This is heading1 text</h1>
      <p>This is paragraph text</p>
    </Fragment>
  );
};
```

Using fragments can prevent issues related to unwanted margins or padding that might be introduced by the default styles of certain HTML elements. Additionally, it keeps the JSX cleaner and more readable, especially in components that return multiple elements.

An example scenario where using a fragment might break your app is when you're developing a responsive design and the default margin or padding of the wrapper element affects the layout in unexpected ways. By using a fragment, you can ensure that these default styles do not interfere with your layout, allowing you to maintain a clean and consistent design across different screen sizes and devices.

## 6. Give 3 examples of the HOC pattern.

## 1. Data Fetching HOC

This HOC, named withDataFetch, is designed to handle data fetching logic for a component. It accepts a component and a method to fetch data as arguments. The HOC then uses this method to retrieve data and passes the data, along with loading and error states, to the wrapped component. This allows the wrapped component to display appropriate UI based on the data fetching status.

```sh
// Example of a Data Fetching HOC
function withDataFetch(WrappedComponent, fetchDataMethod) {
  return class extends React.Component {
    state = {
      data: null,
      isLoading: true,
      error: null,
    };

    componentDidMount() {
      fetchDataMethod()
       .then(data => this.setState({ data, isLoading: false }))
       .catch(error => this.setState({ error, isLoading: false }));
    }

    render() {
      const { data, isLoading, error } = this.state;
      if (isLoading) return <div>Loading...</div>;
      if (error) return <div>Error: {error.message}</div>;

      return <WrappedComponent data={data} />;
    }
  };
}

```

##2. Authorization HOC
This HOC, named withAuthorization, is used to enforce authorization rules on a component. It accepts a wrapped component and a method to check permissions as arguments. The HOC uses this method to determine if the user has permission to view the wrapped component. This pattern is useful for creating private components that should only be accessible to certain users.

```sh
// Example of an Authorization HOC
function withAuthorization(WrappedComponent, checkPermission) {
  return class extends React.Component {
    render() {
      if (!checkPermission()) {
        return <div>You do not have permission to view this page.</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
}
```

## 3. Toggle State HOC

This HOC, which could be named withToggleState, enhances a component by adding toggle functionality. It initializes a state with a toggleStatus key and provides a function to toggle this status. This pattern is useful for components that need to switch between different states, such as toggling visibility or enabling/disabling a feature.

```sh
// Example of a Toggle State HOC
function withToggleState(WrappedComponent) {
  return class extends React.Component {
    state = {
      toggleStatus: false,
    };

    toggleStatus = () => {
      this.setState(prevState => ({ toggleStatus:!prevState.toggleStatus }));
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          toggleStatus={this.state.toggleStatus}
          toggleStatus={this.toggleStatus}
        />
      );
    }
  };
}
```

## 7. What's the difference in handling exceptions in promises, callbacks and async...await?

## 1. Callbacks

A. Error Handling: Errors in callbacks are typically handled using the "error-first" convention, where the first argument to the callback function is reserved for an error object. If an error occurs, the callback is invoked with the error object as the first argument, followed by any result data.
B. Complexity: Callbacks can lead to "callback hell," where deeply nested callbacks make the code difficult to read and manage. This complexity arises from the need to pass callbacks to other callbacks, leading to a pyramid-like structure of callbacks.
C. Debugging: Debugging can be challenging with callbacks due to their asynchronous nature and the potential for deeply nested structures.

## 2.Promises

A. Error Handling: Promises introduce a more structured approach to error handling with the .catch() method. When a promise is rejected, the .catch() method is used to handle the error. This allows for centralized error handling for a series of asynchronous operations.
B. Chaining and Composition: Promises support chaining and composition, enabling the sequential or parallel execution of asynchronous operations. This feature helps avoid callback hell by allowing operations to be chained together in a more readable manner.
C. Debugging: Debugging promises can be easier than callbacks due to their structured nature and the ability to use .catch() for centralized error handling.

## 3. Async/Await

A. Error Handling: Async/await simplifies error handling by allowing the use of try/catch blocks within async functions. This makes error handling more familiar and intuitive, similar to synchronous code.
B. Readability: Async/await syntax is considered more readable and cleaner than both callbacks and promises, making asynchronous code look and behave more like synchronous code.
C. Compatibility: Async/await is supported in modern JavaScript environments, including modern browsers and Node.js. However, it requires the use of the async keyword for functions that return promises, and the await keyword to pause execution until a promise is resolved or rejected.

## 8. How many arguments does setState take and why is it async.

The setState method in React takes up to two arguments. The first argument can be an object or a function that returns an object, representing the new state. The second argument is a callback function that is executed after the state update is applied. This callback is useful for performing actions that depend on the updated state, ensuring they execute after the state has been updated.

setState is asynchronous because React batches state updates for performance reasons. This means that instead of applying state changes immediately, React schedules them and applies them later. This approach helps in reducing the number of re-renders and improves the performance of the application. Making state updates synchronous could lead to performance issues, especially in complex applications where frequent state updates occur.

The asynchronous nature of setState also allows React to optimize rendering by batching multiple state updates into a single render cycle. This batching process can lead to more efficient updates and less frequent re-renders, which is crucial for maintaining a smooth user interface.

Here's an example demonstrating the use of setState with both arguments:

```sh
import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  update() {
    this.setState(
      ({ count }) => ({
        count: count + 1
      }),
      () => {
        this.setState(({ count }) => ({
          count: count + 2
        }));
      }
    );
  }

  render() {
    return (
      <>
        <button onClick={this.update.bind(this)}>Increment</button>
        <p>{this.state.count}</p>
      </>
    );
  }
}

export default App;
```

In this example, the update method first increments the count state by 1 and then, in the callback function, increments it by another 2. This ensures that the second increment happens after the first one, demonstrating the asynchronous nature of setState and the use of callbacks to handle subsequent state updates based on the current state.

## 9. List the steps needed to migrate a Class to Function Component.

To migrate a class component to a functional component in React, follow these steps:

1. Analyze the Class Component Structure: Understand the structure of your class component, including its state, lifecycle methods, and any class methods that handle logic or events. This analysis will help you plan how to replicate the same behavior in a functional component.
2. Convert the Class Component to a Function Component: Replace the class declaration with a function declaration. For example, change class MyComponent extends React.Component to function MyComponent(props)
3. Remove the Render Method: Since functional components return JSX directly, remove the render method. Instead, make the return statement the last line in your function
4. Convert All Methods to Functions: Class methods won't work inside a function component. Convert all methods to functions within the functional component. For instance, if you had a method onClickHandler(e), you would convert it to a function inside the functional component
5. Remove References to this: The this keyword is not used in functional components. Remove any references to this throughout your component.
6. Converting State and Lifecycle Methods to Hooks: Use React hooks to manage state and lifecycle features. For example, replace this.state and this.setState with the useState hook, and replace lifecycle methods like componentDidMount with the useEffect hook.
7. Transform Class Methods to Function Helpers: Methods in class components that handle logic, such as events or data processing, become standalone function helpers within the functional component's body. Define these methods as functions inside the functional component.
8. Apply Final Touches and Best Practices: After converting, ensure that the functional component behaves identically to the original class component. Optimize for performance and maintainability by adhering to best practices

## 10.List a few ways styles can be used with components.

1. Inline CSS: Directly applying styles within the component using the style attribute. This method is straightforward but can become cumbersome for complex styles or when styles need to be reused across components

```sh
<div style={{ color: 'blue', fontSize: '14px' }}>Hello World</div>
```

2. External CSS Files: Writing CSS in external files and linking them to the React component. This method is similar to traditional web development and keeps styles separate from JavaScript, making them easier to manage.

```sh
 /* styles.css */
.myComponent {
   color: blue;
   font-size: 14px;
 }
```

```sh
<div className="myComponent">Hello World</div>
```

3. CSS Modules: A CSS file in which all class names and animation names are scoped locally by default. This prevents naming collisions and promotes component isolation.

```sh
 /* MyComponent.module.css */
.myComponent {
   color: blue;
   font-size: 14px;
 }
```

```sh
import styles from './MyComponent.module.css';
<div className={styles.myComponent}>Hello World</div>
```

4.Styled Components: A library that allows you to write actual CSS in your JavaScript files. It supports all CSS features and automatically scopes styles to components.

```sh
import styled from 'styled-components';

const StyledDiv = styled.div`
  color: blue;
  font-size: 14px;
`;

<StyledDiv>Hello World</StyledDiv>
```

5. Sass and SCSS: Using Sass or SCSS for styling in React allows for variables, nesting, mixins, and other advanced features, making styles more maintainable and readable.

```sh
 // MyComponent.scss
.myComponent {
   color: blue;
   font-size: 14px;
 }
```

```sh
<div className="myComponent">Hello World</div>
```

6. Styled System: A collection of utilities for building consistent design systems and styling applications. It provides a set of tools for creating scalable and maintainable styles.
7. Emotion: A performant and flexible CSS-in-JS library that allows you to style applications quickly with string or object styles. It supports both server-side rendering and client-side rendering.
8. Tailwind CSS: A utility-first CSS framework for rapidly building custom designs. It can be integrated into React projects for a highly customizable styling approach.
9. Bootstrap: While not a React-specific library, Bootstrap can be used in React projects for quick prototyping and building responsive layouts. It offers pre-designed components and styles that can be customized.

# 11. How to render an HTML string coming from the server.

To render an HTML string coming from the server in a React application, you should use the dangerouslySetInnerHTML attribute. This attribute allows you to insert raw HTML into your component, but it comes with a warning due to the potential security risks associated with cross-site scripting (XSS) attacks. Therefore, it's crucial to ensure that the HTML string you're inserting is safe and doesn't contain malicious scripts.

Here's how we can use dangerouslySetInnerHTML:

```sh
function MyComponent({ htmlString }) {
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
}
```

In this example, htmlString is the variable holding the HTML string you received from the server. By passing an object with a \_\_html key to dangerouslySetInnerHTML, you instruct React to treat the content as HTML rather than plain text.
It's also a good practice to sanitize the HTML string before rendering it to prevent XSS attacks. There are libraries available, such as DOMPurify, that can help with sanitizing HTML content.
