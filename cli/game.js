
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
            .then(({ response }) => {
                response = response.toLowerCase();
                if(response.match(/n/)) {
                    console.log('I have retrieved our previous communication logs. I will still need to run a mental diagnostic.');
                    credentials.signup = false;
                    this.askUsername();
                }
                else if(response.match(/maybe/)) {
                    console.log('The cryostasis may have negatively affected your memory. Try to recall.');
                    this.askAuth();
                }
                else if(response.match(/y/)) {
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
            .then(({ response }) => {
                credentials.name = response;
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
                this.generateResponse({ answer });
            });
    }

    generateResponse(input) {
        const sentence = input.answer.toLowerCase().split(' ');
        // BESPOKE NATURAL LANGUAGE PROCESSOR
        const keywords = ['asteroids', 'ship', 'stats', 'avoid', 'through', 'hi', 'hey', 'hello'];
        input.answer = sentence.filter(w => keywords.includes(w));
        if(input.answer.includes('ship' && 'stats')) {
            return this.api.getShipStats();
        }
        else {
            input.answer = input.answer.join('+');
            input.mood = this.mood;
            return this.api.think(input)
                .then(body => inquirer.prompt(prompt(body.output.response)))
                .then((answer) => {
                    this.generateResponse(answer);
                });
        }
    }
}


module.exports = Game;