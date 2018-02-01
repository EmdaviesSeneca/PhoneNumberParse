//Dependant Packages
var libphonenumber = require('libphonenumber-js');
var upload = require('express-fileupload');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Setting Port
var port = 3000;

// API Router
var router = express.Router();

// API Status
app.get('/', (req, res) => {
    return res.status(200).send('The API is Online.');
});

// [GET] Text
router.get('/text/:string', (req, res) => {
	
    var rout = [];
    var text = req.params.string;
    var result = libphonenumber.parse(text, "CA");

    if (!isEmpty(result)) {
        rout.push(libphonenumber.format(result, 'National'));
    }
    return res.status(200).send(rout);
});


//Upload File HTML page
router.get('/file', (req, res) => {
    res.sendFile(__dirname + "/uploadFile.html");
});

// [POST] Files
router.post('/file', function(req, res) {

    //If nothing was uploaded
    if (!req.files) {
        return res.status(400).send('No file(s) uploaded.');
    } else {
        let ufile = req.files.ufile;
        var rout = [];
        
        var fs = require('fs');
        fs.readFileSync(ufile.name).toString().split('\n').forEach(function (line) {
            var phone = libphonenumber.parse(line, "CA");
            
            if (!isEmpty(phone)) {
                rout.push(libphonenumber.format(phone, 'National'));
            }
        })

        return res.status(200).send(rout);
    }
});

app.use(upload());

app.use('/api/phonenumbers/parse', router);

//Check if empty
function isEmpty(obj) {
	
    for (var o in obj) {
		
        if (obj.hasOwnProperty(o)) return false;
		
    }
	
    return true;
}

// Boot Up Server (Set Port + Relay Confirmation)
app.listen(port);
console.log('The server is on port ' + port);