import { createContext, useState, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';

import { NewRoom } from "./pages/NewRoom";
import { Home } from './pages/Home';
import { auth, provider } from './services/firebase';
import { AuthContext, AuthContextProvider } from './contexts/AuthContext';



function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Route path="/" exact component={Home} />
        <Route path="/rooms/new" component={NewRoom} />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
