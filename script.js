const dropdown = document.querySelector("#dropdown");
const dropBtn = document.querySelector("#profile-btn");

dropBtn.addEventListener("click", (event) => {
  event.preventDefault();
  dropdown.classList.toggle("show");
});

document.addEventListener("click", (event) => {
  if (!dropBtn.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});

const helpBtn = document.querySelector(".help-button");

helpBtn.addEventListener("click", () => {
  alert("We will contact you soon");
});

const modal = document.querySelector("#modal");
const settgBtn = document.getElementById("settingsBtn");

settgBtn.addEventListener("click", (event) => {
  event.preventDefault();
  modal.showModal();
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.close();
  }
});

const modalAI = document.querySelector("#modalAI");
const chatBtn = document.getElementById("aiBtn");

chatBtn.addEventListener("click", (event) => {
  event.preventDefault();
  modalAI.showModal();
});

modalAI.addEventListener("click", (event) => {
  if (event.target === modalAI) {
    modalAI.close();
  }
});

const modalTask = document.querySelector("#modalTask");
const addBtn = document.querySelector("#addBtn");

addBtn.addEventListener("click", (event) => {
  event.preventDefault();
  modalTask.showModal();
});

modalTask.addEventListener("click", (event) => {
  if (event.target === modalTask) {
    modalTask.close();
  }
});

const docStatus = document.querySelector("#docStatus");
const docAction = document.querySelector("#actionStatus");

const statusOptions = document.querySelector("#statusOptions");

const actionOptions = document.querySelector("#actionOptions");

const selectedStatus = document.querySelector("#selectedStatus");
const selectedAction = document.querySelector("#selectedAction");

const statusValue = document.querySelector("#statusValue");
const actionValue = document.querySelector("#actionValue");

docStatus.addEventListener("click", (event) => {
  event.stopPropagation();

  statusOptions.classList.toggle("show");
  actionOptions.classList.remove("show");
});

statusOptions.querySelectorAll(".dropdown-option").forEach((option) => {
  option.addEventListener("click", () => {
    selectedStatus.textContent = option.textContent.trim();
    statusValue.value = option.dataset.value;
    statusOptions.classList.remove("show");
  });
});

docAction.addEventListener("click", (event) => {
  event.stopPropagation();

  actionOptions.classList.toggle("show");
  statusOptions.classList.remove("show");
});

actionOptions.querySelectorAll(".dropdown-option").forEach((option) => {
  option.addEventListener("click", () => {
    selectedAction.textContent = option.textContent.trim();
    actionValue.value = option.dataset.value;
    actionOptions.classList.remove("show");
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".form-container")) {
    statusOptions.classList.remove("show");
  }

  if (!event.target.closest(".action-container")) {
    actionOptions.classList.remove("show");
  }
});
