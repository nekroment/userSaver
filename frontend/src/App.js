import React from 'react';
import UserManager from './components/UserManager';
import { Route } from 'react-router-dom';


function App() {

  return (
    <div className="App">
      <Route path="/"  component={UserManager} />
    </div>
  );
}

export default App;
