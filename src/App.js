import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebaseConnection';
import HomeView from './views/HomeView';
import TasksView from './views/TasksView';
import LoginView from './views/LoginView';
import NotFoundView from './views/NotFoundView';
import Presentation from './apresentacao/presentation';

export const AuthContext = createContext({
  usuario: null,
  setUsuario: () => {}
});

const App = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuario({
          id: usuarioFirebase.uid,
          email: usuarioFirebase.email
        });
      } else {
        setUsuario(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario }}> 
      <Router>
        <Routes>
          <Route path="/" element={<Presentation />} /> {}
          <Route path="/tarefas" element={<TasksView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/home" element={<HomeView />} />
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
