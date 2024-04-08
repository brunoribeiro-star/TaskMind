import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebaseConnection';
import HomeView from './views/HomeView';
import TasksView from './views/TasksView';
import LoginView from './views/LoginView';
import NotFoundView from './views/NotFoundView';
import Presentation from './apresentacao/presentation'; // Importe sua página de apresentação

// Cria o contexto com um valor inicial que reflete o estado inicial do usuário
export const AuthContext = createContext({
  usuario: null,
  setUsuario: () => {} // Define uma função vazia como placeholder
});

const App = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((usuarioFirebase) => {
      if (usuarioFirebase) {
        // Se há um usuário, configure os detalhes do usuário
        setUsuario({
          id: usuarioFirebase.uid,
          email: usuarioFirebase.email
        });
      } else {
        // Caso contrário, configure o usuário como null
        setUsuario(null);
      }
    });

    // Função para limpar a inscrição ao desmontar o componente
    return () => unsubscribe();
  }, []);

  return (
    // Passa ambos, usuario e setUsuario para os componentes filhos
    <AuthContext.Provider value={{ usuario, setUsuario }}> 
      <Router>
        <Routes>
          <Route path="/" element={<Presentation />} /> {/* Adicione esta rota */}
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
