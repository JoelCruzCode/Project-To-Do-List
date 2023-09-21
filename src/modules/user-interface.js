import storage from "./storage";
import task from "./task";
import { appendChildren, validateForm, insertAfter } from "./functions";
import { format } from "date-fns";
const loadUserInterface = function () {
  // Main UI Elements
  const content = document.querySelector(".content");
  const main = document.querySelector(".main-content");
  const mainTitle = document.querySelector(".main-title");
  const taskContainer = document.querySelector(".task-container");
  const taskBtn = document.querySelector(".add-task-btn");
  const taskForm = document.querySelector(".task-form");
  const btnContainer = document.querySelector(".btn-container");
  const confirmBtn = document.querySelector(".confirm-form");
  const cancelBtn = document.querySelector(".cancel-form");
  //
  const editTaskForm = document.querySelector(".edit-form");
  const editBtnContainer = document.querySelector(".edit-btn-container");
  const editConfirmBtn = document.querySelector(".edit-confirm-btn");
  const editCancelBtn = document.querySelector(".edit-cancel-btn");
  const select = document.querySelector(".add-select");
  const editSelect = document.querySelector(".edit-select");

  // Aside UI Elements
  const projects = document.querySelector(".projects");

  // create a span? that will show the numerical value of tasks created in aside
  // Can also make this an preference option to toggle

  let mainStorage = storage.getStorage();

  function renderTask(t) {
    let div = document.createElement("div");
    div.classList.add("task-div");
    div.setAttribute("data-id", `${t.getId()}`);
    div.setAttribute("data-type", `${t.getType()}`);

    let h3 = document.createElement("h3");
    h3.classList.add("task-title");
    h3.textContent = `Title: ${t.getTitle()}`;

    let date = document.createElement("p");
    date.classList.add("task-date");
    date.textContent = `Date: ${t.getDueDate()}`;

    let description = document.createElement("p");
    description.classList.add("task-description");
    description.textContent = `Description: ${t.getDescription()}`;

    let btndiv = document.createElement("div");
    btndiv.classList.add("btn-container");

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    let delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.classList.add("del-btn");

    appendChildren(btndiv, [editBtn, delBtn]);
    appendChildren(div, [h3, description, date, btndiv]);
    taskContainer.appendChild(div);
  }

  function renderSelection(element) {
    element.innerHTML = ``;
    let data = storage.getStorage();
    for (let key of Object.keys(data.projects)) {
      let option = document.createElement("option");
      option.value = key;
      option.textContent = key;
      element.appendChild(option);
    }
  }

  function renderSideBar() {
    projects.textContent = ``;
    for (let [key, value] of Object.entries(mainStorage.projects)) {
      console.log(key, value);
      let p = document.createElement("p");
      p.textContent = `${key} `;
      let span = document.createElement("span");
      span.classList.add("highlight");
      span.textContent = value.tasks.length;
      p.appendChild(span);
      projects.appendChild(p);
      // values.tasks.forEach((_, index) => taskCount += (index + 1))
    }
  }

  // Should probably replace task in window instead of reloading/rendering all tasks again
  function initialRender(key) {
    // Main UI
    renderSelection(select);
    taskContainer.textContent = ``;
    storage.convertTasks();
    mainTitle.textContent = mainStorage.projects[key].name;
    console.log(mainTitle.textContent);
    console.log(mainStorage);
    mainStorage.projects[key].tasks.forEach((t) => {
      renderTask(t);
    });
    // Aside UI
    renderSideBar();
    storage.revertTasks();
  }

  function toggleForm(...elements) {
    let formElements = [...elements];
    formElements.forEach((el) => el.classList.toggle("hidden"));
  }

  function submitForm() {
    if (validateForm("task-form")) {
      const title = document.getElementById("name").value;
      const date = document.getElementById("date").value;
      const description = document.getElementById("description").value;
      const type = document.getElementById("type").value;
      let taskInstance = task(title, date, description);
      taskInstance.setType(type);

      let t = {
        title: title,
        dueDate: date,
        description: description,
        id: taskInstance.getId(),
        type: type,
      };

      storage.addTask(t, type);

      // Rendering the single task instead of all tasks
      let titleCaseType = type.slice(0, 1).toUpperCase() + type.slice(1);
      if (titleCaseType === mainTitle.textContent) {
        renderTask(taskInstance);
      }
    }
  }

  function RenderEditForm(target) {
    // Fix Date Formating and clean up code
    let buttonDiv = target.closest(".btn-container");
    insertAfter(editTaskForm, buttonDiv);
    renderSelection(editSelect);
    toggleForm(editTaskForm, editBtnContainer);
    let div = target.closest(".task-div");
    let children = target.closest(".task-div").children;
    const title = document.getElementById("edit-name");
    const description = document.getElementById("edit-description");
    const date = document.getElementById("edit-date");
    let elements = [title, description];
    elements.forEach((el, i) => {
      el.value = children[i].innerText.split(": ")[1];
    });
    console.log(children[2].innerText.split(": ")[1]);
    let split = children[2].innerText.split(": ")[1].split("-");
    console.log(format(new Date(split[0], split[1], split[2]), "mm/dd/yyyy"));
    date.value = children[2].innerText.split(": ")[1];
    // date.value = format(splitDate, "yyyy/mm/dd");
  }

  function submitEditForm(e) {
    if (validateForm("edit-form")) {
      let div = e.target.closest(".task-div");
      const title = document.getElementById("edit-name").value;
      const date = document.getElementById("edit-date").value;
      const description = document.getElementById("edit-description").value;
      const type = document.getElementById("edit-type").value;
      //
      let taskInstance = task(title, date, description);
      taskInstance.setType(type);
      //
      let t = {
        title: title,
        dueDate: date,
        description: description,
        id: div.dataset.id,
        type: type,
      };
      console.log("during:", taskContainer.children);

      let data = storage.getStorage();
      for (let [key, value] of Object.entries(data.projects)) {
        // console.log(value, div.dataset.type);
        value.tasks.forEach((task, index) => {
          if (task.id === div.dataset.id) {
            // console.log(index, key, task);

            // rendering all tasks in key after editing task in storage
            storage.editTask(t, key);
            toggleForm(editTaskForm, editBtnContainer);
            initialRender(key);
            // storage.convertTasks(key)
            // taskContainer.children[index] = data.projects[key].tasks[index]
          }
        });
      }
    }
  }

  initialRender("inbox");

  // Event Listeners

  // Add Task Listeners
  taskBtn.addEventListener("click", function (e) {
    toggleForm(taskForm, taskBtn, confirmBtn, cancelBtn);
  });

  cancelBtn.addEventListener("click", function (e) {
    toggleForm(taskForm, taskBtn, confirmBtn, cancelBtn);
  });

  confirmBtn.addEventListener("click", function (e) {
    e.preventDefault();
    submitForm();
    toggleForm(taskForm, taskBtn, confirmBtn, cancelBtn);
  });

  // Edit Task Listeners
  taskContainer.addEventListener("click", function (e) {
    let button = e.target;

    if (button.classList.contains("edit-btn")) {
      // edit task function here
      RenderEditForm(button);
    } else if (button.classList.contains("del-btn")) {
      // delete task here
      let div = button.closest(".task-div");
      let description = div.closest(".task-description");
      let id = div.getAttribute("data-id");
      let type = div.getAttribute("data-type");
      let task = {
        id: id,
        description: description,
      };
      storage.deleteTask(task, type);
      initialRender(type);
    }
  });

  editConfirmBtn.addEventListener("click", function (e) {
    e.preventDefault();
    submitEditForm(e);
    console.log("After: ", taskContainer.children);
  });

  editCancelBtn.addEventListener("click", function (e) {
    toggleForm(editTaskForm, editBtnContainer);
  });
};

export default loadUserInterface;
