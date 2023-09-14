import task from "./task";
import { format } from "date-fns";
const Storage = function () {
  // localStorage.clear();
  let storedData = localStorage.getItem("storageData");
  console.log("Stored Data:", storedData);
  let storageData;
  if (storedData) {
    console.log("Data exist in local storage");
    // If data exists in localStorage, parse it
    storageData = JSON.parse(storedData);
    console.log("Parsed Data:", storageData);
  } else {
    // If no data exists in localStorage, initialize with default data
    console.log("No data in local storage. Initializing with defaults.");
    storageData = {
      projects: {
        inbox: {
          name: "Inbox",
          date: "06/06/2019",
          tasks: [],
          id: "123",
        },
        school: {
          name: "School",
          date: "09/09/2020",
          tasks: [],
          id: "987",
        },
      },
    };
  }

  function updateStorage() {
    // Update localStorage with the modified data
    localStorage.setItem("storageData", JSON.stringify(storageData));
    console.log("Updated Data:", storageData);

    console.log("Updated Local Storage:", localStorage.getItem("storageData"));
    console.log(
      "updated Parsed:",
      JSON.parse(localStorage.getItem("storageData"))
    );
  }

  function addTask(key, obj) {
    obj.id = Math.random().toString().slice(2);
    console.log(obj.id);
    if (!storageData.projects[key].tasks) {
      storageData.projects[key].tasks = [obj];
    } else storageData.projects[key].tasks.push(obj);
    updateStorage();
  }

  function deleteTask(key, obj) {
    convertTasks(key);
    let tasksArr = storageData.projects[key].tasks.filter(
      (t) => t.getId() !== obj.id
    );
    console.log(`DELETING`);
    storageData.projects[key].tasks = tasksArr;
    revertTasks(key);
    console.log("taskarr", tasksArr);
    updateStorage();
  }

  function editTask(key, id) {
    let tasksArr = storageData.projects[key].tasks;
    let index = tasksArr.findIndex((t) => t.id === id);
    tasksArr[index];
  }

  function addProject(key) {
    storageData.projects[key] = {
      name: `${key.slice(0, 1).toUpperCase() + key.slice(1)}`,
      date: format(new Date(), "mm/dd/yyyy"),
      tasks: [],
      id: Math.random().toString().slice(2),
    };
  }

  function deleteProject(key, obj) {
    let field = storageData.projects[key];
    if (field) {
      if ((field.id = obj.id)) delete storageData.projects[key];
    } else console.log(`No Project under the name ${key} exists`);
  }

  function convertTasks(key) {
    if (key) {
      Object.values(
        (storageData.projects[key].tasks = storageData.projects[key].tasks.map(
          (t) => {
            let current = task(t.title, t.dueDate, t.description);
            current.setId(t.id);
            return current;
          }
        ))
      );
    } else
      Object.values(storageData.projects).forEach(
        (project) =>
          (project.tasks = project.tasks.map((t) => {
            // console.log(t);
            let current = task(t.title, t.dueDate, t.description);
            current.setId(t.id);
            return current;
            // console.log(t);
          }))
      );
  }

  function revertTasks(key) {
    if (key) {
      Object.values(
        (storageData.projects[key].tasks = storageData.projects[key].tasks.map(
          (t) => {
            let current = {
              title: t.getTitle(),
              dueDate: t.getDueDate(),
              description: t.getDescription(),
              id: t.getId(),
            };
            return current;
          }
        ))
      );
    } else
      Object.values(storageData.projects).forEach(
        (project) =>
          (project.tasks = project.tasks.map((t) => {
            let current = {
              title: t.getTitle(),
              dueDate: t.getDueDate(),
              description: t.getDescription(),
              id: t.getId(),
            };
            return current;
          }))
      );
  }
  function getStorage() {
    return storageData;
  }

  return {
    addTask,
    deleteTask,
    addProject,
    deleteProject,
    getStorage,
    convertTasks,
    revertTasks,
  };
};

let storage = Storage();
export default storage;
// Create an instance of the task object

// storage.addTask("inbox", {
//   title: "hello",
//   dueDate: "12/12/2015",
//   description: "will it finally work? ",
// });

// storage.addTask("inbox", {
//   title: "hi",
//   dueDate: "12/12/2015",
//   description: "round2? ",
// });

// storage.addTask("school", {
//   title: "hello",
//   dueDate: "12/12/2015",
//   description: "will it finally work? ",
// });

// storage.addTask("school", {
//   title: "hi",
//   dueDate: "12/12/2015",
//   description: "round2? ",
// });

let mainStorage = storage.getStorage();
// let identifier = mainStorage.projects.inbox.tasks[0].id;
console.log("main Storage: ", mainStorage);

// storage.deleteTask("inbox", {
//   name: "Inbox",
//   date: "06/06/2019",
//   tasks: [],
//   id: "123",
// });

// setTimeout(function () {
//   storage.deleteTask("inbox", {
//     name: "Inbox",
//     date: "06/06/2019",
//     tasks: [],
//     id: identifier,
//   });
//   console.log("main Storage: ", mainStorage), 8000;
// });
// storage.convertTasks("school");
// console.log("Converted Storage: ", mainStorage);
// console.log("based");

// setTimeout(function () {
//   storage.revertTasks("school");
//   console.log("Reverted Storage: ", mainStorage);
// }, 10000);
// storage.revertTasks();

/*
storageData {
    Projects: {
        Inbox: {
            name: inbox;
            date: created;
            tasks: {
                task[0]: value[0];
                task[1]: value[1];
                task[2]: value[2];
            }
        } Project[0]: {
            name: projectname;
            date: created;
            task: {
                task[0]: value[0];
                task[1]: value[1];
                task[2]: value[2];
            }
        }
    }
}
*/
