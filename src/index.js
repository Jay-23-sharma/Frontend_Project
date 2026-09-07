"use strict";
const dropdown = document.querySelector("#dropdown");
const dropBtn = document.querySelector("#profile-btn");
const helpBtn = document.querySelector(".help-button");
const modal = document.querySelector("#modal");
const settingsBtn = document.querySelector("#settingsBtn");
const modalAI = document.querySelector("#modalAI");
const aiBtn = document.querySelector("#aiBtn");
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
const documentsValue = localStorage.getItem("document");
let documents = documentsValue !== null
    ? JSON.parse(documentsValue)
    : [];
let editingId = null;
function saveDocuments() {
    localStorage.setItem("document", JSON.stringify(documents));
}
function resetForm() {
    addForm?.reset();
    if (selectedStatus) {
        selectedStatus.textContent = "Select Current Status";
    }
    if (selectedAction) {
        selectedAction.textContent = "Action Required";
    }
    if (statusValue) {
        statusValue.value = "";
    }
    if (actionValue) {
        actionValue.value = "";
    }
    if (pendingCount) {
        pendingCount.value = "";
    }
    pendingContainer?.classList.remove("show");
    editingId = null;
}
function showPendingInput() {
    if (!statusValue || !pendingContainer || !pendingCount) {
        return;
    }
    if (statusValue.value === "pending") {
        pendingContainer.classList.add("show");
    }
    else {
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
    return String(number);
}
function createElement(documentRow) {
    const row = document.createElement("tr");
    const pendingText = documentRow.status === "pending"
        ? getPendingText(documentRow.pendingCount)
        : "";
    row.innerHTML = `
    <td>
      <input
        type="checkbox"
        class="document-checkbox"
        data-id="${documentRow.id}"
      >
    </td>

    <td>
      <a class="content-text" href="#">
        ${documentRow.title}
      </a>
    </td>

    <td>
      <p class="status ${getStatusClass(documentRow.status)}">
        ${getStatus(documentRow.status)}
      </p>

      ${pendingText
        ? `<p class="pending-info">
              Waiting for ${pendingText} people
            </p>`
        : ""}
    </td>

    <td>
      ${documentRow.date}
      <br>
      ${documentRow.time}
    </td>

    <td>
      <div class="access">
        <button class="action" type="button">
          ${getAction(documentRow.action)}
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
                data-id="${documentRow.id}"
              >
                Edit
              </a>
            </div>

            <div>
              <a
                href="#"
                class="delete-document"
                data-id="${documentRow.id}"
              >
                Delete
              </a>
            </div>
          </div>
        </div>
      </div>
    </td>
  `;
    return row;
}
function renderDocuments() {
    if (!documentBody || !searchBox) {
        return;
    }
    const searchText = searchBox.value
        .trim()
        .toLowerCase();
    documentBody.replaceChildren();
    documents.forEach((documentRow) => {
        const title = documentRow.title.toLowerCase();
        const status = getStatus(documentRow.status).toLowerCase();
        const action = getAction(documentRow.action).toLowerCase();
        if (title.includes(searchText) ||
            status.includes(searchText) ||
            action.includes(searchText)) {
            documentBody.appendChild(createElement(documentRow));
        }
    });
    if (selectAll) {
        selectAll.checked = false;
    }
}
function addDocument(newDocument) {
    documents.push(newDocument);
    saveDocuments();
}
function editDocument(newDocument) {
    if (editingId === null) {
        return;
    }
    const index = documents.findIndex((documentRow) => documentRow.id === editingId);
    if (index === -1) {
        return;
    }
    documents.splice(index, 1, newDocument);
    saveDocuments();
}
function deleteDocument(id) {
    documents = documents.filter((documentRow) => documentRow.id !== id);
    saveDocuments();
}
function deleteSelectedDocuments() {
    const selectedCheckboxes = document.querySelectorAll(".document-checkbox:checked");
    if (selectedCheckboxes.length === 0) {
        alert("Please select at least one document to remove.");
        return;
    }
    const selectedIds = Array.from(selectedCheckboxes).map((checkbox) => checkbox.dataset.id);
    documents = documents.filter((documentRow) => !selectedIds.includes(documentRow.id));
    saveDocuments();
    if (selectAll) {
        selectAll.checked = false;
    }
    renderDocuments();
}
function openAddForm() {
    resetForm();
    modalTask?.showModal();
}
function closeForm() {
    modalTask?.close();
    resetForm();
}
function handleStatusChange() {
    showPendingInput();
}
function handleFormSubmit(event) {
    event.preventDefault();
    if (!docTitle ||
        !statusValue ||
        !actionValue ||
        !pendingCount) {
        return;
    }
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
        if (pendingCount.value === "" ||
            pendingNumber < 1 ||
            !Number.isInteger(pendingNumber)) {
            alert("Please enter how many people are pending");
            return;
        }
    }
    if (action === "") {
        alert("Please select an action");
        return;
    }
    const now = new Date();
    const newDocument = {
        id: editingId !== null
            ? editingId
            : crypto.randomUUID(),
        title,
        status,
        action,
        pendingCount: status === "pending"
            ? pendingNumber
            : 0,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
    };
    if (editingId === null) {
        addDocument(newDocument);
    }
    else {
        editDocument(newDocument);
    }
    renderDocuments();
    closeForm();
}
function handleSelectAll() {
    if (!selectAll) {
        return;
    }
    const checkboxes = document.querySelectorAll(".document-checkbox");
    checkboxes.forEach((checkbox) => {
        checkbox.checked =
            selectAll.checked;
    });
}
function handleCheckboxChange(event) {
    if (!(event.target instanceof HTMLInputElement)) {
        return;
    }
    if (!event.target.classList.contains("document-checkbox")) {
        return;
    }
    if (!selectAll) {
        return;
    }
    const checkboxes = document.querySelectorAll(".document-checkbox");
    const checkedCheckboxes = document.querySelectorAll(".document-checkbox:checked");
    selectAll.checked =
        checkboxes.length > 0 &&
            checkboxes.length ===
                checkedCheckboxes.length;
}
function toggleTableMenu(menu) {
    const options = menu.querySelector(".table-dropdown-options");
    if (!options) {
        return;
    }
    const allOptions = document.querySelectorAll(".table-dropdown-options");
    allOptions.forEach((option) => {
        if (option !== options) {
            option.classList.remove("show");
        }
    });
    options.classList.toggle("show");
}
function handleDocumentClick(event) {
    if (!(event.target instanceof Element)) {
        return;
    }
    const target = event.target;
    const moreButton = target.closest(".table-dropdown");
    if (moreButton) {
        event.preventDefault();
        const menu = moreButton.closest(".table-menu");
        if (menu) {
            toggleTableMenu(menu);
        }
        return;
    }
    const editButton = target.closest(".edit-document");
    if (editButton) {
        event.preventDefault();
        const id = editButton.dataset.id;
        if (!id) {
            return;
        }
        const documentRow = documents.find((documentRow) => documentRow.id === id);
        if (!documentRow) {
            return;
        }
        editingId = id;
        if (docTitle) {
            docTitle.value =
                documentRow.title;
        }
        if (statusValue) {
            statusValue.value =
                documentRow.status;
        }
        if (actionValue) {
            actionValue.value =
                documentRow.action;
        }
        if (selectedStatus) {
            selectedStatus.textContent =
                getStatus(documentRow.status);
        }
        if (selectedAction) {
            selectedAction.textContent =
                getAction(documentRow.action);
        }
        if (documentRow.status ===
            "pending") {
            if (pendingCount) {
                pendingCount.value =
                    documentRow.pendingCount
                        ? String(documentRow.pendingCount)
                        : "";
            }
            pendingContainer?.classList.add("show");
        }
        else {
            if (pendingCount) {
                pendingCount.value = "";
            }
            pendingContainer?.classList.remove("show");
        }
        modalTask?.showModal();
        return;
    }
    const deleteButton = target.closest(".delete-document");
    if (deleteButton) {
        event.preventDefault();
        const id = deleteButton.dataset.id;
        if (!id) {
            return;
        }
        deleteDocument(id);
        renderDocuments();
        return;
    }
}
function handleSearch() {
    renderDocuments();
}
function closeDropdowns(event) {
    if (!(event.target instanceof Element)) {
        return;
    }
    const target = event.target;
    if (!target.closest(".form-container")) {
        statusOptions?.classList.remove("show");
    }
    if (!target.closest(".action-container")) {
        actionOptions?.classList.remove("show");
    }
    if (!target.closest(".table-menu")) {
        document
            .querySelectorAll(".table-dropdown-options")
            .forEach((option) => {
            option.classList.remove("show");
        });
    }
}
function setupEventListeners() {
    dropBtn?.addEventListener("click", (event) => {
        event.preventDefault();
        dropdown?.classList.toggle("show");
    });
    helpBtn?.addEventListener("click", () => {
        alert("Our service team will contact you soon");
    });
    settingsBtn?.addEventListener("click", (event) => {
        event.preventDefault();
        modal?.showModal();
    });
    modal?.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });
    aiBtn?.addEventListener("click", (event) => {
        event.preventDefault();
        modalAI?.showModal();
    });
    modalAI?.addEventListener("click", (event) => {
        if (event.target === modalAI) {
            modalAI.close();
        }
    });
    addBtn?.addEventListener("click", openAddForm);
    canBtn?.addEventListener("click", closeForm);
    modalTask?.addEventListener("click", (event) => {
        if (event.target === modalTask) {
            closeForm();
        }
    });
    docStatus?.addEventListener("click", (event) => {
        event.stopPropagation();
        statusOptions?.classList.toggle("show");
        actionOptions?.classList.remove("show");
    });
    statusOptions
        ?.querySelectorAll(".dropdown-option")
        .forEach((option) => {
        option.addEventListener("click", () => {
            if (selectedStatus) {
                selectedStatus.textContent =
                    option.textContent?.trim() ?? "";
            }
            if (statusValue) {
                statusValue.value =
                    option.dataset.value ?? "";
            }
            statusOptions.classList.remove("show");
            showPendingInput();
        });
    });
    docAction?.addEventListener("click", (event) => {
        event.stopPropagation();
        actionOptions?.classList.toggle("show");
        statusOptions?.classList.remove("show");
    });
    actionOptions
        ?.querySelectorAll(".dropdown-option")
        .forEach((option) => {
        option.addEventListener("click", () => {
            if (selectedAction) {
                selectedAction.textContent =
                    option.textContent?.trim() ?? "";
            }
            if (actionValue) {
                actionValue.value =
                    option.dataset.value ?? "";
            }
            actionOptions.classList.remove("show");
        });
    });
    document.addEventListener("click", closeDropdowns);
    selectAll?.addEventListener("change", handleSelectAll);
    documentBody?.addEventListener("change", handleCheckboxChange);
    removeBtn?.addEventListener("click", deleteSelectedDocuments);
    searchBox?.addEventListener("input", handleSearch);
    addForm?.addEventListener("submit", handleFormSubmit);
    documentBody?.addEventListener("click", handleDocumentClick);
}
function init() {
    renderDocuments();
    setupEventListeners();
}
init();
