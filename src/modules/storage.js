import task from "./task";

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
        },
        school: {
          name: "School",
          date: "09/09/2020",
          tasks: [],
        },
      },
    };
  }

  function addTask(key, t) {
    const newTask = task(t.title, t.dueDate, t.description);
    console.log("Adding Task:", newTask);
    if (!storageData.projects[key].tasks) {
      storageData.projects[key].tasks = [newTask];
    } else storageData.projects[key].tasks.push(newTask);

    // Update localStorage with the modified data
    localStorage.setItem("storageData", JSON.stringify(storageData));
    console.log("Updated Data:", storageData);

    console.log("Updated Local Storage:", localStorage.getItem("storageData"));
    console.log(
      "updated Parsed:",
      JSON.parse(localStorage.getItem("storageData"))
    );
  }

  function deleteTask(key, task) {
    // Implement your deleteTask logic here
  }

  function getStorage() {
    return storageData;
  }

  return { addTask, deleteTask, getStorage };
};

let storage = Storage();
export default storage;
// Create an instance of the task object

storage.addTask("inbox", {
  title: "hello",
  dueDate: "12/12/2015",
  description: "will it finally work? ",
});

storage.addTask("inbox", {
  title: "hi",
  dueDate: "12/12/2015",
  description: "round2? ",
});

// let mainStorage = storage.getStorage();

// console.log("main Storage: ", mainStorage);

// mainStorage.projects.inbox.tasks.forEach((t) => {
//   console.log("t", t);
//   console.log("direct notation:", t.title); // Access the title property
//   console.log("getTitle():", t.getTitle()); // Access the getTitle() method
//   console.log("getDueDate():", t.getDueDate());
//   console.log("getDescription():", t.getDescription());
// });
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
