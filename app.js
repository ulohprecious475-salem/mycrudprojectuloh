require('dotenv').config();
const express = require( 'express' );
const app = express();

//body parsing middleware
app.use( express.json() );

let todos = [
      { id: 1, task: 'Learn Node.js', completed: false},
      { id: 2, task: 'Build CRUD API', completed: false},
      { id: 3, task: 'Test API', completed: true}
];

app.get('/todos', (req, res) => {
    res.status(200).json(todos); // send array as JSON
});

app.get('/todos/active', (req, res) => {
    const activeTodos = todos.filter(t => !t.completed && t.completed === false);
    res.status(200).json(activeTodos);
});

app.post('/todos', (req, res) => {
    const newTodo = { id: todos.length + 1, ...req.body}; // Auto-ID
    todos.push(newTodo);
    if(!newTodo.task) {
        return res.status(400).json({ error: 'Task is required' });
    };
    res.status(201).json(newTodo); // Echo back
});


// PATCH UPDATE -- Partial
app.patch('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    Object.assign(todo, req.body); // Merge: e.g., {completed: true}
    res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initiallength = todos.length;
    todos = todos.filter((t) => t.id !== id); // Array.filter() - non-destructive
    if (todos.length === initiallength)
        return res.status(404).json({ error: 'Not found' });
    res.status(204).send(); // Silent success
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

