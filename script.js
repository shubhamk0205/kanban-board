let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");

let taskArea = document.querySelector(".textArea-cont");
let colors = ["lightpink", "lightgreen", "lightblue", "black"];
let addBtnFlag = false;
let removeBtnFlag = false;
let filterBoxColors = document.querySelectorAll(".color");

// console.log(filterBoxColors);

let mainCont = document.querySelector(".main-cont");

let allPriorityColors = document.querySelectorAll(".priority-color");
// console.log(allPriorityColors)

let modalTaskColor = "lightpink";

let ticketsArr = JSON.parse(localStorage.getItem("apptickets")) || [];
console.log(ticketsArr);

function init() {
  if (localStorage.getItem("apptickets")) {
    ticketsArr.forEach(function (ticket) {
      createTicket(ticket.ticketColor,ticket.ticketTask,  ticket.ticketId );
    });
  }
}

init();

// Tickets Array

// Lock variables

let lockOpen = "fa-lock-open";
let lockClose = "fa-lock";

// Modal popup open and Close

addBtn.addEventListener("click", function () {
  addBtnFlag = !addBtnFlag;
  if (addBtnFlag) {
    modalCont.style.display = "flex";
  } else {
    // Hide The modal pop up
    modalCont.style.display = "none";
  }
});

// Ticket removal

removeBtn.addEventListener("click", function () {
  removeBtnFlag = !removeBtnFlag;

  if (removeBtnFlag) {
    alert("Delete button Activated");
    removeBtn.style.color = "red";
  } else {
    removeBtn.style.color = "white";
  }
});

function handleRemoval(ticket) {
  ticket.addEventListener("click", function () {
    if (removeBtnFlag === true) {
      ticket.remove();
    }
  });
}

// Handle change of Priority Colors

function handleColor(ticket) {
  const ticketColorBand = ticket.querySelector(".ticket-color");

  ticketColorBand.addEventListener("click", function () {
    let currentColor = ticketColorBand.style.backgroundColor; // lightblue

    let currentColorIdx = colors.findIndex(function (color) {
      return color === currentColor;
    });

    currentColorIdx++;

    let newColorIdx = currentColorIdx % colors.length;
    let newColor = colors[newColorIdx];
    // console.log(newColor);

    ticketColorBand.style.backgroundColor = newColor;

    // updated color of ticket is added in Local Storage
  });
}

// Handle Lock to edit content

function handleLock(ticket) {
  const ticketLockContainer = ticket.querySelector(".ticket-lock");
  // console.log(ticketLockContainer);

  let ticketLock = ticketLockContainer.children[0];
  let taskArea = ticket.querySelector(".task-area");

  ticketLock.addEventListener("click", function () {
    if (ticketLock.classList.contains(lockClose)) {
      // Lock Open
      ticketLock.classList.add(lockOpen);
      ticketLock.classList.remove(lockClose);
      taskArea.setAttribute("contenteditable", "true");
      // updated task should be saved in the local storage
    } else {
      // Lock Close
      ticketLock.classList.add(lockClose);
      ticketLock.classList.remove(lockOpen);
      taskArea.setAttribute("contenteditable", "false");
    }
  });
}

// function to create the Ticket

function createTicket(taskColor, task, id) {
  const ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `<div class="ticket-color" style="background-color:${taskColor}"></div>
             <div class="ticket-id">${id}</div>
             <div class="task-area">${task}</div>
              <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
              </div>`;

  mainCont.appendChild(ticketCont);
  handleRemoval(ticketCont);
  handleColor(ticketCont);
  handleLock(ticketCont);


}

// Change priority of the Ticket

// get data for the ticket on modal event

modalCont.addEventListener("keydown", function (e) {
  if (e.key == "Shift") {
    const task = taskArea.value;
    const id = shortid();
    // console.log(task, " -> ", id);

    //  create the task ticket
    createTicket(modalTaskColor, task, id);
    modalCont.style.display = "none";
    addBtnFlag = false;
    taskArea.value = "";
    ticketsArr.push({ticketColor: modalTaskColor,ticketTask: task,  ticketId: id,   });
    updateLocalStorage();
  }
});

// Moving Active class to respective color and selecting it
allPriorityColors.forEach(function (colorElem) {
  colorElem.addEventListener("click", function () {
    allPriorityColors.forEach(function (priorityColor) {
      priorityColor.classList.remove("active");
    });
    colorElem.classList.add("active");

    modalTaskColor = colorElem.classList[0]; // lightgreen
    //  console.log(modalTaskColor)
  });
});

// Filter task according to selected Color
filterBoxColors.forEach(function (color) {
  color.addEventListener("click", function () {
    let selectedColor = color.classList[0];
    let allTickets = document.querySelectorAll(".ticket-cont");

    allTickets.forEach(function (ticket) {
      let ticketColors = ticket.querySelector(".ticket-color");
      console.log(ticketColors);

      if (ticketColors.style.backgroundColor === selectedColor) {
        // display the ticktes
        ticket.style.display = "block";
      } else {
        // hide the ticktes
        ticket.style.display = "none";
      }
    });
  });
});

// set Local storage

function updateLocalStorage() {
  localStorage.setItem("apptickets", JSON.stringify(ticketsArr));
}