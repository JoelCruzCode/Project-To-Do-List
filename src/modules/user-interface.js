import { format, isFuture, parseISO } from "date-fns";
import storage from "./storage";
import task from "./task";
import {
  appendChildren,
  validateForm,
  insertAfter,
  formatDate,
  formatDueDate,
} from "./functions";
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

  const mainStorage = storage.getStorage();

  // Aside UI Elements
  const allBtn = document.querySelector(".all-btn");
  const todayBtn = document.querySelector(".today-btn");
  const upcomingBtn = document.querySelector(".upcoming-btn");
  const projects = document.querySelector(".projects");
  const tasks = document.querySelector(".aside-tasks");

  function renderTask(t) {
    const div = document.createElement("div");
    div.classList.add("task-div");
    div.setAttribute("data-id", `${t.getId()}`);
    div.setAttribute("data-type", `${t.getType()}`);

    const h3 = document.createElement("h3");
    h3.classList.add("task-title");
    h3.textContent = `Title: ${t.getTitle()}`;

    const date = document.createElement("p");
    date.classList.add("task-date");
    date.textContent = `Date: ${t.getDueDate()}`;

    const description = document.createElement("p");
    description.classList.add("task-description");
    description.textContent = `Description: ${t.getDescription()}`;

    const btndiv = document.createElement("div");
    btndiv.classList.add("btn-container");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.classList.add("del-btn");

    appendChildren(btndiv, [editBtn, delBtn]);
    appendChildren(div, [h3, description, date, btndiv]);
    taskContainer.appendChild(div);
  }

  function renderSelection(element) {
    element.innerHTML = "";
    const data = storage.getStorage();
    for (const key of Object.keys(data.projects)) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = key;
      element.appendChild(option);
    }
  }

  function initialRender(key) {
    renderSelection(select);
    taskContainer.textContent = "";
    storage.convertTasks();
    key = key.slice(0, 1).toLowerCase() + key.slice(1);
    if (key === "all") {
      mainTitle.textContent = "All";
      for (const project of Object.values(mainStorage.projects)) {
        project.tasks.forEach((task) => {
          renderTask(task);
        });
      }
    } else if (key === "today") {
      mainTitle.textContent = "Today";
      for (const project of Object.values(mainStorage.projects)) {
        project.tasks.forEach((task) => {
          const today = format(new Date(), "MM-dd-yyyy");
          if (task.getDueDate() === today) {
            renderTask(task);
          }
        });
      }
    } else if (key === "upcoming") {
      mainTitle.textContent = "Upcoming";
      for (const project of Object.values(mainStorage.projects)) {
        project.tasks.forEach((task) => {
          // let today = format(new Date(), "MM-dd-yyyy");
          const due = formatDueDate(task.getDueDate());
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
    const formElements = [...elements];
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
      const updatedDescription = description.trim() !== "" ? description : "";
      const taskInstance = task(title, date, updatedDescription);
      taskInstance.setType(type);

      const t = {
        title,
        dueDate: date,
        description: updatedDescription,
        id: taskInstance.getId(),
        type,
      };

      storage.addTask(t, type);

      // Rendering all task instead of 1.
      initialRender(mainTitle.textContent);
    }
  }

  function RenderEditForm(target) {
    // Fix Date Formating and clean up code
    const buttonDiv = target.closest(".btn-container");
    insertAfter(editTaskForm, buttonDiv);
    renderSelection(editSelect);
    toggleForm(editTaskForm, editBtnContainer);
    const { children } = target.closest(".task-div");
    const title = document.getElementById("edit-name");
    const description = document.getElementById("edit-description");
    // let updatedDescription = description.trim() !== "" ? description : "";
    const date = document.getElementById("edit-date");
    const elements = [title, description];
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
      const formattedDate = [splitDate[2], splitDate[0], splitDate[1]].join(
        "-"
      );
      date.value = formattedDate;
    } else {
      date.value = "";
    }
  }

  function submitEditForm(e) {
    if (validateForm("edit-form")) {
      const div = e.target.closest(".task-div");
      const title = document.getElementById("edit-name").value;
      const date = formatDate(document.getElementById("edit-date").value);
      const description = document.getElementById("edit-description").value;
      const type = document.getElementById("edit-type").value;

      const taskInstance = task(title, date, description);
      taskInstance.setType(type);
      //
      const t = {
        title,
        dueDate: date,
        description,
        id: div.dataset.id,
        type,
      };
      console.log("t:type:", t.type);
      console.log("t:id:", t.id);
      console.log("during:", taskContainer.children);

      const data = storage.getStorage();
      for (const [key, value] of Object.entries(data.projects)) {
        value.tasks.forEach((task) => {
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
  initialRender("inbox");

  // Event Listeners

  // Add Task
  taskBtn.addEventListener("click", (e) => {
    toggleForm(taskForm, taskBtn, confirmBtn, cancelBtn);
  });

  cancelBtn.addEventListener("click", (e) => {
    toggleForm(taskForm, taskBtn, confirmBtn, cancelBtn);
  });

  confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    submitForm();
    toggleForm(taskForm, taskBtn, confirmBtn, cancelBtn);
  });

  // Edit Task
  taskContainer.addEventListener("click", (e) => {
    const button = e.target;

    if (button.classList.contains("edit-btn")) {
      // edit task function here
      RenderEditForm(button);
    } else if (button.classList.contains("del-btn")) {
      // delete task here
      const div = button.closest(".task-div");
      const description = div.closest(".task-description");
      const id = div.getAttribute("data-id");
      const type = div.getAttribute("data-type");
      const task = {
        id,
        description,
      };
      storage.deleteTask(task, type);
      console.log("deleting");
      console.log(mainTitle.textContent);
      initialRender(mainTitle.textContent);
    }
  });

  editConfirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    submitEditForm(e);
    console.log("After: ", taskContainer.children);
  });

  editCancelBtn.addEventListener("click", (e) => {
    toggleForm(editTaskForm, editBtnContainer);
  });

  // SideBar
  tasks.addEventListener("click", (e) => {
    const element = e.target;
    if (element.tagName === "BUTTON") {
      const field = element.textContent.split(" ")[0];
      initialRender(field);
    }
  });

  projects.addEventListener("click", (e) => {
    const button = e.target;

    if (button.classList.contains("project-btn")) {
      if (button.textContent) {
        const field = button.textContent.split(" ")[0];
        initialRender(field);
      }
    }
  });
};

export default loadUserInterface;
