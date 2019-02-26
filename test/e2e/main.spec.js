let fs = require('fs');
let path = require('path');
let Mocha = require('mocha');
let outDir = path.join(__dirname, 'results');
let mocha = new Mocha({
    reporter: require('../../'),
    reporterOptions: {
        targetDir: outDir
    }
});

fs.readdirSync(path.join(__dirname, '../fixtures')).filter(function(file) {
    return file.substr(-7) === 'spec.js';
}).forEach(function(file) {
    mocha.addFile(
        path.join(__dirname, '../fixtures', file)
    );
});

mocha.run(function() {
    let libxmljs = require('libxmljs');
    let xsdDoc = libxmljs.parseXml(fs.readFileSync(path.join(__dirname, 'schema/allure.xsd')));
    let result = fs.readdirSync(outDir).filter(function(file) {
        return file.match(/-testsuite.xml$/);
    }).every(function(file) {
        console.log('Validating', file); //eslint-disable-line no-console
        let xml = libxmljs.parseXml(fs.readFileSync(path.join(outDir, file)));
        let valid = xml.validate(xsdDoc);
        if(!valid) {
            console.log(xml.validationErrors); //eslint-disable-line no-console
        }
        return valid;
    });
    if(!result) {
        throw Error('XML with test result is not valid');
    }
});
