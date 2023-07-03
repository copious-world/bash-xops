
USER=$1
ADDR=$2
DIR=$3
REMOTE_DIR=$4
if [ -z $REMOTE_DIR ]; then
    scp $USER@$ADDR:/home/naming/* ./$DIR/
else
    scp $USER@$ADDR:$REMOTE_DIR/* ./$DIR/
fi
