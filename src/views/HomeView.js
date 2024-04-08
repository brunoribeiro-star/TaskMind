import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import '../css/home.css';

const HomeView = () => {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleViewTasks = () => {
    navigate('/tarefas');
  };

  const handleLogout = () => {
    // Lógica para fazer logout
    navigate('/login');
  };

  return (
    <div id="centralizar">
      <h1>Bem-vindo ao Task Mind!</h1>
      {usuario ? (
        <>
          <p>Bem-vindo, {usuario.email}</p>
          <button id="primeiro-botao" onClick={handleViewTasks}>Visualizar Tarefas</button>
          <button id="segundo-botao" onClick={handleLogout}>Sair</button>
        </>
      ) : (
        <p>Você não está logado. <Link to="/login">Faça login</Link></p>
      )}
    </div>
  );
};

export default HomeView;
