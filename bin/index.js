#!/usr/bin/env node
const {load_config_file,run_commands} = require('gift-cli')
const cmds = require('./commands')
//
let config = false
let conf_file = "test/host.conf"
if ( process.argc > 2 ) {
    conf_file = process.argv[process.argc-1]
    console.log(`loading configuration ${conf_file}`)
} else {
    console.log("looking for a conf file in test/host.conf")
}
config = load_config_file(conf_file)
run_commands(cmds,config,process.stdin,process.stdout)
