#!/bin/bash

echo "Start example server build"
cd sdk && npm ci && npm run build

cd ../example-server && npm ci

cd ../

rm -rf example-server/tilia-nodejs-sdk/

mkdir -p example-server/tilia-nodejs-sdk

cp -R sdk/dist example-server/tilia-nodejs-sdk/dist

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
}" > example-server/tilia-nodejs-sdk/package.json

cd example-server && npm run build