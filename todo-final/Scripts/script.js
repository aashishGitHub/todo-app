var ToDoClass = ToDoClass || {};

ToDoClass = function () {
    this.tasks = JSON.parse(localStorage.getItem('TASKS'));
    if (!this.tasks) {
        this.tasks = [{
                value: 'Go to Dentist',
                isComplete: false,
                deadline: new Date(new Date().setDate(11)),
                priority: 'Low',
                isDeadlineStillValid: true,
                isEditable: false
            },
            {
                value: 'Do Gardening',
                isComplete: true,
                deadline: new Date(new Date().setDate(21)),
                priority: 'Medium',
                isDeadlineStillValid: true,
                isEditable: false
            },
            {
                value: 'Renew Library Account',
                isComplete: false,
                deadline: new Date(new Date().setDate(2)),
                priority: 'High',
                isDeadlineStillValid: true,
                isEditable: false
            },
        ];
    }

    this.addEventListeners = function () {
        document.getElementById('addTask').addEventListener('keypress', event => {
            if (event.keyCode === 13) {
                this.addTask(event.target.value);
                event.target.value = ''; // clear the value of textbox.
            }
        });

        document.addEventListener('click', (event) => {
            if (event.target.id == "toggleTaskStatus") {
                let thisTaskId = event.target.dataset.taskid
                todo.tasks[thisTaskId].isComplete = !todo.tasks[thisTaskId].isComplete;

            }
            if (event.target.id == "editTask") {
                let thisTaskId = event.target.parentElement.dataset.taskid;
                todo.tasks[thisTaskId].isEditable = true
                this.loadTasks();
                console.log("");
            }
            if (event.target.id == "deleteTask") {
                let thisTaskId = event.target.parentElement.dataset.taskid;
                delete todo.tasks[thisTaskId];
                this.loadTasks();
            }
           
            if (event.target.id == "submit") {
                let thisTaskId = event.target.dataset.taskid;
                todo.tasks[thisTaskId].isEditable = false; // close editable view
                todo.tasks[thisTaskId].isComplete = event.target.parentElement.markComplete.checked;
                todo.tasks[thisTaskId].value = event.target.parentElement.task.value;
                todo.tasks[thisTaskId].deadline = new Date(event.target.parentElement.deadline.value);
                todo.tasks[thisTaskId].priority = event.target.parentElement.querySelector(".active input").id;
                this.loadTasks();
            }
        })
    }

    this.loadTasks = function () {
        let tasksHtml = this.tasks.reduce((html, task, index) => html +=
            this.generateTaskHtml(task, index, this.getStatus(task)), '');
        document.getElementById('taskList').innerHTML = tasksHtml;
    }
    this.getStatus = function (task) {
        task.isDeadlineStillValid = (new Date() - new Date(task.deadline)) < 0 ? true : false;
        if (task.isComplete) {
            return 'list-group-item-success';
        } else if (!task.isDeadlineStillValid) {
            return 'list-group-item-danger';
        }

        if (!task.isComplete && task.isDeadlineStillValid) {
            if (task.priority == "High") {
                return 'list-group-item-info';
            } else if (task.priority == "Medium") {
                return 'list-group-item-goodToHave';
            } else if (task.priority == "Low") {
                return 'list-group-item-warning';
            }
        }
    }

    this.generateTaskHtml = function (task, index, status) {
        if (!task) {return; }
        let condensedView = `
        <li class="m-b-1 list-group-item list-group-item-action d-flex justify-content-between align-items-center ${status}" >
        <span data-taskId='${index}'> ${task.isComplete? '<i title="Completed" class="fas fa-check-square"></i>': '<i id="editTask" title="Edit pending task" class="fas fa-edit"></i>'} 
        <i id="deleteTask" data-taskId='${index}' title="delete task" class="fas fa-trash-alt"></i>
        </span>      
        ${task.value}                    
         <span>
              <small> Deadline: ${task.deadline.toLocaleDateString('en-US')}</small>
              <span class="badge badge-primary badge-pill">${task.priority} priority</span>
         </span>
        
      </li>`;
        let date = task.deadline.toLocaleDateString('en-US')
        let editableView = `
      <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center list-group-item-danger">

      <form class="form-inline ditable-frame">
          <label for="markComplete" class="mb-2 mr-sm-2">Mark Complete:</label>
          <input type="checkBox" class="form-control mb-2 mr-sm-2" id="markComplete"
          ${task.isComplete? "checked": ""}>
          <label for="task" class="mb-2 mr-sm-2">Task:</label>
          <input type="text" class="form-control mb-2 mr-sm-2" id="task" placeholder="Enter email"
              value="${task.value}">
          <label for="deadline" class="mb-2 mr-sm-2">Deadline:</label>
          <input type="text" class="form-control mb-2 mr-sm-2" id="deadline"
              placeholder="Set deadline" value="${date}">

          <label for="priority" class="mb-2 mr-sm-2">Priority:</label>
          <div id="priority" class="btn-group btn-group-toggle" data-toggle="buttons">
              <label class="btn  btn-info ${task.priority == "High"? "active": ""}">
                  <input type="radio" id="High" autocomplete="off"> High
              </label>
              <label class="btn btn-info ${task.priority == "Medium"? "active": ""}"">
                  <input type="radio" id="Medium" autocomplete="off"> Medium
              </label>
              <label class="btn btn-info ${task.priority == "Low"? "active": ""}"">
                  <input type="radio" id="Low" autocomplete="off"> Low
              </label>
          </div>
          <button type="submit" id="submit" class="btn btn-primary ml-5" data-taskId = '${index}'>Submit</button>
      </form>
  </li>`;
 
        return task.isEditable ? editableView : condensedView;
    }
  
    this.addTask = function (task) {
        let newTask = {
            value: task,
            isComplete: false,
            deadline: new Date(new Date().setDate(29)),
            isComplete: false,
            priority: "High",
            isEditable: false,
            isDeadlineStillValid: true           
        };
            this.tasks.push(newTask);
            this.loadTasks();
    }
}
var todo;
window.onload = function () {
    todo = new ToDoClass();
    todo.loadTasks();
    todo.addEventListeners();
};
