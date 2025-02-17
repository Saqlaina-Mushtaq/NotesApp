document.addEventListener("DOMContentLoaded", () => {
  const notesContainer = document.getElementById("notes-container");
  const noteTitle = document.getElementById("note-title");
  const noteDescription = document.getElementById("note-description");
  const saveNoteBtn = document.getElementById("save-note");
  const createNoteBtn = document.getElementById("create-note-btn");
  const noteForm = document.getElementById("note-form");

  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  let editingNoteIndex = -1;

  function saveNotesToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function renderNotes() {
    notesContainer.innerHTML = "";
    notes.forEach((note, index) => {
      const noteElement = document.createElement("div");
      noteElement.classList.add("note");
      if (note.marked) {
        noteElement.classList.add("marked");
      }
      noteElement.innerHTML = `
              <h3>${note.title}</h3>
              <p>${note.description}</p>
              <div class="note-actions">
                  <button class="mark-btn" data-index="${index}">${
        note.marked ? "Unmark" : "Mark"
      }</button>
                  <button class="edit-btn" data-index="${index}"><i class="fas fa-pen"></i></button>
                  <button class="delete-btn" data-index="${index}">Delete</button>
              </div>
          `;
      notesContainer.appendChild(noteElement);
    });
  }
//function of addnotebtn
  function addNote(title, description) {
    notes.push({ title, description, marked: false });
    saveNotesToLocalStorage();
    renderNotes();
  }
//function of deletebtn
  function deleteNote(index) {
    if (confirm("Do you want to delete this note?")) {
      notes.splice(index, 1);
      saveNotesToLocalStorage();
      renderNotes();
    }
  }
//function of editbtn
  function editNote(index) {
    const note = notes[index];
    noteTitle.value = note.title;
    noteDescription.value = note.description;
    editingNoteIndex = index;
    noteForm.classList.remove("hidden");
    createNoteBtn.textContent = "Cancel";
    saveNoteBtn.textContent = "Update Note";
  }
// function of markbtn
  function toggleMark(index) {
    notes[index].marked = !notes[index].marked;

    if (notes[index].marked) {
        // Move marked note to the top
        const markedNote = notes.splice(index, 1)[0];
        notes.unshift(markedNote);
    } else {
        // Move unmarked note back to its original position
        const unmarkedNote = notes.splice(index, 1)[0];
        notes.push(unmarkedNote);
    }

    saveNotesToLocalStorage();
    renderNotes();
}

//read  mode
notesContainer.addEventListener("dblclick", (e) => {
  const noteElement = e.target.closest(".note");
  if (noteElement) {
      noteElement.classList.add("expanded");

      // Create a close button if it doesn't already exist
      if (!noteElement.querySelector(".close-btn")) {
          const closeButton = document.createElement("span");
          closeButton.textContent = "×";
          closeButton.classList.add("close-btn");
          closeButton.addEventListener("click", () => {
              noteElement.classList.remove("expanded");
          });
          noteElement.appendChild(closeButton);
      }
  }
});



  createNoteBtn.addEventListener("click", () => {
    if (noteForm.classList.contains("hidden")) {
      noteForm.classList.remove("hidden");
      createNoteBtn.textContent = "Cancel";
      noteTitle.value = "";
      noteDescription.value = "";
      editingNoteIndex = -1;
      saveNoteBtn.textContent = "Save Note";
    } else {
      noteForm.classList.add("hidden");
      createNoteBtn.textContent = "Create New Note";
    }
  });

  saveNoteBtn.addEventListener("click", () => {
    const title = noteTitle.value.trim();
    const description = noteDescription.value.trim();
    if (title && description) {
      if (editingNoteIndex === -1) {
        addNote(title, description);
      } else {
        notes[editingNoteIndex] = {
          ...notes[editingNoteIndex],
          title,
          description,
        };
        saveNotesToLocalStorage();
        editingNoteIndex = -1;
        saveNoteBtn.textContent = "Save Note";
      }
      noteTitle.value = "";
      noteDescription.value = "";
      noteForm.classList.add("hidden");
      createNoteBtn.textContent = "Create New Note";
      renderNotes();
    }
  });

  notesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.dataset.index;
      deleteNote(index);
    } else if (e.target.classList.contains("edit-btn")) {
      const index = e.target.dataset.index;
      editNote(index);
    } else if (e.target.classList.contains("mark-btn")) {
      const index = e.target.dataset.index;
      toggleMark(index);
    }
  });

  function createBubbles() {
    const bubbles = document.querySelector(".bubbles");
    const bubbleCount = 10;

    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement("div");
      bubble.classList.add("bubble");
      const size = Math.random() * 60 + 20;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.animationDuration = `${Math.random() * 5 + 5}s`;
      bubble.style.animationDelay = `${Math.random() * 5}s`;
      bubbles.appendChild(bubble);
    }
  }

  createBubbles();
  renderNotes();
});
