/*--------------------------
        Boilerplate from: https://github.com/electron/electron-quick-start
 -------------------------*/
// Github repo: https://github.com/Donegaan/Sweng-Group-12

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;


const path = require('path');
const url = require('url');
const fs = require('fs');
var csvjson = require('csvjson'); // Package to convert csv to json for easier editing of data
var jsonfile = require('jsonfile');
var jsonToCsv = require('convert-json-to-csv');


// Read in files
try {
  // var csvData = fs.readFileSync(path.join(process.resourcesPath,'app/Students.csv'), { encoding : 'utf8'}); // Read in csv file
  var csvData = fs.readFileSync(path.join('./Students.csv'), {
    encoding: 'utf8'
  }); // Read in csv file
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log('Student file not found!');
    console.log('Path of file in parent dir:', require('path').resolve(process.resourcesPath, 'app/Students.csv'));
  } else {
    throw err;
  }
}

try {
  // var csvPlacement = fs.readFileSync(path.join(process.resourcesPath,'app/Placements.csv'),{ encoding : 'utf8'});
  var csvPlacement = fs.readFileSync(path.join('./Placements.csv'), {
    encoding: 'utf8'
  });
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log('Placement file not found!');
  } else {
    throw err;
  }
}
try {
  // var csvPrevPlace = fs.readFileSync(path.join(process.resourcesPath,'app/Previous Placements.csv'),{ encoding : 'utf8'});
  var csvPrevPlace = fs.readFileSync(path.join('./Previous Placements.csv'), {
    encoding: 'utf8'
  });
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log('Previous placement file not found!');
  } else {
    throw err;
  }
}

var Leinster = ["Dublin", "Meath", "Louth", "Kildare", "Kilkenny", "Offaly",
  "Westmeath", "Carlow", "Wexford", "Wicklow", "Laois", "Longford"
];
var Ulster = ["Donegal", "Cavan", "Monaghan", "Fermanagh", "Antrim", "Tyrone", "Derry", "Down", "Armagh"];
var Munster = ["Cork", "Kerry", "Clare", "Limerick", "Tipperary", "Waterford"];
var Connacht = ["Mayo", "Galway", "Sligo", "Leitrim", "Roscommon"];

var dublinSouth = ["D2", "D4", "D6", "D6W", "D8", "D10", "D12", "D14", "D16", "D18", "D20", "D22", "D24"];
var dublinNorth = ["D1", "D3", "D5", "D7", "D9", "D11", "D13", "D15", "D17"];

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })
  // Open full screen
  mainWindow.maximize();
  // and load the main html page of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/studentlist.html'),
    protocol: 'file:',
    slashes: true
  }));


  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


//--------------------------------- Convert csv to JSON ------------------------------
var csvOptions = {
  delimiter: ',', // optional
  quote: '"' // optional
};

//-------------------------Write to JSON ---------------------------------------
function getStudentData() {
  return csvjson.toObject(csvData, csvOptions); // Return student data json object
}

function getPlacementData() {
  return csvjson.toObject(csvPlacement, csvOptions); // Return placement data json object
}

function getPrevPlacementData() {
  return csvjson.toObject(csvPrevPlace, csvOptions); // Return previous placement data json object
}
//addPreviousPlacements();
addProvinces();
//json to csv

