#!/bin/bash
if test $# -ge 2; then

	sourceFile=$1
	destinationFile=$2

	echo "Removing file.."
	rm "$destinationFile"
	echo "File deleted"

	echo "copying files"
	cp "$sourceFile" "$destinationFile"
	echo "copied file"
else
	echo "Invalid number of arguments"
fi