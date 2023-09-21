const task = function (title, dueDate, description) {
  let type;
  let id = Math.random().toString().slice(2);

  function setTitle(input) {
    title = input;
  }

  function getTitle() {
    return title;
  }

  function setDueDate(input) {
    dueDate = input;
  }

  function getDueDate() {
    return dueDate;
  }

  function setDescription(input) {
    description = input;
  }

  function getDescription() {
    return description;
  }

  function setType(input) {
    type = input;
  }
  function getType() {
    return type;
  }

  function getId() {
    return id;
  }

  function setId(input) {
    id = input;
  }

  return {
    setTitle,
    getTitle,
    setDueDate,
    getDueDate,
    setDescription,
    getDescription,
    setType,
    getType,
    getId,
    setId,
  };
};

export default task;
