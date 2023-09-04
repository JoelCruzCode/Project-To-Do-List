import storage from "./storage";
import task from "./task";
import appendChildren from "./functions";

const loadUserInterface = function () {
  const content = document.querySelector(".content");
  const projects = document.querySelector(".projects");
  const main = document.querySelector(".main-content");
  const title = document.querySelector(".main-title");
  const taskContainer = document.querySelector(".task-container");
  const taskBtn = document.querySelector(".add-task-btn");
  const taskForm = document.querySelector(".task-form");
  const btnContainer = document.querySelector(".btn-container");
  const confirmBtn = document.querySelector(".confirm-form");
  const cancelBtn = document.querySelector(".cancel-form");
  // create a span? that will show the numerical value of tasks created in aside
  // Can also make this an preference option to toggle

  function renderTask(t) {
    let div = document.createElement("div");
    let h3 = document.createElement("h3");
    let d = document.createElement("p");
    let p = document.createElement("p");
    h3.textContent = t.getTitle();
    d.textContent = t.getDueDate();
    p.textContent = t.getDescription();
    appendChildren(div, [h3, d, p]);
    taskContainer.appendChild(div);
  }

  function initialRender() {
    taskContainer.textContent = ``;
    let mainStorage = storage.getStorage();
    title.textContent = mainStorage.projects.inbox.name;
    mainStorage.projects.inbox.tasks.forEach((t) => {
      renderTask(t);
    });

    // main and title will load local storage info
    // projects will load local storage info
  }

  function toggleForm() {
    let formElements = [taskForm, taskBtn, confirmBtn, cancelBtn];
    formElements.forEach((el) => el.classList.toggle("hidden"));

    // render a form, submit values to local storage
    // then render that storage to mainstorage and appendchild to content
  }

  function addForm() {
    const title = document.getElementById("name").value;
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const type = document.getElementById("type").value;
    let t = task(title, date, description);
    t.setType(type);

    storage.addTask(type, t);
    renderTask(t);
  }

  initialRender();
  // Event Listeners
  taskBtn.addEventListener("click", toggleForm);

  cancelBtn.addEventListener("click", toggleForm);

  confirmBtn.addEventListener("click", function (e) {
    e.preventDefault();
    addForm();
  });
};

export default loadUserInterface;
