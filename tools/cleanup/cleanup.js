const config = require('../../config.json').gist
const moment = require('moment')
const fs = require('fs')

var Gist = require('gist.js')
var gist = Gist(config.gistID).token(config.gistToken)

var settings = {
	backupDirectory: './backups',
	backupFileCount: 10,
	fileNameFormat: 'MM-DD-YY-h:mm:ssa'
}

gist.get((err, json) => {
	if (err) {
		throw new Error(err)
	}

	var subjects = json.files[config.gistFilename].content

	fs.writeFile(
		`${settings.backupDirectory}/${moment().format(
			settings.fileNameFormat
		)}.json`,
		subjects,
		err => {
			if (err) {
				throw new Error(err)
			}

			subjects = JSON.parse(subjects).map(subject => {
				subject.assignments = subject.assignments.filter(assignment => {
					return !(
						moment().isAfter(
							moment(assignment.due, 'MM/DD/YYYY')
						) && assignment.complete
					)
				})

				return subject
			})

            gist.file(config.gistFilename).write(JSON.stringify(subjects))
            
			gist.save(() => {
                cleanupBackups()
            })

		}
	)
})

function cleanupBackups() {
	fs.readdir(settings.backupDirectory, (err, files) => {
		if (err) {
			throw new Error(err)
		}

		if (files.length > settings.backupFileCount) {
			files.sort((a, b) => {
				var am = moment(a, settings.fileNameFormat)
				var bm = moment(b, settings.fileNameFormat)
				if (am.isBefore(bm)) {
					return 1
				} else {
					return -1
				}
			})

			var filesToDelete = files.splice(settings.backupFileCount)

			filesToDelete.map(fileName => {
				fs.unlink(`${settings.backupDirectory}/${fileName}`, () => {})
			})
		}
	})
}
