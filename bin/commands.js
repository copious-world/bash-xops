

const xops = require('../lib/exec_ops')
const {load_config_file,front_tokens,rest_tokens,rest_tokens_array} = require('gift-cli')


/**
 * @typedef Token
 * @type {object}
 * @property {string} type - type names returned by js-tokens.
 * @property {string} value - an island of characters seen in an input string to the parser.
 */


/**
 * A basic command class for a command line required for use by gift-cli.
 * 
 * 
 */
class BasicCommands {

    constructor() {
    }

    try_getting_conf(tokens) {
        let config = false
        if ( front_tokens(tokens,0,2) === 'load conf') {
            let conf_file = front_tokens(tokens,2,1)
            if ( (typeof conf_file === 'string') && (conf_file.length > 4) ) {
                config = load_config_file(conf_file)
                console.dir(config)
            }
        }
        return config
    }


    /**
     * Offers up a set of commands for performing ops on a remote computer.
     * This command processor has been made for testing xops
     * 
     * Commands offered: mdkir, ls, ldr, send, xsend, xget, senddr, xsenddr, getdr, xgetdr
     * rbash, xbash, bash
     * 
     * @param {Token[]} tokens 
     * @param {object} conf 
     */
    async process_command(tokens,conf) {
        let com = front_tokens(tokens,0,1)
        if ( com === false ) return;
        switch (com) {
            case 'mkdir' : {
                let remote_dir = front_tokens(tokens,1,1)
                let known_host = front_tokens(tokens,2,1)
                console.log(`mkdir will create a directory tree for ${remote_dir}`)
                let b64pass = Buffer.from(conf.pass).toString('base64')
                await xops.expect_ensure_dir(b64pass,conf.user,conf.IP,remote_dir,known_host)
                break
            }
            case'ls' : {
                let remote_dir = front_tokens(tokens,1,1)
                let known_host = front_tokens(tokens,2,1)
                let b64pass = Buffer.from(conf.pass).toString('base64')
                let output = await xops.expect_list_dir(b64pass,conf.user,conf.IP,remote_dir,known_host)
                console.log(output + '\n')
                break
            }
            case 'ldr' : {
                let remote_dir = front_tokens(tokens,1,1)
                let known_host = front_tokens(tokens,2,1)
                let b64pass = Buffer.from(conf.pass).toString('base64')
                let output = await xops.expect_list_dir_dirs(b64pass,conf.user,conf.IP,remote_dir,known_host)
                console.log(output + '\n')
                break
            }
            case 'send': {
                let file = front_tokens(tokens,1,1)
                let remote_dir = front_tokens(tokens,2,1)
                await xops.send_up(conf.user,conf.IP,file,remote_dir)
                break;
            }
            case 'xsend': {
                let b64pass = Buffer.from(conf.pass).toString('base64')
                let file = front_tokens(tokens,1,1)
                let remote_dir = front_tokens(tokens,2,1)
                let known_host = front_tokens(tokens,3,1)
                await xops.expect_send_up(b64pass,conf.user,conf.IP,file,remote_dir,known_host)
                break;
            }
            case 'xget' : {
                let b64pass = Buffer.from(conf.pass).toString('base64')
                let file = front_tokens(tokens,1,1)
                let remote_dir = front_tokens(tokens,2,1)
                let known_host = front_tokens(tokens,3,1)
                await xops.expect_send_down(b64pass,conf.user,conf.IP,file,remote_dir,known_host)
                break;
            }
            case 'senddr' : {
                let local_dir = front_tokens(tokens,1,1)
                let remote_dir = front_tokens(tokens,2,1)
                await xops.send_dir_up(conf.user,conf.IP,local_dir,remote_dir)
                break;
            }
            case 'xsenddr' : {
                let b64pass = Buffer.from(conf.pass).toString('base64')
                let local_dir = front_tokens(tokens,1,1)
                let remote_dir = front_tokens(tokens,2,1)
                let known_host = front_tokens(tokens,3,1)
                let out = await xops.expect_send_dir_up(b64pass,conf.user,conf.IP,local_dir,remote_dir,known_host)
                console.log(out)
                break;
            }
            case 'getdr' : {
                let local_dir = front_tokens(tokens,1,1)
                let remote_dir = front_tokens(tokens,2,1)
                await xops.send_dir_down(conf.user,conf.IP,local_dir,remote_dir)
                break
            }
            case 'xgetdr' : {
                let b64pass = Buffer.from(conf.pass).toString('base64')
                let local_dir = front_tokens(tokens,1,1)
                let remote_dir = front_tokens(tokens,2,1)
                let known_host = front_tokens(tokens,3,1)
                await xops.expect_send_dir_down(b64pass,user,addr,local_dir,remote_dir,known_host)
                break
            }
            case 'rbash' : {
                let bash_op = front_tokens(tokens,1,1)
                await xops.perform_op(conf.user,conf.IP, bash_op)
                break;
            }
            case 'xbash' : {
                let b64pass = Buffer.from(conf.pass).toString('base64')
                let bash_op = front_tokens(tokens,1,1)
                let known_host = front_tokens(tokens,2,1)
                let params = rest_tokens(tokens,3)
                let out = await xops.perform_expect_op(b64pass,conf.user,conf.IP, bash_op, params,known_host)
                console.log(out)
                break;
            }
            case "bash" : {
                let bash_op = front_tokens(tokens,1,1)
                let params = rest_tokens_array(tokens,2)
                let out = await xops.run_local_bash_script(bash_op,params)
                console.log(out)
                break;
            }
            case 'show' : {
                let what = front_tokens(tokens,1,1)
                if ( what ) {
                    switch ( what ) {
                        case 'conf' : {
                            console.dir(conf)
                            break
                        }
                        default : {
                            console.log('unknown ${what}')
                            break
                        }
                    }
                }
                break
            }
            default : {
                console.log('unknown command ${com}')
                break
            }
        }
    }

}




module.exports = new BasicCommands()
module.exports.BasicCommands = BasicCommands // allow subclassing

