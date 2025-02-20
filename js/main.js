document.addEventListener("DOMContentLoaded", loadNotes);

function addNote(text = "", width = null, height = null) {
    const note = document.createElement("div");
    note.className = "note";
    
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
        document.getElementById("noteWidth").value = parseInt(notes[0].width);
        document.getElementById("noteHeight").value = parseInt(notes[0].height);
    }
    
    notes.forEach(note => addNote(note.text, note.width, note.height));
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
    const minWidth = Math.min(...Array.from(document.querySelectorAll(".note")).map(note => parseInt(note.style.width)));
    if (grid) {
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

// Initial layout adjustment
adjustGridLayout();