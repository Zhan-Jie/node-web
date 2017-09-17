var express = require('express');
var multer = require('multer');
var mongoFile = require('../mongodb/mongo');
var fs = require('fs');

var tempPath = 'tmp/';

var router = express.Router();
var upload = multer({dest: tempPath});

router.post('/', upload.single('file'), function (req, res, next) {
    console.log(req.file);
    mongoFile.uploadFile(req.file.path, req.file.originalname, function (err, fileId) {
        console.log('delete temporary file ' + req.file.path);
        fs.unlinkSync(req.file.path);
        if (fileId)
            console.log('file id is ' + fileId);
    });
    res.send('ok');
});

router.get('/:id', function (req, res, next) {
    var tempFile = tempPath + req.params.id;
    mongoFile.downloadFile(req.params.id, tempFile, function (err, file) {
        if (file) {
            res.download(file, 'file', function (err) {
                console.log('delete temp file ' + file);
                fs.unlinkSync(file);
            });
        } else {
            res.send('file not found');
        }
    });
});

module.exports = router;