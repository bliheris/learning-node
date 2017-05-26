// https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
// https://stackoverflow.com/questions/12740659/downloading-images-with-node-js

const fs = require('fs')
const request = require('request')

const downloadFileFromUrl = (url, dest, cb) => {

	const sendReq = request.get(url)

	sendReq.on('response', (response) => {
		if (response.statusCode !== 200) {
			return cb('Response status was ' + response.statusCode)
		}
		else {
			const file = fs.createWriteStream(dest)
			sendReq.pipe(file)

			file.on('finish', () => file.close(cb))  // close() is async, call cb after close completes.
			file.on('error', (err) => {
				fs.unlink(dest) // Delete the file async. (But we don't check the result)
				return cb(err.message)
			})
		}
	})

	// check for request errors
	sendReq.on('error', function (err) {
		return cb(err.message)
	})
}

const fileName = 'Maria-Black-smykker.jpg'
const imgUrl = 'http://www.fashionexclusiveuae.com/wp-content/uploads/2017/04/' + fileName
const badUrl = 'http://example.com/fdfdsf.jpg'
const destination = `../downloads/${fileName}`

downloadFileFromUrl(imgUrl, destination, (err) => {
	if(err) {
		console.log('File not downloaded')
		return console.log(err)
	}

	console.log('File downloaded')
})