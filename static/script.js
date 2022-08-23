const API_URL = 'https://acsd-assignment03.herokuapp.com/api'
const converter = new showdown.Converter()

async function confirmDelete(noteID) {
    await fetch(`${API_URL}/note`, {
        body: JSON.stringify({
            id: noteID
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'DELETE'
    })
    .then(r => location.reload())
}

async function createNote() {
    await fetch(`${API_URL}/note`, {
        body: JSON.stringify({
            content: document.querySelector('#new-note-content').value,
            title: document.querySelector('#new-note-title').value
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'POST'
    })
    .then(r => location.reload())
}

function deleteNote(note) {
    const id = note.attributes['data-note-id'].value
    document.querySelector('#delete-button').setAttribute('onclick', `confirmDelete('${id}')`)
}

function editNote(note) {
    const content = note.attributes['data-note-content'].value
    const id = note.attributes['data-note-id'].value
    const title = note.attributes['data-note-title'].value
    document.querySelector('#edit-note-content').value = content
    document.querySelector('#edit-note-title').value = title
    document.querySelector('#update-note-button').setAttribute('onclick', `updateNote('${id}')`)
}

function fetchNotes() {
    fetch(`${API_URL}/notes`)
        .then(r => r.json())
        .then(d => renderNotes(d))
}

function renderNotes(notes) {
    if (notes.length > 0) {
        document.querySelector('#no-notes-alert').classList.add('d-none')
        notes.forEach(note => {
            const noteHTML =
            `<div class="align-items-center bg-dark border-secondary d-flex justify-content-between list-group-item p-4 text-light" data-bs-target="#view-note-modal" data-bs-toggle="modal" role="button" data-note-content="${note.content}" data-note-id="${note._id}" data-note-title="${note.title}" onclick="viewNote(this)">
                <h5 class="mb-0">${note.title}</h5>
                <div class="btn-group">
                    <button class="btn btn-lg btn-warning" data-bs-target="#edit-note-modal" data-bs-toggle="modal" onclick="editNote(this.parentNode.parentNode)">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-lg btn-danger" data-bs-target="#delete-note-modal"
                        data-bs-toggle="modal" onclick="deleteNote(this.parentNode.parentNode)">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </div>
            </div>`

            document.querySelector('#note-list').innerHTML += noteHTML
        })
    }
}

async function updateNote(noteID) {
    await fetch(`${API_URL}/note`, {
        body: JSON.stringify({
            content: document.querySelector('#edit-note-content').value,
            id: noteID,
            title: document.querySelector('#edit-note-title').value
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'PUT'
    })
    .then(r => location.reload())
}

function viewNote(note) {
    const content = note.attributes['data-note-content'].value
    const title = note.attributes['data-note-title'].value
    document.querySelector('#view-note-modal .modal-body').innerHTML = converter.makeHtml(content)
    document.querySelector('#view-note-modal .modal-title').innerHTML = title
}

fetchNotes()

// Form Validation

function validate(input) {
    let enableButton = true
    if (input.value == '') {
        input.classList.add('border-danger')
        input.classList.add('is-invalid')
        input.classList.remove('border-success')
        input.classList.remove('is-valid')
    } else {
        input.classList.add('is-valid')
        input.classList.add('border-success')
        input.classList.remove('is-invalid')
        input.classList.remove('border-danger')
    }
    input.parentNode.querySelectorAll('input, textarea').forEach(input => (input.value == '') ? enableButton = false : null)
    if (enableButton) input.parentNode.querySelector('button').removeAttribute('disabled')
    else input.parentNode.querySelector('button').setAttribute('disabled', '')
}