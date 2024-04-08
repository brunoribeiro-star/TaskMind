import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App'; // Importando o contexto atualizado
import { db } from '../firebaseConnection';
import { collection, addDoc, getDocs, query, where, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import '../css/task.css';

const TasksView = () => {
  const { usuario } = useContext(AuthContext);
  const [novaTarefa, setNovaTarefa] = useState({ titulo: '', descricao: '' });
  const [tarefasAtivas, setTarefasAtivas] = useState([]);
  const [tarefasConcluidas, setTarefasConcluidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate('/login'); // Redirecionar para a tela de login se o usuário não estiver autenticado
    } else {
      loadTasks();
    }
  }, [usuario]); // Adicionado o usuário como uma dependência para o useEffect

  const loadTasks = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'tarefas'), where("usuarioId", "==", usuario.id));
      const querySnapshot = await getDocs(q);
      const listaTarefas = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const tarefasAtivas = listaTarefas.filter(tarefa => !tarefa.concluida);
      const tarefasConcluidas = listaTarefas.filter(tarefa => tarefa.concluida);
      setTarefasAtivas(tarefasAtivas);
      setTarefasConcluidas(tarefasConcluidas);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (novaTarefa.titulo && novaTarefa.descricao) {
      try {
        const docRef = await addDoc(collection(db, 'tarefas'), {
          titulo: novaTarefa.titulo,
          descricao: novaTarefa.descricao,
          usuarioId: usuario.id,
          concluida: false
        });

        const novaTarefaAdicionada = {
          id: docRef.id,
          titulo: novaTarefa.titulo,
          descricao: novaTarefa.descricao,
          concluida: false
        };
        setTarefasAtivas([...tarefasAtivas, novaTarefaAdicionada]);

        setNovaTarefa({ titulo: '', descricao: '' });
      } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
      }
    }
  };

  const handleEditTask = async (id, titulo, descricao) => {
    setEditingTaskId(id);
    setNovaTarefa({ titulo, descricao });
  };

  const handleSaveTask = async (id) => {
    try {
      await updateDoc(doc(db, 'tarefas', id), {
        titulo: novaTarefa.titulo,
        descricao: novaTarefa.descricao
      });
      const updatedTasks = tarefasAtivas.map(tarefa => {
        if (tarefa.id === id) {
          return { ...tarefa, titulo: novaTarefa.titulo, descricao: novaTarefa.descricao };
        }
        return tarefa;
      });
      setTarefasAtivas(updatedTasks);
      setEditingTaskId(null);
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
    }
  };

  const handleMarkAsCompleted = async (id) => {
    try {
      await updateDoc(doc(db, 'tarefas', id), {
        concluida: true
      });
      const tarefaConcluida = tarefasAtivas.find(tarefa => tarefa.id === id);
      const updatedTasksAtivas = tarefasAtivas.filter(tarefa => tarefa.id !== id);
      setTarefasAtivas(updatedTasksAtivas);
      setTarefasConcluidas([...tarefasConcluidas, tarefaConcluida]);
    } catch (error) {
      console.error('Erro ao marcar como concluída:', error);
    }
  };

  const handleDeleteTask = async (id, concluida) => {
    try {
      await deleteDoc(doc(db, 'tarefas', id));
      if (concluida) {
        const updatedTasks = tarefasConcluidas.filter(tarefa => tarefa.id !== id);
        setTarefasConcluidas(updatedTasks);
      } else {
        const updatedTasks = tarefasAtivas.filter(tarefa => tarefa.id !== id);
        setTarefasAtivas(updatedTasks);
      }
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  return (
    <div className="centralizar-sg">
      <h1>Gerencie suas tarefas aqui!</h1>
      <form id="form-task" onSubmit={handleAddTask}>
        <input 
          type="text"
          value={novaTarefa.titulo}
          onChange={(e) => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })}
          placeholder="Título da Tarefa"
        />
        <textarea
          value={novaTarefa.descricao}
          onChange={(e) => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
          placeholder="Descrição da Tarefa"
        />
        <button type="submit">Adicionar Tarefa</button>
      </form>
      <h2>Tarefas Ativas</h2>
      <ul>
        {loading ? (
          <p>Carregando...</p>
        ) : tarefasAtivas.length > 0 ? (
          tarefasAtivas.map((tarefa) => (
            <li key={tarefa.id}>
              {editingTaskId === tarefa.id ? (
                <>
                  <input 
                    type="text"
                    value={novaTarefa.titulo}
                    onChange={(e) => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })}
                  />
                  <textarea
                    value={novaTarefa.descricao}
                    onChange={(e) => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
                  />
                  <button onClick={() => handleSaveTask(tarefa.id)}>Salvar</button>
                </>
              ) : (
                <>
                  <strong>{tarefa.titulo}</strong> - {tarefa.descricao}
                  {!tarefa.concluida && (
                    <>
                      <button id="edit-btn" onClick={() => handleEditTask(tarefa.id, tarefa.titulo, tarefa.descricao)}>Editar</button>
                      <button onClick={() => handleMarkAsCompleted(tarefa.id)}>Marcar como concluída</button>
                    </>
                  )}
                  <button onClick={() => handleDeleteTask(tarefa.id, false)}>Excluir</button>
                </>
              )}
            </li>
          ))
        ) : (
          <p>Não há tarefas ativas para mostrar.</p>
        )}
      </ul>
      <h2>Tarefas Concluídas</h2>
      <ul>
        {tarefasConcluidas.length > 0 ? (
          tarefasConcluidas.map((tarefa) => (
            <li key={tarefa.id}>
              <strong>{tarefa.titulo}</strong> - {tarefa.descricao}
              <button onClick={() => handleDeleteTask(tarefa.id, true)}>Excluir</button>
            </li>
          ))
        ) : (
          <p>Não há tarefas concluídas para mostrar.</p>
        )}
      </ul>
      <Link id="link-edit" to="/">Voltar para a Visão Inicial</Link>
    </div>
  );
};

export default TasksView;
