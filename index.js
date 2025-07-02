// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Permite JSON no body das requisições
app.use(express.json());

// nossa "base de dados" em memória
let tasks = [];
let nextId = 1;

// 1) LISTAR todas as tarefas
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// 2) CRIAR uma nova tarefa
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Campo "title" é obrigatório.' });
  }
  const newTask = { id: nextId++, title, done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// 3) ATUALIZAR (título ou status) de uma tarefa
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.sendStatus(404);

  const { title, done } = req.body;
  if (title !== undefined) task.title = title;
  if (done !== undefined) task.done = !!done;
  res.json(task);
});

// 4) DELETAR uma tarefa
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  if (tasks.length === initialLength) return res.sendStatus(404);
  res.sendStatus(204); // sem conteúdo
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
