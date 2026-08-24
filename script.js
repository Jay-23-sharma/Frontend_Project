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
const canBtn = document.querySelector("#canBtn");

const docStatus = document.querySelector("#docStatus");
const docAction = document.querySelector("#actionStatus");

const statusOptions = document.querySelector("#statusOptions");
const actionOptions = document.querySelector("#actionOptions");

const selectedStatus = document.querySelector("#selectedStatus");
const selectedAction = document.querySelector("#selectedAction");

const docTitle = document.querySelector("#docTitle");
const statusValue = document.querySelector("#statusValue");
const actionValue = document.querySelector("#actionValue");

const documentBody = document.querySelector("#documentBody");
const addForm = document.querySelector("#addForm");

let documents = JSON.parse(localStorage.getItem("document")) || [];
let editingId = null;

function saveDocuments() {
  localStorage.setItem("document", JSON.stringify(documents));
}

function resetForm() {
  addForm.reset();

  selectedStatus.textContent = "Select Current Status";
  selectedAction.textContent = "Action Required";

  statusValue.value = "";
  actionValue.value = "";

  editingId = null;
}

function getStatus(status) {
  if (status === "completed") {
    return "Completed";
  }

  if (status === "pending") {
    return "Pending";
  }

  if (status === "signRequired") {
    return "Needs Signing";
  }

  return status;
}

function getAction(action) {
  if (action === "sign-now") {
    return "Sign now";
  }

  if (action === "preview") {
    return "Preview";
  }

  if (action === "downloadPdf") {
    return "Download PDF";
  }

  return action;
}

function getStatusClass(status) {
  if (status === "completed") {
    return "complete";
  }

  if (status === "pending") {
    return "pending";
  }

  if (status === "signRequired") {
    return "signRequired";
  }

  return "";
}

function addDocuments() {
  documentBody.innerHTML = "";

  documents.forEach((doc) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <input type="checkbox">
      </td>

      <td>
        <a class="content-text" href="#">
          ${doc.title}
        </a>
      </td>

      <td>
        <p class="status ${getStatusClass(doc.status)}">
          ${getStatus(doc.status)}
        </p>
      </td>

      <td>
        ${doc.date}
      </td>

      <td>
        <div class="access">

          <button class="action" type="button">
            ${getAction(doc.action)}
          </button>

          <div class="table-menu">

            <a href="#" class="table-dropdown">
              <img src="icons/more.png" alt="">
            </a>

            <div class="table-dropdown-options">

              <div>
                <a
                  href="#"
                  class="edit-document"
                  data-id="${doc.id}"
                >
                  Edit
                </a>
              </div>

              <div>
                <a
                  href="#"
                  class="delete-document"
                  data-id="${doc.id}"
                >
                  Delete
                </a>
              </div>

            </div>

          </div>

        </div>
      </td>
    `;

    documentBody.appendChild(row);
  });
}

addBtn.addEventListener("click", (event) => {
  event.preventDefault();
  resetForm();

  modalTask.showModal();
});

canBtn.addEventListener("click", () => {
  modalTask.close();
  resetForm();
});

modalTask.addEventListener("click", (event) => {
  if (event.target === modalTask) {
    modalTask.close();
    resetForm();
  }
});

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

  if (!event.target.closest(".table-menu")) {
    document
      .querySelectorAll(".table-dropdown-options")
      .forEach((option) => {
        option.classList.remove("show");
      });
  }
});

documentBody.addEventListener("click", (event) => {
  const moreBtn = event.target.closest(".table-dropdown");

  if (moreBtn) {
    event.preventDefault();
    event.stopPropagation();

    const menu = moreBtn.closest(".table-menu");
    const options = menu.querySelector(".table-dropdown-options");

    document
      .querySelectorAll(".table-dropdown-options")
      .forEach((item) => {
        if (item !== options) {
          item.classList.remove("show");
        }
      });

    options.classList.toggle("show");

    return;
  }

  const editBtn = event.target.closest(".edit-document");

  if (editBtn) {
    event.preventDefault();

    const id = editBtn.dataset.id;

    const doc = documents.find(
      (item) => String(item.id) === String(id)
    );

    if (!doc) {
      return;
    }

    editingId = id;

    docTitle.value = doc.title;
    statusValue.value = doc.status;
    actionValue.value = doc.action;

    selectedStatus.textContent = getStatus(doc.status);
    selectedAction.textContent = getAction(doc.action);

    modalTask.showModal();

    return;
  }

  const deleteBtn = event.target.closest(".delete-document");

  if (deleteBtn) {
    event.preventDefault();

    const id = deleteBtn.dataset.id;

    documents = documents.filter(
      (doc) => String(doc.id) !== String(id)
    );

    saveDocuments();
    addDocuments();

    return;
  }
});

addForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = docTitle.value.trim();
  const status = statusValue.value;
  const action = actionValue.value;

  if (title === "") {
    alert("Please enter a document title.");
    return;
  }

  if (status === "") {
    alert("Please select a status.");
    return;
  }

  if (action === "") {
    alert("Please select an action.");
    return;
  }

  if (editingId !== null) {
    const doc = documents.find(
      (item) => String(item.id) === String(editingId)
    );

    if (doc) {
      doc.title = title;
      doc.status = status;
      doc.action = action;
      doc.date = new Date().toLocaleString();
    }
  } else {
    const newDocument = {
      id: crypto.randomUUID(),
      title: title,
      status: status,
      action: action,
      date: new Date().toLocaleString()
    };

    documents.push(newDocument);
  }

  saveDocuments();
  addDocuments();

  modalTask.close();

  resetForm();
});

addDocuments();