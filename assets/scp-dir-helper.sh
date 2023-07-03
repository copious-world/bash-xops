
USER=$1
ADDR=$2
DIR=$3
REMOTE_DIR=$4
if [ -z $REMOTE_DIR ]; then
    scp ./$DIR/* $USER@$ADDR:/home/naming/
else
    scp ./$DIR/* $USER@$ADDR:$REMOTE_DIR
fi
