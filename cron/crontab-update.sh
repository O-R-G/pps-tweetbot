#!/bin/bash

SCRIPT=`realpath $0`
SCRIPTPATH=`dirname $SCRIPT`

$SCRIPTPATH/crontab-make.py
crontab $SCRIPTPATH/crontab.txt