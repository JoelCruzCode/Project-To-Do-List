const task = function (title, dueDate, description) {
  function setTitle(input) {
    title = input;
  }

  function getTitle() {
    return title;
  }

  function setDueDate(input) {
    dueDate = input;
  }

  function getDueDate(input) {
    return dueDate;
  }

  function setDescription(input) {
    description = input;
  }

  function getDescription(input) {
    return description;
  }

  function setType(input) {
    type = input;

    function getType(input) {
      return type;
    }
  }

  return {
    setTitle,
    getTitle,
    setDueDate,
    getDueDate,
    setDescription,
    getDescription,
  };
};
