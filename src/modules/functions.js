const appendChildren = (parent, children) => {
  children.forEach((child) => parent.appendChild(child));
};

function validateForm(form) {
  let x = document.forms[form]["name"].value;
  if (x == "") {
    alert("Title must be filled out");
    return false;
  } else {
    return true;
  }
}

function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function formatDate(string) {
  let split = string.split("-");
  return `${split[1]}-${split[2]}-${split[0]}`;
}

function formatDueDate(string) {
  let split = string.split("-");
  return `${split[2]}-${split[0]}-${split[1]}`;
}

export { appendChildren, validateForm, insertAfter, formatDate, formatDueDate };
