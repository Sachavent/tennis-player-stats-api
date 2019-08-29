# api-tennis-player-stats

## PREREQUIRES
You should have:
- node 10 install or nvm (nvm use or nvm install)
- Docker

## INTALLING AND RUN
- `nvm use` (to get node 10)
- `npm install`
- `npm run dev`

## Docker
- To build the image: `docker build -t tennis-player-stats-api .`
- To run the image: `docker run --name tennis-player-stats-api -e TERM=xterm -e NODE_ENV=dev -p 8001:3000 -d tennis-player-stats-api`
- To test it, you can use curl : `curl http://127.0.0.1:8001/players`

## Tests
To run tests:
- Build and execute image Docker (refer to previous part)
- `npm run test`

## Documentation
Will be generated later by a swagger

## Parameters validation
To validate parameters, i'm using AJV: another json schema validation

More documentation there : https://github.com/epoberezkin/ajv

## Tslint
To test syntax: npm run lint
To fix errors from linter : npm run fix-lint

## Testing perfs
Note: You may need to be logged as root to process this:
After lauching the server on local, run:

`ab -c 200 -n 2000 "http://localhost:3000/"`
