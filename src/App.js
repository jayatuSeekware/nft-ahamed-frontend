import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';


import Home from './Components/Home'
import Detail from './Components/Details'
import Signup from './Components/Signup'
import Signin from './Components/Signin'





function App() {

  return (
    <div className="App">
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/Detail" component={Detail} />
        <Route path="/Signup" component={Signup} />
        <Route path="/Signin" component={Signin} />
      </Switch>
    </div>
  );
}

export default App;