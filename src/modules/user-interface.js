import storage from "./storage";
import task from "./task";
import {
  appendChildren,
  validateForm,
  insertAfter,
  formatDate,
  formatDueDate,
} from "./functions";
import { format, isFuture, parseISO } from "date-fns";
import { renderSideBar } from "./user-interface/sidebar";

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
  const editTaskForm = document.querySelector(".edit-form");
  const editBtnContainer = document.querySelector(".edit-btn-container");
  const editConfirmBtn = document.querySelector(".edit-confirm-btn");
  const editCancelBtn = document.querySelector(".edit-cancel-btn");
  const select = document.querySelector(".add-select");
  const editSelect = document.querySelector(".edit-select");

  let mainStorage = storage.getStorage();
  initialRender("inbox");

  // Aside UI Elements
  const allBtn = document.querySelector(".all-btn");
  const todayBtn = document.querySelector(".today-btn");
  const upcomingBtn = document.querySelector(".upcoming-btn");
  const projects = document.querySelector(".projects");
  const tasks = document.querySelector(".aside-tasks");

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

  function initialRender(key) {
    renderSelection(select);
    taskContainer.textContent = ``;
    storage.convertTasks();
    key = key.slice(0, 1).toLowerCase() + key.slice(1);
    if (key === "all") {
      mainTitle.textContent = "All";
      for (let project of Object.values(mainStorage.projects)) {
        project.tasks.forEach((task) => {
          renderTask(task);
        });
      }
    } else if (key === "today") {
      mainTitle.textContent = "Today";
      for (let project of Object.values(mainStorage.projects)) {
        project.tasks.forEach((task) => {
          let today = format(new Date(), "MM-dd-yyyy");
          if (task.getDueDate() === today) {
            renderTask(task);
          }
        });
      }
    } else if (key === "upcoming") {
      mainTitle.textContent = "Upcoming";
      for (let project of Object.values(mainStorage.projects)) {
        project.tasks.forEach((task) => {
          // let today = format(new Date(), "MM-dd-yyyy");
          let due = formatDueDate(task.getDueDate());
          if (isFuture(parseISO(due))) {
            renderTask(task);
          }
        });
      }
    } else {
      console.log("this is the key: ", key, typeof key);
      // Main UI
      mainTitle.textContent = mainStorage.projects[key].name;
      mainStorage.projects[key].tasks.forEach((task) => {
        renderTask(task);
      });
    }

    // Aside UI
    renderSideBar(mainStorage);
    storage.revertTasks();
  }

  function toggleForm(...elements) {
    let formElements = [...elements];
    formElements.forEach((el) => el.classList.toggle("hidden"));
  }

  function submitForm() {
    if (validateForm("task-form")) {
      const title = document.getElementById("name").value;
      const rawDate = document.getElementById("date").value;
      const date = rawDate ? formatDate(rawDate) : "";
      // Check if this change to date correctly updates the sidebar upcoming/today
      // Check if edit task is affected by this
      const description = document.getElementById("description").value;
      const type = document.getElementById("type").value;
      let updatedDescription = description.trim() !== "" ? description : "";
      let taskInstance = task(title, date, updatedDescription);
      taskInstance.setType(type);

      let t = {
        title: title,
        dueDate: date,
        description: updatedDescription,
        id: taskInstance.getId(),
        type: type,
      };

      storage.addTask(t, type);

      // Rendering all task instead of 1. Space Complexity is not an issue due to local storage limitations
      initialRender(mainTitle.textContent);
    }
  }

  function RenderEditForm(target) {
    // Fix Date Formating and clean up code
    let buttonDiv = target.closest(".btn-container");
    insertAfter(editTaskForm, buttonDiv);
    renderSelection(editSelect);
    toggleForm(editTaskForm, editBtnContainer);
    let children = target.closest(".task-div").children;
    const title = document.getElementById("edit-name");
    const description = document.getElementById("edit-description");
    // let updatedDescription = description.trim() !== "" ? description : "";
    const date = document.getElementById("edit-date");
    let elements = [title, description];
    elements.forEach((el, i) => {
      if (!children[i].innerText.split(": ")[1]) {
        el.value = "";
      } else {
        el.value = children[i].innerText.split(": ")[1];
      }
    });

    let splitDate = children[2].innerText.split(": ")[1];

    if (splitDate) {
      splitDate = splitDate.split("-");
      let formattedDate = [splitDate[2], splitDate[0], splitDate[1]].join("-");
      date.value = formattedDate;
    } else {
      date.value = "";
    }
  }

  function submitEditForm(e) {
    if (validateForm("edit-form")) {
      let div = e.target.closest(".task-div");
      const title = document.getElementById("edit-name").value;
      const date = formatDate(document.getElementById("edit-date").value);
      const description = document.getElementById("edit-description").value;
      const type = document.getElementById("edit-type").value;

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
      console.log("t:type:", t.type);
      console.log("t:id:", t.id);
      console.log("during:", taskContainer.children);

      let data = storage.getStorage();
      for (let [key, value] of Object.entries(data.projects)) {
        value.tasks.forEach((task, index) => {
          if (task.id === div.dataset.id) {
            // rendering all tasks in key after editing task in storage
            storage.editTask(t, key);
            toggleForm(editTaskForm, editBtnContainer);
            initialRender(mainTitle.textContent);
          }
        });
      }
    }
  }

  // Event Listeners

  // Add Task
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

  // Edit Task
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
      console.log("deleting");
      console.log(mainTitle.textContent);
      initialRender(mainTitle.textContent);
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

  // SideBar
  tasks.addEventListener("click", function (e) {
    let element = e.target;
    if (element.tagName === "BUTTON") {
      let field = element.textContent.split(" ")[0];
      initialRender(field);
    }
  });

  projects.addEventListener("click", function (e) {
    let button = e.target;

    if (button.classList.contains("project-btn")) {
      if (button.textContent) {
        let field = button.textContent.split(" ")[0];
        initialRender(field);
      }
    }
  });
};

export default loadUserInterface;
