var fs = require('fs');
var outfile = "testfile.html"; 
var  rest = require('restler');
var program = require('commander');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URLFILE_DEFAULT = "http://fierce-reaches-1073.herokuapp.com";
var cheerio = require('cheerio');

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

function getUrlFile(urlfile) {
	
	console.log("3"+urlfile);
	

	rest.get(urlfile).on('complete', function(result) {
		if (result instanceof Error) {
			sys.puts('Error: ' + result.message);
			this.retry(5000); // try again after 5 sec
		} else {
			//fs.writeFileSync(outfile, result);
			console.log(result);
		}
	});	
}
getUrlFile(URLFILE_DEFAULT);

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

if(require.main == module) {
program
.option('-c, --checks <check_file>', 'checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
//.option('-f, --file <html_file>', 'index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
.option('-u, --url <url_file>', 'http://fierce-reaches-1073.herokuapp.com', clone(assertFileExists), URLFILE_DEFAULT)
.parse(process.argv);
if(program.file){
var checkJson = checkHtmlFile(program.file, program.checks);
} else if(program.url){
console.log("2"+program.url);
getUrlFile(program.url);
var checkJson = checkHtmlFile(outfile, program.checks);
}
}
