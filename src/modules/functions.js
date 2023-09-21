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

export { appendChildren, validateForm, insertAfter };
