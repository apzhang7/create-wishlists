document.addEventListener("DOMContentLoaded", () => {
    initializeInputs();
    initializeGrid();
    loadNotes();
});

function initializeInputs() {
    document.getElementById("noteWidth").value = 180;
    document.getElementById("noteHeight").value = 150;
}

function initializeGrid() {
    const grid = document.getElementById("noteGrid");
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(180px, 1fr))";
    grid.style.gap = "15px";
}

function addNote(text = "", width = "180px", height = "150px") {
    const note = document.createElement("div");
    note.className = "note";
    note.style.width = width;
    note.style.height = height;
    
    const noteContent = document.createElement("div");
    noteContent.className = "note-content";
    noteContent.contentEditable = "true";
    noteContent.innerText = text;
    noteContent.oninput = saveNotes;
    
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = function() {
        note.remove();
        saveNotes();
    };
    
    note.appendChild(noteContent);
    note.appendChild(deleteBtn);
    
    updateNoteSize(note, width, height);

    document.getElementById("noteGrid").appendChild(note);
    saveNotes();
    adjustGridLayout();
}


function updateNoteSize(note, width, height) {
    width = width || note.style.width || "180px";
    height = height || note.style.height || "150px";
    note.style.width = width.toString().includes("px") ? width : `${width}px`;
    note.style.height = height.toString().includes("px") ? height : `${height}px`;
}

function saveNotes() {
    const notes = Array.from(document.querySelectorAll(".note")).map(n => ({
        text: n.querySelector(".note-content").innerText.trim(),
        width: n.style.width,
        height: n.style.height
    }));
    localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const noteGrid = document.getElementById("noteGrid");
    noteGrid.innerHTML = "";
    
    if (notes.length > 0) {
        notes.forEach(note => addNote(note.text, note.width || "180px", note.height || "150px"));
    } else {
        initializeInputs();
    }
    adjustGridLayout();
}


function copyNotesToClipboard() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const textToCopy = notes.map(note => note.text).join("\n\n");
    navigator.clipboard.writeText(textToCopy)
        .then(() => alert("All notes copied to clipboard!"))
        .catch(err => console.error("Failed to copy notes: ", err));
}

function adjustGridLayout() {
    const grid = document.getElementById("noteGrid");
    const notes = document.querySelectorAll(".note");
    if (grid && notes.length > 0) {
        const minWidth = Math.max(180, ...Array.from(notes).map(note => parseInt(note.style.width)));
        grid.style.gridTemplateColumns = `repeat(auto-fill, minmax(${minWidth}px, 1fr))`;
    }
}

function updateNotesSize() {
    const width = document.getElementById("noteWidth").value || 180;
    const height = document.getElementById("noteHeight").value || 150;
    
    document.querySelectorAll(".note").forEach(note => updateNoteSize(note, width, height));
    
    saveNotes();
    adjustGridLayout();
}

// Event Listeners
document.getElementById("addNoteButton").onclick = () => {
    const width = document.getElementById("noteWidth").value || 180;
    const height = document.getElementById("noteHeight").value || 150;
    addNote("", width, height);
};
document.getElementById("updateNotesButton").onclick = updateNotesSize;
document.getElementById("saveNotesButton").onclick = copyNotesToClipboard;

window.addEventListener("resize", adjustGridLayout);