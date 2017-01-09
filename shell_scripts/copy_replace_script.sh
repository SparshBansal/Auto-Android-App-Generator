#!/bin/bash
if test $# -ge 2; then

	sourceFile=$1
	destinationFile=$2

	# ========= REMOVE DESTINATION FILE ===========
	echo "Removing file.."
	rm "$destinationFile"
	echo "File deleted"

	# ========= COPY THE SOURCE FILE =============
	echo "copying files"
	cp "$sourceFile" "$destinationFile"
	echo "copied file"
	
else
	echo "Invalid number of arguments"
fi