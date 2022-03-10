#!/bin/bash
echo $PWD 
WORKING_DIR=$PWD
BUILD_FOLDER_PATH=example-server/dist/express-example

echo "---> Build SDK"
cd sdk && npm ci && npm run build

cd $WORKING_DIR

echo "---> Copy relevant example server files to dist"
rm -rf $BUILD_FOLDER_PATH
mkdir -p $BUILD_FOLDER_PATH
rsync -r --progress example-server/ $BUILD_FOLDER_PATH --exclude node_modules  --exclude .env --exclude dist
echo "---> Overrite tilia-nodejs-sdk file path in package.json"
sed -i '' 's/file:..\/sdk/file:.\/tilia-nodejs-sdk/g' $BUILD_FOLDER_PATH/package.json

echo "---> Add sdk package folder"
mkdir -p $BUILD_FOLDER_PATH/tilia-nodejs-sdk
echo "---> Copy sdk into build folder"
cp -R sdk/dist $BUILD_FOLDER_PATH/tilia-nodejs-sdk/dist

echo "---> Overrite package.json"
echo "{
    \"version\": \"0.1.0\",
    \"license\": \"MIT\",
    \"main\": \"dist/index.js\",
    \"typings\": \"dist/index.d.ts\",
    \"files\": [
        \"dist\",
        \"src\"
    ],
    \"name\": \"tilia-nodejs-sdk\",
    \"module\": \"dist/tilia-nodejs-sdk.esm.js\",
    \"dependencies\": {
        \"axios\": \"^0.24.0\"
    }
}" > $BUILD_FOLDER_PATH/tilia-nodejs-sdk/package.json