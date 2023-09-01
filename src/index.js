import "./style.css";
import headerBG from "./assets/world.jpeg";

const element = document.createElement("div");
document.body.appendChild(element);
element.classList.add("content2");
element.textContent = "element";
const content = document.createElement("p");
content.textContent = "Content";
content.classList.add("hello");
document.body.appendChild(content);
const headerImg = new Image();
headerImg.src = headerBG;
content.appendChild(headerImg);
