
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

const authPrompts = [
    {
        type: 'input',
        name: 'name',
        message: 'Please verify your username:'
    },
    {
        type: 'password',
        name: 'password',
        mask: '*',
        message: 'Confirmed. Please verify your password:',
    }
];

class Game {
    constructor(api) {
        this.api = api;
        this.ship = {};
        this.signup = false;
        this.token;
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
            .then(() => this.askAuthChoice());
    }

    askAuthChoice() {
        inquirer
            .prompt(prompt('Is this the first time we have interacted?'))
            .then(({ answer }) => {
                answer = answer.toLowerCase();
                if(answer.match(/n/)) {
                    console.log('I have retrieved our previous communication logs. I will still need to run a mental diagnostic.');
                    this.askAuth();
                }
                else if(answer.match(/maybe/)) {
                    console.log('The cryostasis may have negatively affected your memory. Try to recall.');
                    this.askAuthChoice();
                }
                else if(answer.match(/y/)) {
                    console.log('To ensure mental fidelity, please answer a few questions.');
                    this.signup = true;
                    this.askAuth();
                }
                else {
                    console.log('It is imperative that you answer the question.');
                    this.askAuthChoice();
                }
            });
    }

    askAuth() {
        inquirer
            .prompt(authPrompts)
            .then(({ name, password }) => {
                if(this.signup) return this.api.signup({ name, password });
                else return this.api.signin({ name, password });
            })
            .then(() => {
                return this.api.getShip();
            })
            .then(ship => {
                this.ship = ship;
                this.startDialogue();
            });
    }

    startDialogue() {
        return this.api.getStage(this.ship.stage)
            .then(data => {
                console.log('Excellent. Your identity has been verified. \n I will commence the debriefing of the current mission status...');
                inquirer
                    .prompt(prompt(data))
                    .then(({ answer }) => {
                        this.generateResponse(answer);
                    });
            });
    }

    generateResponse(input) {
        return this.api.parseIntent(input)
            .then(intent => {
                return this.api.getResponse(intent);
            })
            .then(body => {
                let response;
                if(body.continue) {
                    response = body.output.response;
                    console.log('MOVING ON TO STAGE', body.continue);
                    return this.api.updateStage(body.continue)
                        .then(() => inquirer.prompt(prompt(response)));
                }
                else return inquirer.prompt(prompt(body.output.response));
            })
            .then(({ answer }) => {
                this.generateResponse(answer);
            });
    }
}




module.exports = Game;