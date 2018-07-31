
const inquirer = require('inquirer');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');



const prompt = (message) => {
    return {
        type: 'input',
        name: 'answer',
        message: message,
    };
};

const responses = {
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
        this.mood = 100;
    }

    start() {
        clear();
        console.log(
            chalk.green(
                figlet.textSync('HALCHEMY', { horizontalLayout: 'fitted' })
            )
        );
        inquirer
            .prompt(prompt('Hello. My name is HAL.'))
            .then(() => this.askAuth());
    }

    askAuth() {
        inquirer
            .prompt(prompt(responses.auth))
            .then(({ answer }) => {
                answer = answer.toLowerCase();
                if(answer.match(/n/)) {
                    console.log('I have retrieved our previous communication logs. I will still need to run a mental diagnostic.');
                    credentials.signup = false;
                    this.askUsername();
                }
                else if(answer.match(/maybe/)) {
                    console.log('The cryostasis may have negatively affected your memory. Try to recall.');
                    this.askAuth();
                }
                else if(answer.match(/y/)) {
                    console.log('To ensure mental fidelity, please answer a few questions.');
                    credentials.signup = true;
                    this.askUsername();
                }
                else {
                    console.log('It is imperative that you answer the question.');
                    this.askAuth();
                }
            });
    }

    askUsername() {
        inquirer
            .prompt(prompt(responses.username))
            .then(({ answer }) => {
                credentials.name = answer;
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
                this.api.token = body.token;
                
                this.startDialogue();
            });
    }

    startDialogue() {
        inquirer
            .prompt(prompt(responses.confirm))
            .then(({ answer }) => {
                this.generateResponse(answer);
            });
    }

    generateResponse(input) {
        return this.api.parseIntent(input)
            .then(intent => {
                return this.api.think(intent[0].value);
            })
            .then(body => {
                console.log('BODY', body);
                // if continue = true, do something different
                return inquirer.prompt(prompt(body.output.response));
            })
            .then(({ answer }) => {
                this.generateResponse(answer);
            });
    }
}




module.exports = Game;