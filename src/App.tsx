import { createContext, useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';

import { NewRoom } from "./pages/NewRoom";
import { Home } from './pages/Home';
import { auth, provider } from './services/firebase';
import { AuthContext, AuthContextProvider } from './contexts/AuthContext';
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';



function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />

          <Route path="/admin/rooms/:id" component={AdminRoom} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
