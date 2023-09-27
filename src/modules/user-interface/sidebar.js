import { format, isFuture, isToday, parseISO } from "date-fns";
import { formatDueDate } from "../functions";
function renderSideBar(storage) {
  const projects = document.querySelector(".projects");
  const tasks = document.querySelector(".aside-tasks");

  let allCount = 0;
  let todayCount = 0;
  let upcomingCount = 0;

  function renderButton(btnText, btnClass, spanText) {
    let btn = document.createElement("button");
    btn.textContent = `${btnText} `;
    btn.classList.add(btnClass);
    let span = document.createElement("span");
    span.classList.add("highlight");
    span.textContent = spanText;
    btn.appendChild(span);
    return btn;
  }
  // Project Buttons
  function renderProjects() {
    projects.textContent = ``;
    for (let [key, value] of Object.entries(storage.projects)) {
      let btn = renderButton(key, "project-btn", value.tasks.length);
      projects.appendChild(btn);
      // Generate All count
      allCount += value.tasks.length;
      value.tasks.forEach((task) => {
        let due = formatDueDate(task.getDueDate());
        // Generate Today Count
        if (isToday(parseISO(due))) {
          todayCount += 1;
        }
        if (isFuture(parseISO(due))) {
          upcomingCount += 1;
        }
      });
    }
  }

  //   for (let project of Object.values(mainStorage.projects)) {
  //     project.tasks.forEach((task) => {
  //       let today = format(new Date(), "MM-dd-yyyy");
  //       console.log("today: ", today);
  //       console.log("due: ", task.getDueDate());
  //       if (task.getDueDate() === today) {
  //         renderTask(task);
  //       }
  //     });
  //   }
  renderProjects();

  // Task Buttons
  tasks.textContent = ``;
  let allBtn = renderButton("All", "all-btn", allCount);
  let todayBtn = renderButton("Today", "today-btn", todayCount);
  let upcomingBtn = renderButton("Upcoming", "upcoming-btn", upcomingCount);

  let buttons = [allBtn, todayBtn, upcomingBtn];
  buttons.forEach((btn) => tasks.appendChild(btn));

  // utilize format API and use is upcoming or filter !today function to generate count

  //   return { projects, tasks };
}

export { renderSideBar };
