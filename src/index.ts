interface DocumentData {
  id: string;
  title: string;
  status: string;
  action: string;
  pendingCount: number;
  date: string;
  time: string;
}

const dropdown = document.querySelector<HTMLDivElement>("#dropdown");

const dropBtn = document.querySelector<HTMLButtonElement>("#profile-btn");

const helpBtn = document.querySelector<HTMLButtonElement>(".help-button");

const modal = document.querySelector<HTMLDialogElement>("#modal");

const settgBtn = document.querySelector<HTMLButtonElement>("#settingsBtn");

const modalAI = document.querySelector<HTMLDialogElement>("#modalAI");

const chatBtn = document.querySelector<HTMLButtonElement>("#aiBtn");

const modalTask = document.querySelector<HTMLDialogElement>("#modalTask");

const addBtn = document.querySelector<HTMLButtonElement>("#addBtn");

const canBtn = document.querySelector<HTMLButtonElement>("#canBtn");

const docStatus = document.querySelector<HTMLDivElement>("#docStatus");

const docAction = document.querySelector<HTMLDivElement>("#actionStatus");

const statusOptions = document.querySelector<HTMLDivElement>("#statusOptions");

const actionOptions = document.querySelector<HTMLDivElement>("#actionOptions");

const selectedStatus =
  document.querySelector<HTMLSpanElement>("#selectedStatus");

const selectedAction =
  document.querySelector<HTMLSpanElement>("#selectedAction");

const docTitle = document.querySelector<HTMLInputElement>("#docTitle");

const statusValue = document.querySelector<HTMLInputElement>("#statusValue");

const actionValue = document.querySelector<HTMLInputElement>("#actionValue");

const pendingContainer = document.querySelector<HTMLDivElement>("#pendingContainer");

const pendingCount = document.querySelector<HTMLInputElement>("#pendingCount");

const documentBody = document.querySelector<HTMLTableSectionElement>("#documentBody");

const addForm = document.querySelector<HTMLFormElement>("#addForm");

const selectAll = document.querySelector<HTMLInputElement>("#selectAll");

const removeBtn = document.querySelector<HTMLButtonElement>("#removeBtn");

const searchBox = document.querySelector<HTMLInputElement>(".box");

const documentsValue = localStorage.getItem("document");

let documents: DocumentData[] =
  documentsValue !== null ? JSON.parse(documentsValue) : [];

let editingId: string | null = null;

dropBtn?.addEventListener("click", (event: MouseEvent) => {
  event.preventDefault();

  dropdown?.classList.toggle("show");
});

document.addEventListener("click", (event: MouseEvent) => {
  if (!(event.target instanceof Node)) {
    return;
  }

  if (
    dropBtn &&
    dropdown &&
    !dropBtn.contains(event.target) &&
    !dropdown.contains(event.target)
  ) {
    dropdown.classList.remove("show");
  }
});

helpBtn?.addEventListener("click", () => {
  alert("Our service team will contact you soon");
});

settgBtn?.addEventListener("click", (event: MouseEvent) => {
  event.preventDefault();

  modal?.showModal();
});

modal?.addEventListener("click", (event: MouseEvent) => {
  if (event.target === modal) {
    modal.close();
  }
});

chatBtn?.addEventListener("click", (event: MouseEvent) => {
  event.preventDefault();

  modalAI?.showModal();
});

modalAI?.addEventListener("click", (event: MouseEvent) => {
  if (event.target === modalAI) {
    modalAI.close();
  }
});

function saveDocuments(): void {
  localStorage.setItem("document", JSON.stringify(documents));
}

