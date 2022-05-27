const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

// activeNote = keep track of note in textarea
let activeNote = {};

// Function for getting all notes from db
const getNotes = () => {
    return $.ajax({
        url: "/api/notes",
        method: "GET",
    });
};

// Function for saving a note to the db
const saveNote = (note) => {
    return $.ajax({
        url: "/api/notes",
        data: note,
        method: "POST",
    });
};

// Function for deleting a note from the db
const deleteNote = (id) => {
    return $.ajax({
        url: "api/notes/" + id,
        method: "DELETE",
    });
};

// If activeNote present, display, otherwise render empty input
const renderActiveNote = () => {
    $saveNoteBtn.hide();

    if (activeNote.id) {
        $noteTitle.attr("readonly", true);
        $noteText.attr("readonly", true);
        $noteTitle.val(activeNote.title);
        $noteText.val(activeNote.text);
    } else {
        $noteTitle.attr("readonly", false);
        $noteText.attr("readonly", false);
        $noteTitle.val("");
        $noteText.val("");
    }
};

// Get note data from input, save to db and update view
const handleNoteSave = function () {
    const newNote = {
        title: $noteTitle.val(),
        text: $noteText.val(),
    };

    saveNote(newNote).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// Delete selected note
const handleNoteDelete = function (event) {
    // prevents click event listener for list from being called when button inside is clicked
    event.stopPropagation();

    const note = $(this).parent(".list-group-item").data();

    if (activeNote.id === note.id) {
        activeNote = {};
    }

    deleteNote(note.id).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// Sets activeNote and displays it
const handleNoteView = function () {
    activeNote = $(this).data();
    renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = function () {
    activeNote = {};
    renderActiveNote();
};

// If Note's title or text empty, hide save button
// Else, show it
const handleRenderSaveBtn = function () {
    if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
        $saveNoteBtn.hide();
    } else {
        $saveNoteBtn.show();
    }
};

// Render list of note titles
const renderNoteList = (notes) => {
    $noteList.empty();

    const noteListItems = [];

    // Returns jquery object for li with given text and delete button
    // unless withDeleteButton argument is provided as false
    const create$li = (text, withDeleteButton = true) => {
        const $li = $("<li class='list-group-item'>");
        const $span = $("<span>").text(text);
        $li.append($span);

        if (withDeleteButton) {
            const $delBtn = $(
                "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
            );
            $li.append($delBtn);
        }
        return $li;
    };

    if (notes.length === 0) {
        noteListItems.push(create$li("No saved Notes", false));
    }

    notes.forEach((note) => {
        const $li = create$li(note.title).data(note);
        noteListItems.push($li);
    });

    $noteList.append(noteListItems);
};

// Get notes from the db and render them to the sidebar
const getAndRenderNotes = () => {
    return getNotes().then(renderNoteList);
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Get and render the initial list of notes
getAndRenderNotes();