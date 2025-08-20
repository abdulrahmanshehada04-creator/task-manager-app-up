// DOM Elements
const newTaskInput = document.getElementById('newTaskInput');
const dueDateInput = document.getElementById('dueDateInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const darkModeToggle = document.getElementById('darkModeToggle');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const errorDiv = document.getElementById('error');

// Current user
let currentUser = localStorage.getItem('currentUser') || null;

// Load tasks from localStorage
function loadTasks() {
  const tasksJSON = localStorage.getItem(`tasks_${currentUser}`);
  return tasksJSON ? JSON.parse(tasksJSON) : [];
}

// Save tasks to localStorage
function saveTasks(tasks) {
  localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  const tasks = loadTasks();
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = '<li class="empty">No tasks yet. Add one!</li>';
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.isCompleted ? 'completed' : ''}`;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.isCompleted;
    checkbox.addEventListener('change', () => toggleComplete(task.id));

    // Task text
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.title;

    // Due date
    const dueSpan = document.createElement('span');
    dueSpan.className = 'due-date';
    dueSpan.textContent = task.dueDate ? `Due: ${task.dueDate}` : '';

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    // Append
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(dueSpan);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

// Toggle task completion
function toggleComplete(id) {
  const tasks = loadTasks();
  const updatedTasks = tasks.map(task =>
    task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
  );
  saveTasks(updatedTasks);
  renderTasks();
}

// Delete task
function deleteTask(id) {
  const tasks = loadTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  saveTasks(filteredTasks);
  renderTasks();
}

// Add new task
addBtn.addEventListener('click', () => {
  const title = newTaskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!title) {
    alert('Please enter a task!');
    return;
  }

  const newTask = {
    id: Date.now(),
    title,
    dueDate,
    isCompleted: false
  };

  const tasks = loadTasks();
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks();

  newTaskInput.value = '';
  dueDateInput.value = '';
});

// Dark mode toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
});

// Login Form
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Simple validation
  if (username === 'admin' && password === 'password') {
    currentUser = username;
    localStorage.setItem('currentUser', username);
    window.location.href = 'index.html';
  } else {
    errorDiv.textContent = 'Invalid username or password.';
    setTimeout(() => errorDiv.textContent = '', 3000);
  }
});

// Check login status on load
window.addEventListener('load', () => {
  currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = 'login.html';
  } else {
    renderTasks();
  }

  // Set dark mode based on preference
  if (document.body.classList.contains('dark-mode')) {
    darkModeToggle.textContent = '☀️ Light Mode';
  } else {
    darkModeToggle.textContent = '🌙 Dark Mode';
  }
});
