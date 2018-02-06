const inquirer = require('inquirer');
const moment = require('moment');
const fs = require('fs');
const prependFile = require('prepend-file');

inquirer.prompt([
    {
        name: 'dataType',
        type: 'list',
        choices: ['file', 'input'],
        message: 'What is the type of the data'
    }
]).then(dtAns => {
    dataType = dtAns.dataType;
    if (dataType == 'file'){
        inquirer.prompt([
            {
                name: 'filePath',
                message: 'File Path',
                type: 'input'
            }
        ]).then(answers => {
            file(answers.filePath);
        })
    } else if (dataType == 'input'){
        input(configs);
    }
})

function getConfigs(){
    return inquirer.prompt([
        {
            name: 'dueMomentFormat',
            type: 'input',
            message: 'Moment format for due date'
        },
        {
            name: 'nameRegex',
            type: 'input',
            message: 'Regex for name'
        },
        {
            name: 'nameFormat',
            type: 'input',
            message: 'Format for name'
        }
    ])
}

var homeworks = [];

// data is a file
function file(filePath){
    function processFile(configs, lines){
        for(var i = 1; i < lines.length; i += 2){
            var due = lines[i];
            var name = lines[i+1];

            homeworks.push(generateHWJson({
                dueText: due,
                nameText: name,
                ...configs
            }))
        }

        console.log(JSON.stringify(homeworks));
    }

    fs.readFile(filePath, 'utf8', function(err, data) {  
        var lines = data.split('\n');
        
        if (lines[0].indexOf('header') > 0){
            // contains header file
            var configs = JSON.parse(lines[0].replace("{{header}}", ""));
            processFile(configs, lines);
        } else {
            getConfigs().then((configs) => {
                prependFile(filePath, `{{header}}${JSON.stringify(configs)}\n`, function(){
                    processFile(configs, lines);
                })
            })
        }

       
    });
}

// data is a direct input
function input(configs){
    inquirer.prompt([
        {
            name: 'dueText',
            message: 'Due Text',
            type: 'input'
        },
        {
            name: 'nameText',
            message: 'Name Text',
            type: 'input'
        }
    ]).then(answers => {
        var hwData = generateHWJson({
            ...answers, ...configs
        })

        homeworks.push(hwData);
        
        inquirer.prompt([
            {
                name: 'continue',
                message: 'Continue',
                type: 'confirm',
                default: true
            }
        ]).then(ans => {
            if (ans.continue){
                input(configs);
            } else {
                console.log(JSON.stringify(homeworks));
            }
        })
    })
}

//  nameText, nameFormat, dueText, dueMomentFormat, nameRegex
function generateHWJson(configs){
    var dueText = configs.dueText.trim()
    var due = moment(dueText, configs.dueMomentFormat);

    var nameVars = configs.nameText
        .trim()
        .match(configs.nameRegex)
        .splice(1); // ignore first uneeded element 
    
    var name = configs.nameFormat
        .replace(/{([0-9]*)}/g, (match, p, offset, string) => {
            var index = parseInt(p); 
            return nameVars[index];
        });
    
    return {
        name: name,
        due: due.format("MM/DD/YYYY")
    }
}


// DD MMM
// (.*:) (pages) ([0-9]*)-([0-9]*)
// Reading - [pg. {2}-{3}]
// 13Apr
//  0.2: pages 1-10
