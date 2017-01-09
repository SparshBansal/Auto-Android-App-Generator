#!/bin/bash
if test $# -ge 1; then
	
	projectDir=$1

	# ======== GRADLE BUILD APPLICATION ========
	echo "Building application"
	gradle -p "$projectDir" assembleDebug
	echo "Application built"

else
	echo "Invalid arguments. Could not make directory"
fi