function resetForm(): void {
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

function showPendingInput(): void {
  if (!statusValue || !pendingContainer || !pendingCount) {
    return;
  }

  if (statusValue.value === "pending") {
    pendingContainer.classList.add("show");
  } else {
    pendingContainer.classList.remove("show");
    pendingCount.value = "";
  }
}

function getStatus(status: string): string {
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

function getAction(action: string): string {
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

function getStatusClass(status: string): string {
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

function getPendingText(count: number): string {
  const number = Number(count);

  if (!number || number < 1) {
    return "";
  }

  if (number === 1) {
    return String(number);
  }

  return String(number);
}

function addDocuments(): void {
  if (!documentBody || !selectAll || !searchBox) {
    return;
  }

  documentBody.innerHTML = "";

  selectAll.checked = false;

  const searchText = searchBox.value.trim().toLowerCase();

  const filteredDocuments = documents.filter((doc: DocumentData) => {
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

  filteredDocuments.forEach((doc: DocumentData) => {
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

selectAll?.addEventListener("change", () => {
  if (!selectAll) {
    return;
  }

  const checkboxes =
    document.querySelectorAll<HTMLInputElement>(".document-checkbox");

  checkboxes.forEach((checkbox: HTMLInputElement) => {
    checkbox.checked = selectAll.checked;
  });
});

documentBody?.addEventListener("change", (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }

  if (!event.target.classList.contains("document-checkbox")) {
    return;
  }

  if (!selectAll) {
    return;
  }

  const checkboxes =
    document.querySelectorAll<HTMLInputElement>(".document-checkbox");

  const checkedBoxes = document.querySelectorAll<HTMLInputElement>(
    ".document-checkbox:checked",
  );

  selectAll.checked =
    checkboxes.length > 0 && checkedBoxes.length === checkboxes.length;
});

removeBtn?.addEventListener("click", () => {
  if (!selectAll) {
    return;
  }

  const selectedCheckboxes = document.querySelectorAll<HTMLInputElement>(
    ".document-checkbox:checked",
  );

  if (selectedCheckboxes.length === 0) {
    alert("Please select at least one document to remove.");
    return;
  }

  const selectedIds = Array.from(selectedCheckboxes).map(
    (checkbox: HTMLInputElement) => checkbox.dataset.id,
  );

  documents = documents.filter(
    (doc: DocumentData) => !selectedIds.includes(doc.id),
  );

  saveDocuments();

  selectAll.checked = false;

  addDocuments();
});

searchBox?.addEventListener("input", () => {
  addDocuments();
});

addBtn?.addEventListener("click", (event: MouseEvent) => {
  event.preventDefault();

  resetForm();

  modalTask?.showModal();
});

canBtn?.addEventListener("click", () => {
  modalTask?.close();

  resetForm();
});

modalTask?.addEventListener("click", (event: MouseEvent) => {
  if (event.target === modalTask) {
    modalTask.close();

    resetForm();
  }
});

docStatus?.addEventListener("click", (event: MouseEvent) => {
  event.stopPropagation();

  statusOptions?.classList.toggle("show");

  actionOptions?.classList.remove("show");
});

statusOptions
  ?.querySelectorAll<HTMLElement>(".dropdown-option")
  .forEach((option: HTMLElement) => {
    option.addEventListener("click", () => {
      if (selectedStatus) {
        selectedStatus.textContent = option.textContent?.trim() ?? "";
      }

      if (statusValue) {
        statusValue.value = option.dataset.value ?? "";
      }

      statusOptions.classList.remove("show");

      showPendingInput();
    });
  });

docAction?.addEventListener("click", (event: MouseEvent) => {
  event.stopPropagation();

  actionOptions?.classList.toggle("show");

  statusOptions?.classList.remove("show");
});

actionOptions
  ?.querySelectorAll<HTMLElement>(".dropdown-option")
  .forEach((option: HTMLElement) => {
    option.addEventListener("click", () => {
      if (selectedAction) {
        selectedAction.textContent = option.textContent?.trim() ?? "";
      }

      if (actionValue) {
        actionValue.value = option.dataset.value ?? "";
      }

      actionOptions.classList.remove("show");
    });
  });

document.addEventListener("click", (event: MouseEvent) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  if (!event.target.closest(".form-container")) {
    statusOptions?.classList.remove("show");
  }

  if (!event.target.closest(".action-container")) {
    actionOptions?.classList.remove("show");
  }

  if (!event.target.closest(".table-menu")) {
    document
      .querySelectorAll<HTMLDivElement>(".table-dropdown-options")
      .forEach((option: HTMLDivElement) => {
        option.classList.remove("show");
      });
  }
});

documentBody?.addEventListener("click", (event: MouseEvent) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const moreBtn = event.target.closest<HTMLAnchorElement>(".table-dropdown");

  if (moreBtn) {
    event.preventDefault();

    const menu = moreBtn.closest<HTMLElement>(".table-menu");

    if (!menu) {
      return;
    }

    const options = menu.querySelector<HTMLDivElement>(
      ".table-dropdown-options",
    );

    if (!options) {
      return;
    }

    document
      .querySelectorAll<HTMLDivElement>(".table-dropdown-options")
      .forEach((item: HTMLDivElement) => {
        if (item !== options) {
          item.classList.remove("show");
        }
      });

    options.classList.toggle("show");

    return;
  }

  const editBtn = event.target.closest<HTMLAnchorElement>(".edit-document");

  if (editBtn) {
    event.preventDefault();

    const id = editBtn.dataset.id;

    if (!id) {
      return;
    }

    const doc = documents.find(
      (item: DocumentData) => String(item.id) === String(id),
    );

    if (!doc) {
      return;
    }

    editingId = id;

    if (docTitle) {
      docTitle.value = doc.title;
    }

    if (statusValue) {
      statusValue.value = doc.status;
    }

    if (actionValue) {
      actionValue.value = doc.action;
    }

    if (selectedStatus) {
      selectedStatus.textContent = getStatus(doc.status);
    }

    if (selectedAction) {
      selectedAction.textContent = getAction(doc.action);
    }

    if (doc.status === "pending") {
      if (pendingCount) {
        pendingCount.value = doc.pendingCount ? String(doc.pendingCount) : "";
      }

      pendingContainer?.classList.add("show");
    } else {
      if (pendingCount) {
        pendingCount.value = "";
      }

      pendingContainer?.classList.remove("show");
    }

    modalTask?.showModal();

    return;
  }

  const deleteBtn = event.target.closest<HTMLAnchorElement>(".delete-document");

  if (deleteBtn) {
    event.preventDefault();

    const id = deleteBtn.dataset.id;

    if (!id) {
      return;
    }

    documents = documents.filter(
      (doc: DocumentData) => String(doc.id) !== String(id),
    );

    saveDocuments();

    addDocuments();

    return;
  }
});

addForm?.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();

  if (!docTitle || !statusValue || !actionValue || !pendingCount) {
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
    const doc = documents.find(
      (item: DocumentData) => String(item.id) === String(editingId),
    );

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
    const newDocument: DocumentData = {
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

  modalTask?.close();

  resetForm();
});

addDocuments();
