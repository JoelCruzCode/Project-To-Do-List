const appendChildren = (parent, children) => {
  children.forEach((child) => parent.appendChild(child));
};

function validateForm() {
  let x = document.forms["task-form"]["name"].value;
  if (x == "") {
    alert("Title must be filled out");
    return false;
  } else {
    return true;
  }
}

export { appendChildren, validateForm };
