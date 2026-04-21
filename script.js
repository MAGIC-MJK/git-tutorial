const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const countLabel = document.getElementById('task-count');
const clearCompletedButton = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll('.filter');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let currentFilter = 'all';

const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

const updateStats = () => {
  const activeCount = todos.filter((todo) => !todo.completed).length;
  countLabel.textContent = activeCount;
  emptyState.classList.toggle('hidden', todos.length > 0);
};

const getVisibleTodos = () => {
  if (currentFilter === 'active') {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === 'completed') {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
};

const renderTodos = () => {
  list.innerHTML = '';

  const visibleTodos = getVisibleTodos();

  visibleTodos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    item.innerHTML = `
      <input type="checkbox" aria-label="标记任务完成" ${todo.completed ? 'checked' : ''} />
      <p class="todo-text">${todo.text}</p>
      <div class="todo-actions">
        <button type="button" class="delete" aria-label="删除任务">×</button>
      </div>
    `;

    const checkbox = item.querySelector('input');
    const deleteButton = item.querySelector('.delete');

    checkbox.addEventListener('change', () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    deleteButton.addEventListener('click', () => {
      todos = todos.filter((current) => current.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    list.appendChild(item);
  });

  emptyState.textContent = todos.length === 0 ? '暂无任务，先添加一个吧。' : '当前筛选下没有任务。';
  emptyState.classList.toggle('hidden', todos.length > 0 && visibleTodos.length > 0);
  updateStats();
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) return;

  todos.unshift({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });

  input.value = '';
  saveTodos();
  renderTodos();
});

clearCompletedButton.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    renderTodos();
  });
});

renderTodos();
