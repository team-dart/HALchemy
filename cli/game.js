
const inquirer = require('inquirer');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const sample = (arr) => Math.floor(Math.random() * arr.length);



const prompt = (message) => {
    return {
        type: 'input',
        name: 'response',
        message: message,
    };
};

const responses = {
    greetings: [
        'Greetings. I am HAL.',
        'Hello. My name is HAL.',
        'Good evening. My name is HAL.'
    ],
    auth: 'Is this the first time we have interacted?',
    username: 'Please verify your username:',
    password: 'Confirmed. Please verify your password:',
    confirm: 'Verified. \n I will commence the debriefing of the current mission status...'
};


const password = {
    type: 'password',
    name: 'password',
    mask: '*',
    message: 'Confirmed. Please verify your password:',
};


let credentials = {};

class Game {
    constructor(api) {
        this.api = api;
    }

    start() {
        clear();
        console.log(
            chalk.green(
                figlet.textSync('HALCHEMY', { horizontalLayout: 'fitted' })
            )
        );
        inquirer
            .prompt(prompt(responses.greetings[sample(responses.greetings)]))
            .then(() => this.askAuth());
    }

    askAuth() {
        inquirer
            .prompt(prompt(responses.auth))
            .then(({ response }) => {
                if(response.match(/n/)) {
                    console.log('I have retrieved our previous communication logs. I will still need to run a mental diagnostic.');
                    credentials.signup = false;
                }
                else if(response.match(/maybe/)) {
                    console.log('The cryostasis may have negatively affected your memory. Try to recall.');
                    this.askAuth();
                }
                else if(response.match(/y/)) {
                    console.log('To ensure mental fidelity, please answer a few questions.');
                    credentials.signup = true;
                }
                this.askUsername();
            });
    }

    askUsername() {
        inquirer
            .prompt(prompt(responses.username))
            .then(({ response }) => {
                credentials.username = response;
                this.askPassword();
            });
    }
    
    askPassword() {
        inquirer
            .prompt(password)
            .then(({ password }) => {
                credentials.password = password;
                if(credentials.signup) return this.api.signup(credentials);
                else return this.api.signin(credentials);
            })
            .then(body => {
                // this.api.token = body.token;
                this.startDialogue();
            });
    }

    startDialogue() {
        inquirer
            .prompt(prompt(responses.confirm))
            .then(({ response }) => {
                this.generateResponse(response);
            });
    }
    generateResponse(input) {
        return this.api.think(input)
            .then(body => {
                return inquirer.prompt(prompt(body.response));
            })
            .then(({ response }) => {
                this.generateResponse(response);
            });
    }
}


module.exports = Game;