const dropdown = document.querySelector("#dropdown");
const dropBtn = document.querySelector("#profile-btn");

const helpBtn = document.querySelector(".help-button");

const modal = document.querySelector("#modal");
const settgBtn = document.getElementById("settingsBtn");

const modalAI = document.querySelector("#modalAI");
const chatBtn = document.getElementById("aiBtn");

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

const pendingContainer = document.querySelector("#pendingContainer");
const pendingCount = document.querySelector("#pendingCount");

const documentBody = document.querySelector("#documentBody");
const addForm = document.querySelector("#addForm");

const selectAll = document.querySelector("#selectAll");
const removeBtn = document.querySelector("#removeBtn");

const searchBox = document.querySelector(".box");

let documents = JSON.parse(localStorage.getItem("document")) || [];
let editingId = null;

dropBtn.addEventListener("click", (event) => {
  event.preventDefault();
  dropdown.classList.toggle("show");
});

document.addEventListener("click", (event) => {
  if (!dropBtn.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});

helpBtn.addEventListener("click", () => {
  alert("Our service team will contact you soon");
});

settgBtn.addEventListener("click", (event) => {
  event.preventDefault();
  modal.showModal();
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.close();
  }
});

chatBtn.addEventListener("click", (event) => {
  event.preventDefault();
  modalAI.showModal();
});

modalAI.addEventListener("click", (event) => {
  if (event.target === modalAI) {
    modalAI.close();
  }
});

function saveDocuments() {
  localStorage.setItem("document", JSON.stringify(documents));
}

function resetForm() {
  addForm.reset();

  selectedStatus.textContent = "Select Current Status";
  selectedAction.textContent = "Action Required";

  statusValue.value = "";
  actionValue.value = "";

  pendingCount.value = "";
  pendingContainer.classList.remove("show");

  editingId = null;
}

function showPendingInput() {
  if (statusValue.value === "pending") {
    pendingContainer.classList.add("show");
  } else {
    pendingContainer.classList.remove("show");
    pendingCount.value = "";
  }
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

function getPendingText(count) {
  const number = Number(count);

  if (!number || number < 1) {
    return "";
  }

  if (number === 1) {
    return number;
  }

  return number;
}

function addDocuments() {
  documentBody.innerHTML = "";

  selectAll.checked = false;

  const searchText = searchBox.value.trim().toLowerCase();

  const filteredDocuments = documents.filter((doc) => {
    const title = doc.title.toLowerCase();
    const status = getStatus(doc.status).toLowerCase();
    const action = getAction(doc.action).toLowerCase();

    const pendingText = getPendingText(doc.pendingCount);

    return (
      title.includes(searchText) ||
      status.includes(searchText) ||
      action.includes(searchText)
    );
  });

  filteredDocuments.forEach((doc) => {
    const row = document.createElement("tr");

    const pendingText =
      doc.status === "pending" ? getPendingText(doc.pendingCount) : "";

    row.innerHTML = `
      <td>
        <input
          type="checkbox"
          class="document-checkbox"
          data-id="${doc.id}"
        >
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

        ${
          pendingText
            ? `<p class="pending-info">Waiting for ${pendingText} people</p>`
            : ""
        }
      </td>

      <td>
        ${doc.date}
        <br>
        ${doc.time}
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

selectAll.addEventListener("change", () => {
  const checkboxes = document.querySelectorAll(".document-checkbox");

  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectAll.checked;
  });
});

documentBody.addEventListener("change", (event) => {
  if (!event.target.classList.contains("document-checkbox")) {
    return;
  }

  const checkboxes = document.querySelectorAll(".document-checkbox");

  const checkedBoxes = document.querySelectorAll(".document-checkbox:checked");

  selectAll.checked =
    checkboxes.length > 0 && checkedBoxes.length === checkboxes.length;
});

removeBtn.addEventListener("click", () => {
  const selectedCheckboxes = document.querySelectorAll(
    ".document-checkbox:checked",
  );

  if (selectedCheckboxes.length === 0) {
    alert("Please select at least one document to remove.");
    return;
  }

  const selectedIds = Array.from(selectedCheckboxes).map(
    (checkbox) => checkbox.dataset.id,
  );

  documents = documents.filter((doc) => !selectedIds.includes(String(doc.id)));

  saveDocuments();

  selectAll.checked = false;

  addDocuments();
});

searchBox.addEventListener("input", () => {
  addDocuments();
});

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

    showPendingInput();
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
    document.querySelectorAll(".table-dropdown-options").forEach((option) => {
      option.classList.remove("show");
    });
  }
});

documentBody.addEventListener("click", (event) => {
  const moreBtn = event.target.closest(".table-dropdown");

  if (moreBtn) {
    event.preventDefault();

    const menu = moreBtn.closest(".table-menu");

    const options = menu.querySelector(".table-dropdown-options");

    document.querySelectorAll(".table-dropdown-options").forEach((item) => {
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

    const doc = documents.find((item) => String(item.id) === String(id));

    if (!doc) {
      return;
    }

    editingId = id;

    docTitle.value = doc.title;

    statusValue.value = doc.status;

    actionValue.value = doc.action;

    selectedStatus.textContent = getStatus(doc.status);

    selectedAction.textContent = getAction(doc.action);

    if (doc.status === "pending") {
      pendingCount.value = doc.pendingCount || "";

      pendingContainer.classList.add("show");
    } else {
      pendingCount.value = "";

      pendingContainer.classList.remove("show");
    }

    modalTask.showModal();

    return;
  }

  const deleteBtn = event.target.closest(".delete-document");

  if (deleteBtn) {
    event.preventDefault();

    const id = deleteBtn.dataset.id;

    documents = documents.filter((doc) => String(doc.id) !== String(id));

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

  const pendingNumber = Number(pendingCount.value);

  if (title === "") {
    alert("Please enter a document title");
    return;
  }

  if (status === "") {
    alert("Please select a status");
    return;
  }

  if (status === "pending") {
    if (
      pendingCount.value === "" ||
      pendingNumber < 1 ||
      !Number.isInteger(pendingNumber)
    ) {
      alert("Please enter how many people are pending");
      return;
    }
  }

  if (action === "") {
    alert("Please select an action");
    return;
  }

  if (editingId !== null) {
    const doc = documents.find((item) => String(item.id) === String(editingId));

    if (doc) {
      doc.title = title;
      doc.status = status;
      doc.action = action;

      if (status === "pending") {
        doc.pendingCount = pendingNumber;
      } else {
        doc.pendingCount = 0;
      }

      doc.date = new Date().toLocaleDateString();

      doc.time = new Date().toLocaleTimeString();
    }
  } else {
    const newDocument = {
      id: crypto.randomUUID(),
      title: title,
      status: status,
      action: action,
      pendingCount: status === "pending" ? pendingNumber : 0,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    documents.push(newDocument);
  }

  saveDocuments();

  addDocuments();

  modalTask.close();

  resetForm();
});

addDocuments();
