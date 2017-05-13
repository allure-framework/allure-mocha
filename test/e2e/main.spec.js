"use strict";
var fs = require("fs");
var path = require("path");
var Mocha = require("mocha");
var outDir = path.join(__dirname, "results");
var mocha = new Mocha({
    reporter: require("../../"),
    reporterOptions: {
        targetDir: outDir
    }
});

fs.readdirSync(path.join(__dirname, "../fixtures")).filter(function(file) {
    return file.substr(-7) === "spec.js";
}).forEach(function(file) {
    mocha.addFile(
        path.join(__dirname, "../fixtures", file)
    );
});

mocha.run(function() {
    var libxmljs = require("libxmljs");
    var xsdDoc = libxmljs.parseXml(fs.readFileSync(path.join(__dirname, "schema/allure.xsd")));
    var result = fs.readdirSync(outDir).filter(function(file) {
        return file.match(/-testsuite.xml$/);
    }).every(function(file) {
        console.log("Validating", file); //eslint-disable-line no-console
        var xml = libxmljs.parseXml(fs.readFileSync(path.join(outDir, file)));
        var valid = xml.validate(xsdDoc);
        if(!valid) {
            console.log(xml.validationErrors); //eslint-disable-line no-console
        }
        return valid;
    });
    if(!result) {
        throw Error("XML with test result is not valid");
    }
});
