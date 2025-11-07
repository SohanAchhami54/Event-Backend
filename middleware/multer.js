const multer=require('multer');
//multer to add the image file in the request.

//"Hey Multer, store the uploaded image temporarily in the disk (file system)."

//A user uploads an image ➝ Multer grabs it ➝ puts it temporarily on disk ➝ attaches it to req.file ➝ now you can read it in the controller.
exports.upload=multer({storage:multer.diskStorage({})});
//tells multer to store files on disk temporarily.
