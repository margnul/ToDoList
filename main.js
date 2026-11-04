class ToDoList {
  constructor(useMock) {
    this.taskTemplate = document.querySelector('#task-template');
    this.tasksList = document.querySelector('#tasks-list');
    this.deleteAllButton = document.querySelector('#delete-all');
    this.addButton = document.querySelector('#add-button');
    this.inputTitle = document.querySelector('#input-title');
    this.searchButton = document.querySelector('#search-button');
    this.inputSearch = document.querySelector('#input-search');

    this.bindEvents();
    this.createTask('Task 1');
  }

  bindEvents() {
    this.tasksList.addEventListener('click', (el) => {
      const parentTask = el.target.closest('.task');
      if (!parentTask) { return };

      // checkbox
      if (el.target.classList.contains('task-checkbox')) {
        parentTask.classList.toggle('task-completed');
      }

      // cross
      // checkbox
      if (el.target.classList.contains('task-delete-button')) {
        parentTask.remove();
      }
    })

    this.deleteAllButton.addEventListener('click', () => {
      let tasks = this.tasksList.children
      for (let ind = 0; ind < tasks.length; ind++) {
        if (tasks[ind].classList.contains('task-completed')) {
          tasks[ind].remove();
          ind--;
        }
      }
    })

    this.addButton.addEventListener('click', () => {
      this.createTask(this.inputTitle.value);
    })

    this.inputSearch.addEventListener('input', (el) => {
      let tasks = this.tasksList.children;
      const text = el.target.value;
      for (let ind = 0; ind < tasks.length; ind++) {
        console.log(tasks[ind].querySelector('.task-text').value, text);
        if (!text || tasks[ind].querySelector('.task-text').value.includes(text)) {
          tasks[ind].style.display = '';
        } else {
          tasks[ind].style.display = 'none';
        }
      }
    })
  }

  createTask(taskName) {
    const newTaskElement = this.taskTemplate.cloneNode(true);
    newTaskElement.style.display = '';
    const taskTextElement = newTaskElement.querySelector('.task-text');
    taskTextElement.value = taskName;
    newTaskElement.removeAttribute('id');
    this.tasksList.appendChild(newTaskElement);
  }
}

const toDoList = new ToDoList();