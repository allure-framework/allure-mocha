var fs = require('fs'),
    path = require('path'),
    outDir = path.join(__dirname, 'out'),
    Mocha = require('mocha'),
    mocha = new Mocha({
        reporter: require('../../'),
        reporterOptions: {
            targetDir: outDir
        }
    });

fs.readdirSync(path.join(__dirname, '../fixtures')).filter(function(file){
    return file.substr(-7) === 'spec.js';
}).forEach(function(file){
    mocha.addFile(
        path.join(__dirname, '../fixtures', file)
    );
});

mocha.run(function(){
    var libxmljs = require("libxmljs"),
        xsdDoc = libxmljs.parseXml(fs.readFileSync(path.join(__dirname, 'schema/allure.xsd'))),
        result = fs.readdirSync(outDir).filter(function(file) {
            return file.match(/-testsuite.xml$/);
        }).every(function(file) {
            console.log('Validating', file);
            var xml = libxmljs.parseXml(fs.readFileSync(path.join(outDir, file))),
                valid = xml.validate(xsdDoc);
            if(!valid) {
                console.log(xml.validationErrors);
            }
            return valid;
        });
    process.exit(result ? 0 : 1)
});


