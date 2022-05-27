const router = require('express').Router();
const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
	const json = fs.readFile(path.join(__dirname, '../db/db.json'), 'utf-8', (err, data) => {
		if (err) {
			console.error(err);
		} else {
			res.json(JSON.parse(data));
		}
	});
});

router.post('/', (req, res) => {
	// Read existing data from file
	const json = fs.readFile(path.join(__dirname, '../db/db.json'), 'utf-8', (err, data) => {
		if (err) {
			console.error(err);
		} else {
			let notesArr = JSON.parse(data);
			// Create new note json including the unique id
			let newNote = {
				id: randomUUID(),
				title: req.body.title,
				text: req.body.text
			};
			// Push new note to the notes array before writing the data back to disk.
			notesArr.push(newNote);
			fs.writeFile(
				path.join(__dirname, '../db/db.json'),
				JSON.stringify(notesArr, null, 4),
				(writeErr) => {
					if (writeErr) {
						console.error(writeErr);
					}
				}
			);
			const response = {
				"status": "success",
				"body": newNote,
			}
			res.status(201).json(response);
		}
	});
});

router.delete('/:id', (req, res) => {
	let id = req.params.id.toLowerCase();
	const json = fs.readFile(path.join(__dirname, '../db/db.json'), 'utf-8', (err, data) => {
		if (err) {
			console.error(err);
		} else {
			let notesArr = JSON.parse(data);
			for (let i = 0; i < notesArr.length; i++) {
				if (notesArr[i].id === id) {
					notesArr.splice(i, 1);
				}
			}
			fs.writeFile(
				path.join(__dirname, '../db/db.json'),
				JSON.stringify(notesArr, null, 4),
				(writeErr) => {
					if (writeErr) {
						console.error(writeErr);
					}
				}
			);
			const response = {
				"status": "success",
				"body": `Deleted note with id: ${id}`,
			}
			res.status(201).json(response);
		}
	});
});

module.exports = router;