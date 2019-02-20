# sakiewka-crypto-local

Local api.

### Usage:

First run:  
1.  `npm ci`  

Api documentation is available at `/api/docs`

### package.json modification:

Do not modify package.lock manually. Always use `npm install` when adding or updating packages.

Especially use `npm install` when updating sakiewka-crypto like below:

`npm install softwaremill/sakiewka-crypto#${commitHash}`

##### Tests: 
To run integration tests you have to specify `BACKEND_API_URL` in `.env` file.

`npm test` - Runs all tests  
`npm run watch-test` - Runs tests in watch mode  

##### Build: 
`npm run build` - Builds .ts files into dist/ folder  

##### Local api:  
`npm run start` - Runs local server.  
`npm run serve-debug` - Runs local server in debug mode.  
`npm run watch-debug` - Runs local server and watches files for changes.  


## Dev Environment

To connect with `sakiewka-api` at dev environment (https://api.dev.sakiewka.sml.io) you can run this command:


```bash
docker run -d -e BACKEND_API_URL='https://api.dev.sakiewka.sml.io/api/v1' -e BTC_NETWORK=regtest -p 3000:3000 softwaremill/sakiewka-crypto-local
```