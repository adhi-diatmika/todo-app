import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Login from './components/Login';
import TodoList from './components/TodoList';

export interface UserState {
  user: {
    id: string,
    name: string
  }
}

function App() {

  const [user, setUser] = useState<UserState["user"]>(
    {
      id: "",
      name: ""
    }
  );

  return (
    <div className="App">
      <header className='App-header'>
        <BrowserRouter>
          <Routes>
            <Route path='/'>
              <Route index element={<Login user={user} setUser={setUser}/>}/>
              <Route path=':name' element={<TodoList user={user}/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
