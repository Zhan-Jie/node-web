var mongodb = require('mongodb');
var fs = require('fs');

var ObjectId = mongodb.ObjectId;
var uri = 'mongodb://localhost:27017/files';
var file = '/home/zhanj/Music/Jenyfa Duncan - Australia.ogg';

function uploadFile (filePath, fileName, callback) {
    mongodb.MongoClient.connect(uri, function (err, db) {
        var bucket = new mongodb.GridFSBucket(db);
        var uploadStream = bucket.openUploadStream(fileName);
        console.log(uploadStream.id);
        fs.createReadStream(filePath).pipe(uploadStream).on('finish', function () {
            console.log('file ' + fileName + ' is uploaded!');
            db.close();
            callback(null, uploadStream.id);
        }).on('error', function (err) {
            console.log(err);
            callback(err);
        });
    });
}

function downloadFile (fileId, tempFile, callback) {
    if (fs.existsSync(tempFile)) {
        callback(null, tempFile);
        return;
    }
    mongodb.MongoClient.connect(uri, function (err, db) {
        var bucket = new mongodb.GridFSBucket(db);
        var outStream = fs.createWriteStream(tempFile);
        var downloadStream = bucket.openDownloadStream(ObjectId.createFromHexString(fileId));
        downloadStream.pipe(outStream).once('finish', function () {
            console.log(tempFile + ' is retrieved from mongodb!');
            db.close();
            callback(null, tempFile);
        });
    });
}

function deleteFile () {
    mongodb.MongoClient.connect(uri, function (err, db) {
        var bucket = new mongodb.GridFSBucket(db);
        var cursor = bucket.find({filename:'hello.ogg'}).project({_id:1});
        cursor.hasNext().then(function (hasNext) {
            return hasNext ? cursor.next() : null;
        }).then(function (id) {
            console.log(id._id);
            cursor.close();
            db.close();
        }).catch(function () {
            cursor.close();
            db.close();
        });
    });
}

var mongoFile = {};
mongoFile.uploadFile = uploadFile;
mongoFile.downloadFile = downloadFile;
mongoFile.deleteFile = deleteFile;
module.exports = mongoFile;
