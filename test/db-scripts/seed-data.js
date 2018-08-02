require('dotenv').config();
const { execSync } = require('child_process');


const HEROKU_PASSWORD = process.env.HEROKU_PASSWORD;
const HEROKU_USERNAME = process.env.HEROKU_USERNAME;
const HEROKU_DBNAME = process.env.HEROKU_DBNAME;
const HPORT = process.env.HPORT;

const command = 'mongoimport -h ds023418.mlab.com:' + HPORT + ' -d ' + HEROKU_DBNAME + ' -c stages -u ' + HEROKU_USERNAME + ' -p ' + HEROKU_PASSWORD + ' --drop  --file ./stages.json';

const command2 = 'mongoimport -h ds023418.mlab.com:' + HPORT + ' -d ' + HEROKU_DBNAME + ' -c responses -u ' + HEROKU_USERNAME + ' -p ' + HEROKU_PASSWORD + ' --drop  --file ./responses.json';


execSync(command);
execSync(command2);