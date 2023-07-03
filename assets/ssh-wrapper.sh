#!/bin/bash
ACCOUNT=$1
FILE=$2
ARGS=$3
# echo "SSH-WRAPPER ${ACCOUNT} $(pwd) $FILE ${ARGS}"
ls -l ${FILE}
set -x
ssh ${ACCOUNT} 'bash -s' < ${FILE} $ARGS
set +x
echo "done-${ACCOUNT}"
#