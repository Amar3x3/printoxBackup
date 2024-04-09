
const fs = window.require("fs");

// function to convert buffer to file and save it to the given location
function saveArrayBufferToFile(buffer, filename, dirPath) {
  // getting the buffer from the array buffer
  const data = Buffer.from(buffer);

  // creating path for file
  const savePath = `${dirPath}/${filename}`;

  try {
    // save the file to the given path
    if (!fs.existsSync(savePath)) {
      fs.writeFileSync(savePath, data);
      console.log(`File saved successfully at ${savePath}`);
      // return saved path
      return savePath;
    }
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

// creating folder of user
function createUserDirectory(name) {
  // creating path with user's name
  let dirPath = `./users/${name}`;

  // folder may already exist, then change the name of the folder
  let cnt = 1;
  // add cnt to the folder name
  while (fs.existsSync(dirPath)) {
    dirPath = dirPath + "" + cnt;
    cnt++;
  }
  let resp;
  fs.mkdirSync(dirPath, { recursive: true }, (err) => {
    if (err) {
      console.log("Error Creating Directory", err);
      resp = { success: false, messgage: err };
      return resp;
    } else {
      console.log("Directory Created Successfully");
    }
  });
  // return resp
  resp = {
    success: true,
    message: "Directory Created Successfully",
    path: dirPath,
  };
  console.log(resp);
  return resp;
}

// function to delete a folder
function deleteUserFolder({ folder, filesPath }) {
  // first delete all files inside the folder
  for (let index = 0; index < filesPath.length; index++) {
    const path = filesPath[index].filepath;
    fs.unlinkSync(path, (err) => {
      if (err) {
        console.log("Error while removing file " + path, err);
      } else {
        console.log("File removed Successfully", path);
      }
    });
  }

  // then delete the folder
  fs.rmdirSync(folder);
}

module.exports = {
  createUserDirectory,
  saveArrayBufferToFile,
  deleteUserFolder,
};
