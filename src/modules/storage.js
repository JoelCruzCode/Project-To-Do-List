import task from "./task";
import { format } from "date-fns";

const Storage = function () {
  localStorage.clear();
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

  function addTask(obj, key) {
    // obj.id = Math.random().toString().slice(2);
    // why does id return undefined when i try to create it in task object
    // changed logic in addForm()
    obj.type = key;
    console.log(obj.id);
    if (!storageData.projects[key].tasks) {
      storageData.projects[key].tasks = [obj];
    } else storageData.projects[key].tasks.push(obj);
    updateStorage();
  }

  function deleteTask(obj, key) {
    convertTasks(key);
    let tasksArr = storageData.projects[key].tasks.filter(
      (t) => t.getId() !== obj.id
    );
    console.log(`DELETING`);
    storageData.projects[key].tasks = tasksArr;
    console.log("taskArr: ", tasksArr);
    revertTasks(key);
    updateStorage();
  }

  function editTask(obj, key) {
    let tasksArr = storageData.projects[key].tasks;
    let index = tasksArr.findIndex((t) => t.id === obj.id);
    if (tasksArr[index].type === obj.type) {
      tasksArr[index] = obj;
    } else {
      let updatedArray = tasksArr.filter((t) => t.id !== obj.id);
      storageData.projects[key].tasks = updatedArray;
      storageData.projects[obj.type].tasks.push(obj);
    }
    updateStorage();
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
      console.log("key: ", key);
      Object.values(
        (storageData.projects[key].tasks = storageData.projects[key].tasks.map(
          (t) => {
            let current = task(t.title, t.dueDate, t.description);
            current.setId(t.id);
            current.setType(t.type);
            console.log("converted task: ", current);
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
            current.setType(t.type);
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
              type: t.getType(),
            };

            console.log("reverted task: ", current);
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
              type: t.getType(),
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
    editTask,
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

storage.addTask(
  {
    title: "hello",
    dueDate: "09-25-2023",
    description: "will it finally work? ",
    id: "123",
  },
  "inbox"
);

storage.addTask(
  {
    title: "hi",
    dueDate: "12-12-2015",
    description: "round2? ",
    id: "345",
  },
  "inbox"
);

storage.addTask(
  {
    title: "hello",
    dueDate: "12-12-2015",
    description: "will it finally work? ",
    id: "456",
  },
  "school"
);

storage.addTask(
  {
    title: "hi",
    dueDate: "09-23-2023",
    description: "round2? ",
    id: "567",
  },
  "school"
);

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
