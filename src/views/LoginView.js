import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { auth } from '../firebaseConnection';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import '../css/login.css';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUsuario } = useContext(AuthContext);

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let userCredential;
      if (isCreatingAccount) {
        userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, senha);
      }
      setUsuario({
        id: userCredential.user.uid,
        email: userCredential.user.email,
      });
      navigate('/tarefas');
    } catch (error) {
      console.error('Erro na autenticação:', error.message);
      setError('Falha na autenticação: ' + error.message);
    }
  };

  return (
    <div>
      <h1>{isCreatingAccount ? 'Criar Conta' : 'Task Mind'}</h1>
      <p>Faça seu login no nosso aplicativo!</p>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleAuthAction}>
        <label>
          E-mail:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <br />
        <label>
          Senha:
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </label>
        <br />
        <button type="submit">{isCreatingAccount ? 'Criar Conta' : 'Entrar'}</button>
      </form>
      <button id="botao-conta" onClick={() => setIsCreatingAccount(!isCreatingAccount)}>
        {isCreatingAccount ? 'Já tem uma conta? Entrar' : 'Criar nova conta'}
      </button>
    </div>
  );
};

export default LoginView;
