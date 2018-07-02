# Sweng-Group-12    [![Build Status](https://travis-ci.org/Donegaan/Sweng-Group-12.svg?branch=master)](https://travis-ci.org/Donegaan/Sweng-Group-12)
Repo for Allocation system for Students going on work placements

# Install dependencies
npm install
# Run the app
npm start
# Package the app
npm run build

# Documentation
Csv to JSON: https://www.npmjs.com/package/csvjson

Json to CSv: https://www.npmjs.com/package/convert-json-to-csv

Read and write to json package: https://www.npmjs.com/package/jsonfile

# CSV files
Our program reads and writes from the Students, Placements and Previous Placements csv files. These files store the student, placement and previous placement data that our program uses for the allocation process. We use csv files as it allows for easy transfer from the current system of excel files to our system.

# File paths
There are commented out file paths on lines 23,37,49,152 and 161. These file paths are used when packaging the files into a desktop application. The current file paths are used while developing the application.