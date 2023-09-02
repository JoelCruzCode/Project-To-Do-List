import { format } from "date-fns";

const project = function (name) {
  let dateCreated;
  let sections = [];

  function setName(input) {
    name = input;
  }

  function getName() {
    return name;
  }

  function setDate() {
    dateCreated = format(new Date(), "mm/dd/yyyy");
  }

  function getDate() {
    return dateCreated;
  }

  function addSection(name) {
    let section = {
      title: name,
    };
    sections.push(section);
  }

  setDate();
  return { getName, setName, getDate, addSection };
};

const p = project("Inbox");
console.log(p.getDate(), p.getName());
export default project;

// let day = d.getDate();
// let month = d.getMonth();
// let year = d.getFullYear();
// console.log(d);
// console.log(d.getTime());
// console.log(month, day, year);
