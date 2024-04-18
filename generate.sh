#!/bin/bash
cd ./src/resources

if [ $# -eq 0 ]; then
  echo "ERROR: Please provide resource name as an argument."
  exit 1
fi

file_name="$1"
folder_name="$file_name"
mkdir "$folder_name"

touch "$folder_name/$file_name.middleware.ts"
touch "$folder_name/$file_name.model.ts"
touch "$folder_name/$file_name.handler.ts"
touch "$folder_name/$file_name.interface.ts"
touch "$folder_name/$file_name.controller.ts"
touch "$folder_name/$file_name.service.ts"
touch "$folder_name/$file_name.validation.ts"


echo "$file_name resource created successfully."