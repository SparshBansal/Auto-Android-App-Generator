#!/bin/bash
if test $# -ge 3; then

	sourceProjectDir=$1
	destinationDir=$2
	projectName=$3
	
	packageName=${projectName// /}
	projectDir=$destinationDir$projectName'/'
	

	# ======== MAKING DIRECTORY ================
	echo "Making Directory"
	mkdir "$projectDir"
	echo "Directory Made.."
	
	# ========= COPY BASE PROJECT ==============
	echo "Copying Base Project"
	cp -r "$sourceProjectDir"'.' "$projectDir"
	echo "Copied Base Project"

	# ======== UPDATE PACKAGE NAMES ============
	echo "Updating Package Names"
	find "$projectDir" -type f -exec sed -i 's/com.developer.sparsh.baseapplication/com.amethyst.labs.'$packageName'/g' {} +
	echo "Updated Package Names"

else
	echo "Invalid arguments. Could not make directory"
fi