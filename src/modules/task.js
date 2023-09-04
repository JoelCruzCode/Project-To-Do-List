const task = function (title, dueDate, description) {
  let type;
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

  return {
    setTitle,
    getTitle,
    setDueDate,
    getDueDate,
    setDescription,
    getDescription,
    setType,
    getType,
  };
};

export default task;
