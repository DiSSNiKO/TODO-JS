//DOM elements

const form = document.querySelector("#newtodoform");
const newTaskInput = document.querySelector("#newtodo");
const [showAll, showActive, showCompleted, clearCompleted] =
  document.querySelectorAll(".buttonZ");
const taskCont = document.querySelector(".task-cont");
const itemsLeft = document.querySelector(".items-left-num");

//--logic--//

let renderables = []; //Use this for storage ig
let taskIndex = 0; //Would rather not use this
let totalEntries = 0;

// Add new todo
function checkForSpaces(str) {
  let allSpace = true;
  for (let char of str) {
    if (char != " ") {
      allSpace = false;
    }
  }
  return allSpace;
}
function newtodo(e) {
  e.preventDefault();
  const tododesc = newTaskInput.value;
  if (tododesc === "" || checkForSpaces(tododesc)) {
    return "hell nah";
  }
  const newHTML = `<div class="task">
                        <div class="label-helper">
                            <input type="checkbox" class='checkboksu' id='fi${taskIndex}'>
                            <label class="check" for='fi${taskIndex}'>
                                <span class="checkmark usable-checkmark"><img class="cross" src="/images/icon-check.svg" alt=""></span>
                            </label>
                        </div>
                        <span class="descSpan">${tododesc}</span>
                     </div>
                    `;
  newTaskInput.value = "";
  taskCont.insertAdjacentHTML("beforeend", newHTML);
  renderables.push(taskCont.lastElementChild);
  if (!taskCont.firstElementChild.classList.contains("firstTask")) {
    taskCont.firstElementChild.classList.add("firstTask");
  }
  taskIndex += 1;
  totalEntries += 1;
  itemsLeft.textContent = totalEntries;
}

//checkmark shenanigans (this kinda sucks :D :3)
function checkmarkShenanigans(e) {
  let eTarget = e.target;
  console.log(eTarget);
  if (eTarget.classList.contains("cross")) {
    eTarget = eTarget.closest(".checkmark");
  }
  if (
    eTarget.classList.contains("checkmark") ||
    eTarget.classList.contains("check")
  ) {
    const checkbox = eTarget.closest(".check").previousElementSibling;
    if (!checkbox.checked) {
      eTarget.closest(".check").classList.add("isChecked");
      eTarget.closest(".task").classList.add("completed");
    } else {
      eTarget.closest(".check").classList.remove("isChecked");
      eTarget.closest(".task").classList.remove("completed");
    }
  }
}
// Delete completed tasks

function deleteCompleted(e) {
  const removables = taskCont.querySelectorAll(".completed");
  removables.forEach((elem) => {
    elem.remove();
    totalEntries -= 1;
  });
  renderables = Array.from(taskCont.querySelectorAll(".task"));
  if (taskCont.firstElementChild) {
    if (!taskCont.firstElementChild.classList.contains("firstTask")) {
      taskCont.firstElementChild.classList.add("firstTask");
    }
  }
  itemsLeft.textContent = totalEntries;
}

//filter listings
function showComp() {
  renderables.forEach((elem) => {
    if (!elem.classList.contains("completed")) {
      elem.style.display = "none";
    } else {
      elem.style.display = "grid";
    }
  });
}
function showAct() {
  renderables.forEach((elem) => {
    if (elem.classList.contains("completed")) {
      elem.style.display = "none";
    } else {
      elem.style.display = "grid";
    }
  });
}
function showOl() {
  renderables.forEach((elem) => {
    elem.style.display = "grid";
  });
}

//event listeners

form.addEventListener("submit", newtodo);
clearCompleted.addEventListener("click", deleteCompleted);
taskCont.addEventListener("click", checkmarkShenanigans);
showCompleted.addEventListener("click", showComp);
showActive.addEventListener("click", showAct);
showAll.addEventListener("click", showOl);
