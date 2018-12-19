# sakiewka-crypto-local

Local api.

### Usage:

First run:  
1.  `npm ci`  

Api documentation is available at `/api/docs`

### Updating sakiewka-crypto:

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
