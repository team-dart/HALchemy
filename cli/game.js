
const inquirer = require('inquirer');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');



const prompt = (message) => {
    return {
        type: 'input',
        name: 'answer',
        message: message,
        default: '?'
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
                    .prompt(prompt(data.intro))
                    .then(({ answer }) => {
                        this.generateResponse(answer);
                    });
            });
    }

    generateResponse(input) {
        this.moodCheck();
        return this.api.parseIntent(input)
            .then(intent => {
                return this.api.think(intent, this.ship.mood, this.ship.stage);
            })
            .then(body => {
                let response;
                if(body.output) {
                    response = body.output.response;
                    this.ship.mood += body.output.change;
                }
                else response = body;

                if(body.continue === 'Asteroids-Direct') {
                    return this.flyThroughAsteroids(body);
                }
                else if(body.continue === 'Asteroids-Avoid') {
                    return this.flyAroundAsteroids(body);
                }
                else if(body.continue === 'Earth') {
                    return this.arriveAtEarth(response);
                }
                else if(body.continue === 'Death') {
                    return this.die(response);
                }
                else return inquirer.prompt(prompt(response));

            })
            .then(({ answer }) => {
                this.generateResponse(answer);
            });
    }

    flyThroughAsteroids(body) {
        console.log(body.output.response);
        this.ship.shields -= 50;
        this.ship.oxygen -= 20;
        this.ship.fuel -= 20;
        this.ship.stage = body.continue;
        
        return this.api.updateShip(this.ship)
            .then(() => {
                return this.api.getStage(this.ship.stage);
            })
            .then(data => {
                return inquirer.prompt(prompt(data.intro));
            });
    }

    flyAroundAsteroids(body) {
        console.log(body.output.response);
        this.ship.shields -= 10;
        this.ship.oxygen -= 10;
        this.ship.fuel -= 10;
        this.ship.stage = body.continue;
        
        return this.api.updateShip(this.ship)
            .then(() => {
                return this.api.getStage(this.ship.stage);
            })
            .then(data => {
                return inquirer.prompt(prompt(data.intro));
            });
    }

    arriveAtEarth(response) {
        console.log(response);
        console.log('\n\nYou WIN!\n\n');
        // this.api.updateLeaderboard;
        return this.api.updateStage(this.ship.stage, 'success')
            .then(() => this.api.deleteShip());
    }

    die(response) {
        console.log(response);
        console.log('\n\nGAME OVER\n\n');
        return this.api.updateStage(this.ship.stage, 'failure')
            .then(() => this.api.deleteShip());
    }

    moodCheck() {
        if(this.ship.mood < 0) this.die('You are unfit to deliver our cargo back to Earth. Flooding cockpit with neurotoxin.');
    }


}




module.exports = Game;