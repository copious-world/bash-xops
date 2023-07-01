# bash-xops

A library for executing bash ops through ssh with expect prior to node.js installation on remotes

## rational

Since, node.js will likely not be installed on a new machine instance in some cloud, or personal cloud, it helps to have some bash commands that call upon **expect** to run remote scripts requiring enter user names and passwords. 

The methods need to send scripts to the remote computers to run, but under the authorization of ssh. The scripts can do things like install node.js, npm, n, git, etc. Once the system is ready to be used, other services can take over and more sophisticated of relaying assets can be employed.

The user will likely use node.js from his own computer. So, this package wraps the bash scripts so that they can be called out of node.js tools the user might create or use.

### What about Docker and others?

One might use these tools to communicate with a new instance spun up under Docker or others. 


## install

```
npm install bash-xops
```

### tiny command line tool


```
npm install -g bash-xops
```

For example:

```
$xops upload-dir ./my-stuff machine.conf
```

Where `machine.conf` has the authorization and IP information for a remote host.


## exported methods

* `expect_ensure_dir`
* `send_up`
* `expect_send_up`
* `expect_send_down`
* `send_dir_up`
* `send_dir_down`
* `perform_op`
* `perform_expect_op`
* `run_local_script`


### All exported methods are async


All the methods are asynchronous. They should be called with await or other promise control.

Here is an example:

```
const xops = require('bash-xops')
const cmd_line_args = require('args-getter')

let [pass,user,addr,resident_file,remote_dir] = cmd_line_args()

async fun() {
	await xops.expect_send_up(pass,user,addr,resident_file,remote_dir)
}

fun()

```


