# bash-xops

A library for executing `bash` ops through `ssh` with `expect` prior to node.js installation on remotes.

## rational

Since, node.js will likely not be installed on a new machine instance in some cloud, or personal cloud, it helps to have some bash commands that call upon **expect** to run remote scripts requiring entering user names and passwords. 

The methods need to send scripts to the remote computers to run, but under the authorization of ssh. The scripts can do things like install node.js, npm, n, git, etc. Once the system is ready to be used, other services can take over more with sophisticated methods for relaying assets.

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

Here is a use of the command line that has a machine configuration passed on the command line. Here, `machine.conf` has the authorization and IP information for a remote host.

First, it list a remote directory.
Second, it runs a silly script.
Third, it sends a directory up and into the test dir, *`big_test_thing`*
Fourt, it lists what's in the new remote directory.

(Note: lines ending in 'yes' are telling expect that the fingerprint will not be requested on the machine. 'yes' means we know the machine. If 'yes' is omitted, the scripts will attempt to respond to fingerprinting.)

```
$xops machine.conf
xops  test/host.conf
looking for a conf file in test/host.conf
CONFIG FILE:  test/host.conf
$>ldr . yes
$> spawn bash -c ssh moi@that-machine.what 'find  . -type d -maxdepth 1'
moi@that-machine.what password: 
.
./.forever

...

./big_test_thing
./node_modules
$>xbash test/moveme_move.sh yes test dog
$> spawn ./assets/ssh-wrapper.sh moi@that-machine.what test/moveme_move.sh "test dog"
SSH-WRAPPER moi@that-machine.what /the/cwd "test dog"
-rw-r--r--@ 1 moi  staff  63 Jul  2 18:17 test/moveme_move.sh
+ ssh moi@that-machine.what 'bash -s' '"test' 'dog"'
moi@that-machine.what's password: 
Sun 02 Jul 2023 06:38:27 PM PDT
/home/moi
It's great that dog is test
+ set +x
done-moi@that-machine.what

$> xsenddr test/moveme ./big_test_thing yes
$> spawn scp -r ./test/moveme moi@that-machine.what:./big_test_thing
moi@that-machine.what's password: 
test4.txt                                                                                                                                100%   64     2.0KB/s   00:00     
test3.txt                                                                                                                                100%   62     2.1KB/s   00:00    

$> ls big_test_thing/moveme yes
$> spawn bash -c ssh moi@that-machine.what 'ls -l big_test_thing/moveme'
moi@that-machine.what's password: 
total 8
-rw-r--r-- 1 moi moi 62 Jul  2 18:10 test3.txt
-rw-r--r-- 1 moi moi 64 Jul  2 18:10 test4.txt


```


## exported methods

* `expect_ensure_dir`
* `expect_list_dir`
* `expect_list_dir_dirs`
* `send_up`
* `expect_send_up`
* `expect_send_down`
* `send_dir_up`
* `expect_send_dir_up`
* `send_dir_down`
* `expect_send_dir_down`
* `perform_op`
* `perform_expect_op`
* `run_local_bash_script `


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


### Methods starting with *expect* launch expect scripts

These scripts require passwords passed in as base64 encoded. They need the `user` and the `ip` for `ssh` as such:

```
ssh user@ip ...etc
```

The other methods will stop and ask for a password from the user.

Please refer to the docs in the *docs* directory.
