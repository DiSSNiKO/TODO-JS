//DOM elements

const root = document.documentElement;
const form = document.querySelector("#newtodoform");
const newTaskInput = document.querySelector("#newtodo");
const [showAll, showActive, showCompleted, clearCompleted] = document.querySelectorAll(".buttonZ");
const taskCont = document.querySelector(".task-cont");
const darkLight = document.querySelector(".darkLight");
const backgroundImg = document.querySelector(".background-image");
const itemsLeft = document.querySelector(".items-left-num");
const firstCheckbox = document.querySelector("#formInput");

//--logic--//

let renderables = []; //Use this for storage ig
let taskIndex = 0; //Would rather not use this
let totalEntries = 0;
let totalEntriesChecked = 0;
let allChecked = false;
let isLight = false;

// Add new todo

function displayEntries() {
  if (totalEntries <= 99) {
    itemsLeft.textContent = totalEntries;
  } else {
    itemsLeft.textContent = "99+"
  }
}

function checkForSpaces(str) {
  let allSpace = true;
  for (let char of str) {
    if (char != " ") {
      allSpace = false;
    }
  }
  return allSpace;
}


function addDrag(bozo) {
  bozo.addEventListener('dragstart', () => {
    bozo.classList.add('inDrag');
  });
  bozo.addEventListener('dragend', () => {
    bozo.classList.remove('inDrag');
  });
}
function newtodo(e) {
  e.preventDefault();
  const tododesc = newTaskInput.value;
  if (tododesc === "" || checkForSpaces(tododesc)) {
    return "hell nah";
  }
  const newHTML = ` <div class="task" draggable="true">
                        <div class="label-helper">
                            <input type="checkbox" class='checkboksu' id='fi${taskIndex}'>
                            <label class="check" for='fi${taskIndex}'>
                                <span class="checkmark usable-checkmark"><img class="cross unselectable" src="/images/icon-check.svg" alt=""></span>
                            </label>
                        </div>
                        <span class="descSpan">${tododesc}</span>
                        <img src="/images/x-symbol-svgrepo-com.svg" alt="Close" class="closeTask unselectable">
                    </div>
                    `;
  newTaskInput.value = "";
  taskCont.insertAdjacentHTML("beforeend", newHTML);
  addDrag(taskCont.lastElementChild);
  renderables.push(taskCont.lastElementChild);
  taskIndex += 1;
  totalEntries += 1;
  firstCheckbox.checked = false;
  firstCheckbox.nextElementSibling.classList.remove("isChecked");
  displayEntries();
}

//Drag functions

function dragOn(e) {
  e.preventDefault();
  const dragElem = document.querySelector(".inDrag");
  const afterElement = dragAfterElement(taskCont, e.clientY);
  if (afterElement === null) {
    taskCont.appendChild(dragElem);
  } else {
    taskCont.insertBefore(dragElem, afterElement);
  }
  renderables = [...taskCont.querySelectorAll(".task")];
}
function dragAfterElement(container, y) {
  const draggableElems = [...container.querySelectorAll(".task:not(.inDrag)")];
  let afterElem;
  let finalOffset = Number.NEGATIVE_INFINITY;
  draggableElems.forEach((elem) => {
    const boundbox = elem.getBoundingClientRect();
    const offset = y - boundbox.top - boundbox.height / 2;
    if (offset < 0 && offset > finalOffset) {
      finalOffset = offset;
      afterElem = elem;
    }
  });
  return afterElem;
  //ITS MY WAY OR THE HIIIIIGHWAY <333

  // return draggableElems.reduce((closest, child) => {
  //   const boundbox = child.getBoundingClientRect();
  //   const offset = y - boundbox.top - boundbox.height / 2;
  //   if (offset < 0 && offset > closest.offset) {
  //     return { offset: offset, element: child };
  //   } else {
  //     return closest;
  //   }
  // }, { offset: Number.NEGATIVE_INFINITY }).element; 

}


//checkmark shenanigans (this kinda sucks :D :3)
function checkfirstCheckbox(add) {
  if (add === true) {
    firstCheckbox.nextElementSibling.classList.add("isChecked");
  } else {
    firstCheckbox.nextElementSibling.classList.remove("isChecked");
  }
}

