const project = function (name) {
  let created;
  setDate();
  function setName(input) {
    name = input;
  }

  function getName() {
    return name;
  }

  function setDate() {
    created = new Date().getDate();
    console.log(created);
  }
};

project("Inbox");
// create date created format maybe just start implementing date-fns

export default project;
