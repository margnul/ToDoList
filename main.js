class ToDoList {
  constructor(useMock) {
    this.taskTemplate = document.querySelector('#task-template').content;
    this.tasksList = document.querySelector('#tasks-list');
    this.deleteCompletedButton = document.querySelector('#delete-completed');
    this.addButton = document.querySelector('#add-button');
    this.inputTitle = document.querySelector('#input-title');
    this.searchButton = document.querySelector('#search-button');
    this.inputSearch = document.querySelector('#input-search');
    this.tasksQuantitySpan = document.querySelector('#tasks-quantity');

    this.STORAGE_KEY = 'todoList';

    const savedTasks = localStorage.getItem(this.STORAGE_KEY);

    this.state = {
      tasks: savedTasks ? JSON.parse(savedTasks) : [],
      filteredTasks: null
    }

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    this.tasksList.addEventListener('click', (el) => {
      const parentTask = el.target.closest('.task');
      if (!parentTask) {
        return
      };

      // checkbox
      if (el.target.classList.contains('task-checkbox')) {
        this.toggleTask(parentTask.dataset.id);
      }

      // cross
      // checkbox
      if (el.target.classList.contains('task-delete-button')) {
        parentTask.classList.add('disappearing');
        setTimeout(() => {
          this.deleteTask(parentTask.dataset.id);
          this.render();
        }, 300);
      }
    })

    this.deleteCompletedButton.addEventListener('click', () => {
      this.deleteCompletedTasks();
      this.render();
    })

    this.addButton.addEventListener('click', () => {
      this.createTask(this.inputTitle.value);
      this.inputTitle.value = '';
      this.inputTitle.focus();
      this.render();
    })

    this.inputSearch.addEventListener('input', (el) => {
      this.filterTasks(el.target.value);
      this.render();
    })

    this.inputTitle.addEventListener('keydown', (el) => {
      if (el.key !== 'Enter') return;
      this.createTask(this.inputTitle.value);
      this.inputTitle.value = '';
      this.inputTitle.focus();
      this.render();
    })
  }

  render() {
    this.deleteCompletedButton.style.display =
      this.state.tasks.some(task => task.done) ?
      'block' :
      'none';

    this.tasksQuantitySpan.textContent = this.state.tasks.length;
    if (this.state.filteredTasks?.length === 0) {
      this.tasksList.innerHTML = 'No tasks found...';
      return;
    }

    if (this.state.tasks?.length === 0) {
      this.tasksList.innerHTML = 'Create your first task...';
      return;
    }

    this.tasksList.innerHTML = '';
    const tasksWrapper = document.createDocumentFragment();
    const tasksList = this.state.filteredTasks ? this.state.filteredTasks : this.state.tasks;

    for (const element of tasksList) {
      const newTaskElement = this.taskTemplate.cloneNode(true).querySelector('.task');
      newTaskElement.dataset.id = element.id;
      newTaskElement.classList.toggle('task-completed', element.done);
      const taskTextElement = newTaskElement.querySelector('.task-text');
      taskTextElement.value = element.text;
      const checkbox = newTaskElement.querySelector('.task-checkbox');
      checkbox.checked = element.done;

      tasksWrapper.appendChild(newTaskElement);
    }
    this.tasksList.appendChild(tasksWrapper);
  }

  createTask(taskText) {
    if (!taskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: taskText,
      done: false
    }
    this.state.tasks.push(newTask);

    this.saveToLocalStorage();
  }

  deleteTask(taskId) {
    this.state.tasks = this.state.tasks.filter((task) => task.id !== Number(taskId));
    this.saveToLocalStorage();
  }

  toggleTask(taskId) {
    console.log('toggle: ', taskId);
    const task = this.state.tasks.find((task) => task.id === Number(taskId));
    task.done = !task.done;
    this.tasksList.querySelector(`[data-id="${taskId}"]`)?.classList.toggle('task-completed', task.done);
    this.deleteCompletedButton.style.display =
      this.state.tasks.some(task => task.done) ?
      'block' :
      'none';
    this.saveToLocalStorage()
  }

  deleteCompletedTasks() {
    const hasCompletedTasks = this.state.tasks.some(task => task.done);
    if (hasCompletedTasks && confirm('Delete all completed tasks?')) {
      this.state.tasks = this.state.tasks.filter((task) => !task.done);
      this.saveToLocalStorage();
      this.render();
    }
    this.deleteCompletedButton.style.display =
      this.state.tasks.some(task => task.done) ?
      'block' :
      'none';
  }

  saveToLocalStorage() {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.state.tasks)
    );
  }

  filterTasks(text) {
    if (text) {
      this.state.filteredTasks = this.state.tasks.filter((task) => {
        return task.text.toLowerCase().includes(text.toLowerCase());
      }).sort((a, b) => {
        return a.text.startsWith(text) ? -1 : 0;
      })
    } else {
      this.state.filteredTasks = null;
    }

  }

}

const toDoList = new ToDoList();