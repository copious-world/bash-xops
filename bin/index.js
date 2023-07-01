#!/usr/bin/env node

const xops = require('../lib/exec_ops')
const fs = require('fs')
const jsTokens = require("js-tokens");


function load_config_file(conf_file) {
    console.log("CONFIG FILE: ",conf_file)
    let config = false
    try {
        let confstr = fs.readFileSync(conf_file)
        confstr = confstr.toString()
        config = JSON.parse(confstr)
    } catch(e) {
        if ( conf_file === "test/host.conf" ) {
            console.log("no default config found -- use 'load conf <file path>' to load a configuration.")
        } else {
            console.log(`The configuration file ${conf_file} could not be processed`)
            console.log("check that the file exists or check that the file has correct JSON format")
        }
    }
    return config
}


function clump_clumps(line_tokens) {
    let n = line_tokens.length
    let clump = []
    let clump_state = false
    let clump_start = Infinity
    for ( let i = 0; i < n; i++ ) {
        let tok = line_tokens[i]
        if ( ((tok.type === 'Punctuator') 
                || ((tok.type === 'IdentifierName') && (line_tokens[i+1].type === 'Punctuator'))) && !clump_state ) {
            clump.push(tok)
            clump_state = true
            clump_start = i
        } else if ( tok.type === 'WhiteSpace' ) {
            if ( clump_state ) {
                clump_state = false
                let start_tok = line_tokens[clump_start]
                let clumped = ""
                clump_start = Infinity
                for ( let ctok of clump ) {
                    ctok.type = 'spent'
                    let str = ctok.value
                    ctok.value = '-'
                    clumped += str
                }
                clump = []
                start_tok.value = clumped
                start_tok.type = 'ClumpedTokens'
            }
        } else if ( clump_state ) {
            clump.push(tok)
        }
    }

    return line_tokens
}


function tokenize(line) {
    line += ' '  // helps with clumping
    let line_tok = Array.from(jsTokens(line))

    line_tok = clump_clumps(line_tok)

    line_tok = line_tok.filter( tok => {
        if ( tok.type === 'WhiteSpace' ) return false
        if ( tok.type === 'spent' ) return false
        return true
    })

    return line_tok
}



function front_tokens(token_list,start,count) {
    if ( Array.isArray(token_list) ) {
        let sublist = token_list.slice(start,start + count)
        sublist = sublist.map( tok => {
            return tok.value
        })
        return sublist.join(' ')
    }
    return false
}



// PROCESS COMMANDS
async function process_command(tokens,conf) {
    let com = front_tokens(tokens,0,1)
    switch (com) {
        case 'mkdir' : {
            let dir = front_tokens(tokens,1,1)
            console.log(`mkdir will create a directory tree for ${dir}`)
            xops.expect_ensure_dir()
        }
    }
}



let config = false
let conf_file = "test/host.conf"
if ( process.argc > 2 ) {
    conf_file = process.argv[process.argc-1]
    console.log(`loading configuration ${conf_file}`)
} else {
    console.log("looking for a conf file in test/host.conf")
}
config = load_config_file(conf_file)


const readline = require('node:readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '$> ',
});

rl.prompt();

rl.on('line', (line) => {
    let ll = line.trim()
    switch (ll) {
        case 'exit':
            rl.close()
            break;
        default:
            let tokens = tokenize(ll)
            //
            if ( front_tokens(tokens,0,2) === 'load conf') {
                let conf_file = front_tokens(tokens,2,1)
                if ( (typeof conf_file === 'string') && (conf_file.length > 4) ) {
                    config = load_config_file(conf_file)
                    console.dir(config)
                }
            }
            //
            if ( config === false ) {
                console.log("the configuration file has not been loaded... load a configuration with 'load conf'")
            } else {
                process_command(tokens,config)
            }
            //
            break;
    }
    rl.prompt();
}).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
});

