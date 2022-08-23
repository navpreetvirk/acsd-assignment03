// MongoDB
const { MongoClient, ObjectId } = require("mongodb")
const uri = 'mongodb+srv://root:root@cluster0.jtbuagh.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri)
const coll = client.db('assignment03').collection('notes')

async function createNote(noteData) {
    try {
        await client.connect()
        await coll.insertOne({
            content: noteData.content,
            title: noteData.title
        })
    } finally {
        client.close()
    }
}

async function deleteNote(noteData) {
    try {
        await client.connect()
        await coll.deleteOne({ _id: new ObjectId(noteData.id) })
    } finally {
        client.close()
    }
}

async function getNotes() {
    try {
        await client.connect()
        let notes = []
        const response = await coll.find({})
        await response.forEach(note => notes.push(note))
        return notes
    } finally {
        client.close()
    }
}

async function updateNote(noteData) {
    try {
        await client.connect()
        const filter = {
            _id: new ObjectId(noteData.id)
        }
        const update = {
            $set: {
                content: noteData.content,
                title: noteData.title
            }
        }
        await coll.updateOne(filter, update, { upsert: false })
    } finally {
        client.close()
    }
}

// Express
const express = require('express')

const app = express()
app.use(express.static('static'))
app.use(express.json())
express.urlencoded({extended: false})
app.listen(process.env.PORT || 3000)

app.get('/api/notes', async (req, res) => {
    res.json(await getNotes())
})

app.delete('/api/note', async (req, res) => {
    await deleteNote(req.body)
    res.json({message: 'Delete Successful'})
})

app.post('/api/note', async (req, res) => {
    await createNote(req.body)
    res.json({message: 'Creation Successful'})
})

app.put('/api/note', async (req, res) => {
    await updateNote(req.body)
    res.json({message: 'Update Successful'})
})