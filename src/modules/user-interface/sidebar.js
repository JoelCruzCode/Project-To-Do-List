import { isFuture, isToday, parseISO } from "date-fns";
import { formatDueDate } from "../functions";

function renderSideBar(storage) {
  const projects = document.querySelector(".projects");
  const tasks = document.querySelector(".aside-tasks");

  let allCount = 0;
  let todayCount = 0;
  let upcomingCount = 0;

  function renderButton(btnText, btnClass, spanText) {
    const btn = document.createElement("button");
    btn.textContent = `${btnText} `;
    btn.classList.add(btnClass);
    const span = document.createElement("span");
    span.classList.add("highlight");
    span.textContent = spanText;
    btn.appendChild(span);
    return btn;
  }
  // Project Buttons
  function renderProjects() {
    projects.textContent = "";
    for (const [key, value] of Object.entries(storage.projects)) {
      const btn = renderButton(key, "project-btn", value.tasks.length);
      projects.appendChild(btn);
      // Generate All count
      allCount += value.tasks.length;
      value.tasks.forEach((task) => {
        const due = formatDueDate(task.getDueDate());
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
  renderProjects();

  // Task Buttons
  tasks.textContent = "";
  const allBtn = renderButton("All", "all-btn", allCount);
  const todayBtn = renderButton("Today", "today-btn", todayCount);
  const upcomingBtn = renderButton("Upcoming", "upcoming-btn", upcomingCount);

  const buttons = [allBtn, todayBtn, upcomingBtn];
  buttons.forEach((btn) => tasks.appendChild(btn));
}

export { renderSideBar };
