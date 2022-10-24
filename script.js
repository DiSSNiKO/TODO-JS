//DOM elements

const form = document.querySelector("#newtodoform");
const newTaskInput = document.querySelector("#newtodo");
const [showAll, showActive, showCompleted, clearCompleted] = document.querySelectorAll(".buttonZ");
const taskCont = document.querySelector('.task-cont');


//logic

let renderables = [];
let checkboxes = [];
let totalEntries = 0;

// Add new todo

function newtodo(e) {
    e.preventDefault();
    const tododesc = newTaskInput.value;
    if (tododesc === '') {
        return 0;
    }
    const newHTML = `<div class="task">
                        <div class="label-helper">
                            <input type="checkbox" id='fi${totalEntries}'>
                            <label class="check" for='fi${totalEntries}'>
                                <span class="checkmark usable-checkmark"><img class="cross" src="/images/icon-check.svg" alt=""></span>
                            </label>
                        </div>
                        <span class="descSpan">${tododesc}</span>
                     </div>
                    `
    newTaskInput.value = '';
    taskCont.insertAdjacentHTML("beforeend", newHTML);
    renderables.push(taskCont.lastElementChild);
    const checkbox = renderables[totalEntries].querySelector(`#fi${totalEntries}`);
    checkbox.dataset.todoNum = totalEntries;
    const checkboxLight = renderables[totalEntries].querySelector(".check");
    checkbox.addEventListener('change', function (e) {
        if (this.checked) {
            checkboxLight.classList.add("isChecked");
            renderables[checkbox.dataset.todoNum].classList.add('completed');
        } else {
            checkboxLight.classList.remove("isChecked");
            renderables[checkbox.dataset.todoNum].classList.remove('completed');
        }
    })
    if (renderables.length === 1) {
        renderables[totalEntries].classList.add("firstTask");
    }
    totalEntries += 1;
}

// Delete completed tasks

function deleteCompleted(e) {
    const removables = taskCont.querySelectorAll(".completed");
    removables.forEach((elem) => elem.remove());
    if (!taskCont.firstElementChild.classList.contains("firstTask")) {
        taskCont.firstElementChild.classList.add("firstTask");
    }
}

form.addEventListener('submit', newtodo);
clearCompleted.addEventListener('click', deleteCompleted);