function writeToStudentCsv(studentJson) {
  var columnHeaderArray = ["Number", "Name", "Year", "Location", "County", "Allocated Placement"];
  csvData = jsonToCsv.convertArrayOfObjects(studentJson, columnHeaderArray);
  csvData = csvData.replace(/"/g, '');
  var file = 'Students.csv';
  // var file = path.join(process.resourcesPath,'/app/Students.csv'); // Path for packaged app
  fs.writeFileSync(file, csvData, 'utf8', null);
}

function writeToPlacementCsv(placementJson) {
  var columnHeaderArray = ["id", "Number of Placements", "Location", "County", "Name"];
  csvPlacement = jsonToCsv.convertArrayOfObjects(placementJson, columnHeaderArray);
  csvPlacement = csvPlacement.replace(/"/g, '');
  var file = 'Placements.csv';
  // var file = path.join(process.resourcesPath,'/app/Placements.csv'); // Path for packaged app
  fs.writeFileSync(file, csvPlacement, 'utf8', null);
}
//Searches for placement by id and edits according to new parameters
function editPlacement() {
  var placementJson = getPlacementData();
  var placementId = document.getElementById("id").innerHTML;
  var available = true;


  for (var i = 0; i < placementJson.length; i++) {

    if (document.getElementById("places").value < 0)
      available = false;

    if (placementJson[i].id == placementId && available == true) {
      placementJson[i].Location = document.getElementById("location").value;
      placementJson[i].County = document.getElementById("county").value;
      placementJson[i].Name = document.getElementById("name").value;
      if (placementJson[i].County === "Dublin") {
        if (dublinNorth.hasKnownValue)
          placementJson[i].DublinPostCode = "Dublin North";
        if (dublinSouth.hasKnownValue)
          placementJson[i].DublinPostCode = "Dublin South";
      }
      placementJson[i]["Number of Placements"] = document.getElementById("places").value;
      console.log("works");
    }

    if (available == false) {
      alert("Incorrect input");
      return;
    } else if (i == placementJson.length - 1)
      console.log("Placement doesnt exist");
  }
  writeToPlacementCsv(placementJson);
}

function addProvinces() {
  var studentJson = getStudentData();
  for (i = 0; i < studentJson.length; i++) {
    for (j = 0; j < Leinster.length; j++) {
      if (studentJson[i].County == Leinster[j])
        studentJson[i]["Province"] = "Leinster";
    }
    for (j = 0; j < Munster.length; j++) {
      if (studentJson[i].County == Munster[j])
        studentJson[i]["Province"] = "Munster";
    }

    for (j = 0; j < Connacht.length; j++) {
      if (studentJson[i].County == Connacht[j])
        studentJson[i]["Province"] = "Connacht";
    }
    for (j = 0; j < Ulster.length; j++) {
      if (studentJson[i].County == Ulster[j])
        studentJson[i]["Province"] = "Ulster";
    }
  }
  //console.log(studentJson);
}

/*
  Edits a students details based and searches based on student number
*/
function editStudent() {
  console.log("edit called");
  var studentNumber = document.getElementById("id").innerHTML;
  // console.log(studentNumber+" Works");
  var studentJson = getStudentData();
  var placementJson = getPlacementData();
  var available = true;
  var count = 0;

  for (var i = 0; i < studentJson.length; i++) {

    for (j = 0; j < placementJson.length; j++) {
     
      //Checking if the placement has space left, currently not working we change name, year etc and keep allocated placement the same
      // if (document.getElementById("currPlace").value == placementJson[j].id && placementJson[j]["Number of Placements"] <= 0) {
      //   available = false;
      //   alert("Insufficient places");
      // }

      //Checking if the placement exists
      if (document.getElementById("currPlace").value == placementJson[j].id)
        count++;

    }

    if (count == 0) {
      available = false;
      alert("This location does not exist");
    }
    //Checking if year input is > 0
    if (document.getElementById("year").value < 0) {
      alert("Incorrect year input")
      available = false;
    } 

    //Editing student
    if (studentJson[i].Number == studentNumber && available == true) {
      studentJson[i].Name = document.getElementById("name").value;
      studentJson[i].Year = document.getElementById("year").value;
      studentJson[i].Location = document.getElementById("location").value;
      studentJson[i]["Allocated Placement"] = document.getElementById("currPlace").value;
      studentJson[i].County = document.getElementById("county").value;
      console.log("works");
    }

    if (available == false) {
      return;
    } else if (i == studentJson.length - 1)
      console.log("Student doesn't exist");
  }
  //Writing to the json and the csv
  writeToStudentCsv(studentJson);
}

function addPreviousPlacements() {
  for (i = 0; i < previousPlaceJson.length; i++) {
    for (j = 0; j < studentJson.length; j++) {
      if (previousPlaceJson[i]["Student Number"] == studentJson[j]["Number"]) {
        //  console.log("Match found adding previous placements to object")
        // First Placement
        if (previousPlaceJson[i]["Placement 1 ID"] == "NA")
          studentJson[j]["Placement 1"] = "";
        else
          studentJson[j]["Placement 1"] = previousPlaceJson[i]["Placement 1 ID"];
        // Second Placement
        if (previousPlaceJson[i]["Placement 2 ID"] == "NA")
          studentJson[j]["Placement 2"] = "";
        else
          studentJson[j]["Placement 2"] = previousPlaceJson[i]["Placement 2 ID"];
        // Third Placements
        if (previousPlaceJson[i]["Placement 3 ID"] == "NA")
          studentJson[j]["Placement 3"] = "";
        else
          studentJson[j]["Placement 3"] = previousPlaceJson[i]["Placement 3 ID"];

      }
    }
  }
  //  console.log(studentJson);
}

//assignStudent(studentJson, placementJson, previousPlaceJson, dublinNorth, dublinSouth);
function assignAll() {
  var studentJson = getStudentData();
  var placementJson = getPlacementData();
  var previousPlaceJson = getPrevPlacementData();
  assignStudent();

  function assignStudent() {
    // Assigning fourth years first which have a "Perfect match"
    for (i = 0; i < studentJson.length; i++) //Looping through students
    {
      for (j = 0; j < placementJson.length; j++) //Looping through placements
      {
        var previousExperience = false;

        if (previousPlaceJson[i]["Placement 1 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 2 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 3 ID"] == placementJson[j].id)
          previousExperience = true;

        if (studentJson[i]["Allocated Placement"] == "" && studentJson[i].Year == 4 &&
          studentJson[i].Location == placementJson[j].Location && studentJson[i].County == placementJson[j].County &&
          placementJson[j]["Number of Placements"] > 0 && previousExperience == false)
          studentAllocation(studentJson, placementJson, i, j);
      }
    }
    //Finding fourth years without perfect location, but finding North / South

    for (i = 0; i < studentJson.length; i++) //Looping through students
    {
      var studentNorth = false;
      if (dublinNorth.includes(studentJson[i].Location))
        studentNorth = true;

      for (j = 0; j < placementJson.length; j++) //Looping through placements
      {
        var placementNorth = false;
        if (dublinNorth.includes(placementJson[j].Location))
          placementNorth = true;

        var previousExperience = false;

        if (previousPlaceJson[i]["Placement 1 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 2 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 3 ID"] == placementJson[j].id)
          previousExperience = true;

        if (studentJson[i]["Allocated Placement"] == "" && studentJson[i].Year == 4 &&
          studentJson[i].Location != placementJson[j].Location && studentJson[i].County == placementJson[j].County &&
          placementJson[j]["Number of Placements"] > 0 && previousExperience == false && studentNorth == placementNorth)
          studentAllocation(studentJson, placementJson, i, j);
      }
    }

    //Finding Fourth Years with Correct County but not specific location
    for (i = 0; i < studentJson.length; i++) {
      for (j = 0; j < placementJson.length; j++) {
        var previousExperience = false;

        if (previousPlaceJson[i]["Placement 1 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 2 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 3 ID"] == placementJson[j].id)
          previousExperience = true;

        if (studentJson[i]["Allocated Placement"] == "" && studentJson[i].Year == 4 && studentJson[i].Location != placementJson[j].Location &&
          studentJson[i].County == placementJson[j].County && placementJson[j]["Number of Placements"] > 0 && previousExperience == false)
          studentAllocation(studentJson, placementJson, i, j);
      }
    }

    //Assigning fourth years based on province
    for (i = 0; i < studentJson.length; i++) {
      for (j = 0; j < placementJson.length; j++) {
        var previousExperience = false;

        if (previousPlaceJson[i]["Placement 1 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 2 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 3 ID"] == placementJson[j].id)
          previousExperience = true;

        if (studentJson[i]["Allocated Placement"] == "" && studentJson[i].Year == 4 && studentJson[i].Location != placementJson[j].Location &&
          studentJson[i].County == placementJson[j].County && placementJson[j]["Number of Placements"] > 0 && previousExperience == false &&
          studentJson[i].Province == placementJson[j].Province)
          studentAllocation(studentJson, placementJson, i, j);
      }
    }

    //Assigning remaining year groups with correct location
    for (i = 0; i < studentJson.length; i++) {
      for (j = 0; j < placementJson.length; j++) {
        var previousExperience = false;

        if (previousPlaceJson[i]["Placement 1 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 2 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 3 ID"] == placementJson[j].id)
          previousExperience = true;


        if (studentJson[i]["Allocated Placement"] == "" && studentJson[i].Location == placementJson[j].Location &&
          studentJson[i].County == placementJson[j].County && placementJson[j]["Number of Placements"] > 0 && previousExperience == false)
          studentAllocation(studentJson, placementJson, i, j);
      }
    }

    //Finding remaining years without perfect location, but finding North / South

    for (i = 0; i < studentJson.length; i++) //Looping through students
    {
      var studentNorth = false;
      if (dublinNorth.includes(studentJson[i].Location))
        studentNorth = true;

      for (j = 0; j < placementJson.length; j++) //Looping through placements
      {
        var placementNorth = false;
        if (dublinNorth.includes(placementJson[j].Location))
          placementNorth = true;

        var previousExperience = false;

        if (previousPlaceJson[i]["Placement 1 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 2 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 3 ID"] == placementJson[j].id)
          previousExperience = true;

        if (studentJson[i]["Allocated Placement"] == "" && studentJson[i].Location != placementJson[j].Location &&
          studentJson[i].County == placementJson[j].County && placementJson[j]["Number of Placements"] > 0 && previousExperience == false &&
          studentNorth == placementNorth)
          studentAllocation(studentJson, placementJson, i, j);
      }
    }

    //Remaining years, with correct county
    for (i = 0; i < studentJson.length; i++) {
      for (j = 0; j < placementJson.length; j++) {
        var previousExperience = false;

        if (previousPlaceJson[i]["Placement 1 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 2 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 3 ID"] == placementJson[j].id)
          previousExperience = true;


        if (studentJson[i]["Allocated Placement"] == "" && studentJson[i].Location != placementJson[j].Location &&
          studentJson[i].County == placementJson[j].County && placementJson[j]["Number of Placements"] > 0 && previousExperience == false)
          studentAllocation(studentJson, placementJson, i, j);
      }
    }

    //Remaining students with correct province
    for (i = 0; i < studentJson.length; i++) {
      for (j = 0; j < placementJson.length; j++) {
        var previousExperience = false;

        if (previousPlaceJson[i]["Placement 1 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 2 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 3 ID"] == placementJson[j].id)
          previousExperience = true;

        if (studentJson[i]["Allocated Placement"] == "" && studentJson[i].Location != placementJson[j].Location &&
          studentJson[i].County == placementJson[j].County && placementJson[j]["Number of Placements"] > 0 && previousExperience == false &&
          studentJson[i].Province == placementJson[j].Province)
          studentAllocation(studentJson, placementJson, i, j);
      }
    }

    //Left over students
    for (i = 0; i < studentJson.length; i++) {
      for (j = 0; j < placementJson.length; j++) {
        var previousExperience = false;

        if (previousPlaceJson[i]["Placement 1 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 2 ID"] == placementJson[j].id)
          previousExperience = true;

        if (previousPlaceJson[i]["Placement 3 ID"] == placementJson[j].id)
          previousExperience = true;

        if (studentJson[i]["Allocated Placement"] == "" && studentJson[i].Location != placementJson[j].Location &&
          studentJson[i].County != placementJson[j].County && placementJson[j]["Number of Placements"] > 0 && previousExperience == false)
          studentAllocation(studentJson, placementJson, i, j);
      }
    }
  }
  // displayStudents(studentJson, placementJson);


  function studentAllocation(studentJson, placementJson, i, j) {
    // console.log(placementJson);
    studentJson[i]["Allocated Placement"] = placementJson[j].id; //Assign placement id to student Allocated placement
    placementJson[j]["Number of Placements"] = placementJson[j]["Number of Placements"] - 1; //Decrement number of placements left at the location
    writeToPlacementCsv(placementJson);
    writeToStudentCsv(studentJson);
  }

}
