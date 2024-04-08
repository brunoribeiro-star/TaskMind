import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../apresentacao/styles.css'

const PresentationPage = () => {
    const [users, setUsers] = useState([]);
  
    useEffect(() => {
      async function fetchUsers() {
        try {
          const response = await fetch('https://randomuser.me/api/?results=5');
          const data = await response.json();
          setUsers(data.results);
        } catch (error) {
          console.error('Erro ao carregar usuários:', error);
        }
      }
  
      fetchUsers();
    }, []);
  
    return (
      <div className="presentation-page">
        <div className="apresentacao">
          <h1>Bem-vindo ao TaskMind!</h1>
          <p>Confira os benefícios de utilizar o nosso aplicativo!</p>
          <ul className="lista">
            <li>Organização;</li>
            <li>Produtividade;</li>
            <li>Otimização;</li>
            <li>Tempo.</li>
          </ul>
          <p className="organizacao">
            <b>Organização:</b> Com ele, adicionando as coisas que você tem que fazer no seu dia-a-dia, ou até mesmo no seu trabalho, você pode organizar melhor suas tarefas.
          </p>
          <p className="produtividade">
            <b>Produtividade:</b> Podendo se organizar melhor, sua produtividade também aumenta, tendo em vista que irá ter uma organização melhor para realizar as tarefas.
          </p>
          <p className="otimizacao">
            <b>Otimização:</b> Além disso, vai conseguir otimizar ao máximo sua linha de produção, tendo em vista que não vai mais precisar ficar indo atrás do que fazer e como fazer toda vez, vai ter no aplicativo.
          </p>
          <p className="tempo">
            <b>Tempo:</b> E ainda tem mais! Você vai obter muito mais tempo para suas produções, pois com isso, saberá tudo que precisa ser feito.
          </p>
          <h2>Esses são alguns de nossos usuários:</h2>
          <div className="user-info" id="users-container">
            {users.map(user => (
              <div className="user-card" key={user.login.uuid}>
                <img src={user.picture.medium} alt={`${user.name.first} ${user.name.last}`} />
                <h2>{`${user.name.first} ${user.name.last}`}</h2>
                <p>{user.email}</p>
              </div>
            ))}
          </div>
          <Link to="/login"><button className="login-button">Ir para a Tela de Login</button></Link>
        </div>
      </div>
    );
  };
  
  export default PresentationPage;
  