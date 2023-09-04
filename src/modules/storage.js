import task from "./task";

const Storage = function () {
  let storageData = {
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

  // let storedData;
  // let parsedData;

  localStorage.setItem("storageData", JSON.stringify(storageData));
  let storedData = localStorage.getItem("storageData");
  storageData = JSON.parse(storedData);

  // function updateStorage() {
  //   localStorage.setItem("storageData", JSON.stringify(storageData));
  //   storedData = localStorage.getItem("storageData");
  //   parsedData = JSON.parse(storedData);
  // }
  // updateStorage();

  function addTask(key, task) {
    storageData.projects[key].tasks.push(task);
    localStorage.setItem("storageData", JSON.stringify(storageData));
  }

  function deleteTask(key, task) {}

  function getStorage() {
    return storageData;
  }

  return { addTask, getStorage };
};

let storage = Storage();
export default storage;

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
