document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todoForm');
    const todoInput = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const listItem = document.createElement('li');

            listItem.className = 'todo-item';
            
            const checkbox = document.createElement('input');

            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => {
                todo.completed = checkbox.checked;
                saveTodos();
                renderTodos();
            });

            const text = document.createElement('span');

            text.textContent = todo.text;
            if (todo.completed) {
                text.classList.add('completed');
            }

            const deleteButton = document.createElement('button');

            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', () => {
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            });

            listItem.appendChild(checkbox);
            listItem.appendChild(text);
            listItem.appendChild(deleteButton);
            todoList.appendChild(listItem);
        });
    }


    todoForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newTodo = { text: todoInput.value, completed: false };
        
        todos.push(newTodo);
        saveTodos();
        renderTodos();
        todoInput.value = '';
    });

    renderTodos();
});
