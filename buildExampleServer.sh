#!/bin/bash

echo "Start example server build"
cd sdk && npm ci && npm run build

cd ../

echo "Copy example server"
rm -rf server
rsync -r --progress example-server/ server --exclude node_modules
sed -i '' 's/file:..\/sdk/file:.\/tilia-nodejs-sdk/g' server/package.json

cd server && npm ci

cd ../

mkdir -p server/tilia-nodejs-sdk
pwd
cp -R sdk/dist server/tilia-nodejs-sdk/dist

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
}" > server/tilia-nodejs-sdk/package.json

cd server && npm run build