function checkmarkShenanigans(eTarget) {
  if (eTarget.classList.contains("cross")) {
    eTarget = eTarget.closest(".checkmark");
  }
  if (eTarget.classList.contains("checkmark") || eTarget.classList.contains("check")) {
    const checkbox = eTarget.closest(".check").previousElementSibling;
    if (!checkbox.checked) {
      eTarget.closest(".check").classList.add("isChecked");
      eTarget.closest(".task").classList.add("completed");
      totalEntriesChecked += 1;
      if (totalEntries === totalEntriesChecked) {
        allChecked = true;
        firstCheckbox.checked = true;
        checkfirstCheckbox(true);
      }
    } else {
      eTarget.closest(".check").classList.remove("isChecked");
      eTarget.closest(".task").classList.remove("completed");
      totalEntriesChecked -= 1;
      if (allChecked) {
        firstCheckbox.checked = false;
        checkfirstCheckbox(false);
        allChecked = false;
      }
    }
  }
}

//Delete single task

function deleteFromRenderables(taskId) {
  let newArray = [];
  renderables.forEach((elem) => {
    if (!(elem.querySelector(".checkboksu").id === taskId)) {
      newArray.push(elem);
    }
  });
  return newArray;
}

function singleTaskDelete(eTarget) {
  if (eTarget.classList.contains("closeTask")) {
    const curTask = eTarget.closest(".task");
    const aidi = curTask.querySelector(".checkboksu").id;
    renderables = deleteFromRenderables(aidi);
    if (curTask.classList.contains("completed")) {
      totalEntriesChecked -= 1;
    }
    curTask.remove();
    totalEntries -= 1;
    if (totalEntries <= 99) {
      itemsLeft.textContent = totalEntries;
    }
    if (renderables.length === 0) {
      firstCheckbox.checked = false;
      checkfirstCheckbox(false);
      allChecked = false;
    }
    if (totalEntries === totalEntriesChecked && renderables.length != 0) {
      firstCheckbox.checked = true;
      checkfirstCheckbox(true);
      allChecked = true;
    }
  }
}


//task cont event listener
function bigTaskContFunc(e) {
  let eTarget = e.target;
  checkmarkShenanigans(eTarget);
  singleTaskDelete(eTarget);
}
// Delete completed tasks

function deleteCompleted() {
  const removables = taskCont.querySelectorAll(".completed");
  removables.forEach((elem) => {
    elem.remove();
    totalEntries -= 1;
    totalEntriesChecked -= 1;
  });
  renderables = Array.from(taskCont.querySelectorAll(".task"));
  firstCheckbox.nextElementSibling.classList.remove("isChecked");
  firstCheckbox.checked = false;
  displayEntries();
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
function completeAllOrNot() {
  if (firstCheckbox.checked) {
    checkfirstCheckbox(true);
    renderables.forEach((elem) => {
      elem.classList.add("completed");
      elem.children[0].children[0].checked = true;
      elem.children[0].children[1].classList.add('isChecked');

    });
    allChecked = true;
    totalEntriesChecked = totalEntries;
  } else {
    checkfirstCheckbox(false);
    renderables.forEach((elem) => {
      elem.classList.remove("completed");
      elem.children[0].children[0].checked = false;
      elem.children[0].children[1].classList.remove('isChecked');
    });
    allChecked = false;
    totalEntriesChecked = 0;
  }
}

//Change theme

function whyWouldYouChooseLight() {
  if (!isLight) {
    isLight = true;
    darkLight.src = "/images/icon-moon.svg";
    backgroundImg.src = "/images/bg-desktop-light.jpg"
    root.style.setProperty('--mainColor', 'hsl(0, 0%, 98%)');
    root.style.setProperty('--bodyColor', 'hsl(236, 33%, 92%)');
    root.style.setProperty('--descColor', 'hsl(235, 19%, 35%)');
    root.style.setProperty('--taskBorder', 'hsl(236, 9%, 61%)');
    root.style.setProperty('--buttonHover', 'hsl(235, 0%, 0%)');
  } else {
    isLight = false;
    darkLight.src = "/images/icon-sun.svg";
    backgroundImg.src = "/images/bg-desktop-dark.jpg"
    root.style.setProperty('--mainColor', 'hsl(235, 24%, 19%)');
    root.style.setProperty('--bodyColor', 'hsl(235, 21%, 11%)');
    root.style.setProperty('--descColor', 'hsl(234, 39%, 85%)');
    root.style.setProperty('--taskBorder', 'hsl(237, 14%, 26%)');
    root.style.setProperty('--buttonHover', 'hsl(236, 33%, 92%)');
  }
}

//event listeners

form.addEventListener("submit", newtodo);
clearCompleted.addEventListener("click", deleteCompleted);
taskCont.addEventListener("click", bigTaskContFunc);
taskCont.addEventListener("dragover", dragOn);
showCompleted.addEventListener("click", showComp);
showActive.addEventListener("click", showAct);
showAll.addEventListener("click", showOl);
firstCheckbox.addEventListener('change', completeAllOrNot);
darkLight.addEventListener('click', whyWouldYouChooseLight);

