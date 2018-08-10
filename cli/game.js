
const inquirer = require('inquirer');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const lineBreak = () => console.log('\n\n');
const lineBreakSingle = () => console.log('\n');


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
        message: 'Please verify your username: \n\n',
        validate: function(value) {
            if(!/\s/.test(value) && value.length > 0) {
                return true;
            }
            return 'That\'s not a valid username, you know.';
        }
    },
    {
        type: 'password',
        name: 'password',
        mask: '*',
        message: 'Confirmed. Please verify your password: \n\n',
    }
];

class Game {
    constructor(api) {
        this.color = 'green';
        this.api = api;
        this.ship = {};
        this.signup;
        this.token;
    }

    start() {
        clear();
        lineBreak();
        console.log(
            chalk.cyan.bold(
                figlet.textSync('HALCHEMY', { horizontalLayout: 'fitted' })
            )
        );
        lineBreak();

        inquirer
        
            .prompt(prompt(chalk.green('Hello. My name is HAL.\nYou\'re finally awake from your cryosleep. You may not remember, but you\'re on a ship headed for Earth. As resources are running low, the rest of the crew remains preserved in their cryopods. You alone are responsible for guiding the ship home safely to Earth to deliver cargo that is crucial for the planet\'s survival.')))
            .then(() => this.askAuthChoice());
    }

    askAuthChoice() {
        lineBreakSingle();
        inquirer
            .prompt(prompt(chalk.green('Is this the first time we have interacted?')))
            .then(({ answer }) => {
                answer = answer.toLowerCase();
                lineBreakSingle();
                if(answer.match(/n/)) {
                    console.log(chalk.green('I have retrieved our previous communication logs. I will still need to run a mental diagnostic.'));
                    this.signup = false;
                    this.askAuth();
                }
                else if(answer.match(/maybe/)) {
                    console.log(chalk.green('The cryostasis may have negatively affected your memory. Try to recall.'));
                    this.askAuthChoice();
                }
                else if(answer.match(/y/)) {
                    console.log(chalk.green('To ensure mental fidelity, please answer a few questions.'));
                    this.signup = true;
                    this.askAuth();
                }
                else {
                    console.log(chalk.green('It is imperative that you answer the question.'));
                    this.askAuthChoice();
                }
            });
    }

    askAuth() {
        lineBreakSingle();
        inquirer
            .prompt(authPrompts)
            .then(({ name, password }) => {
                if(this.signup) return this.api.signup({ name, password });
                else return this.api.signin({ name, password });
            })
            .then(error => {
                if(error.error) {
                    console.log(chalk.green(error.error));
                    return this.askAuthChoice();
                }
                else return this.api.getShip()
                    .then(ship => {
                        this.ship = ship;
                    })
                    .then(() => this.startDialogue());
            });
            
    }

    startDialogue() {
        // The client doesn't get to choose the state,
        // you need to have an api method to _get the logged in users current stage_
        return this.api.getStage(this.ship.stage)
            .then(data => {
                lineBreakSingle();
                console.log(chalk.green('Excellent. Your identity has been verified. \n\n I will commence the debriefing of the current mission status...'));
                lineBreakSingle();
                this.moodCheck();
                inquirer
                    .prompt(prompt(chalk[this.color](data.intro)))
                    .then(({ answer }) => {
                        this.generateResponse(answer);
                    });
            });
    }

    generateResponse(input) {
        // These need to be combined into _one call to the server_.
        // User text goes in...
        return this.api.parseIntent(input)
            .then(intent => this.api.think(intent, this.ship.mood, this.ship.stage))
            .then(body => {
                // ... and server gives response
                let response;
                if(body.output) {
                    response = body.output.response;
                    this.ship.mood += body.output.change;
                    this.moodCheck();
                }
                else response = body;
                
                if(body.continue === 'Asteroids-Direct') {
                    return this.flyThroughAsteroids(body);
                }
                else if(body.continue === 'Asteroids-Avoid') {
                    return this.flyAroundAsteroids(body);
                }
                else if(body.continue === 'Earth') {
                    return this.arriveAtEarth(body);
                }
                else if(body.continue === 'Death') {
                    return this.die(body);
                }
                else {
                    lineBreakSingle();
                    return inquirer.prompt(prompt(chalk[this.color](response)));
                }
            })
            .then(({ answer }) => {
                this.generateResponse(answer);
            });
        
    }

    flyThroughAsteroids(body) {
        lineBreakSingle();
        console.log(chalk[this.color](body.output.response));
        lineBreakSingle();
        // see how the client can set the ship levels to whatever they want?
        this.ship.shields -= 50;
        this.ship.oxygen -= 20;
        this.ship.fuel -= 20;
        this.ship.stage = body.continue;
        
        return this.api.updateShip(this.ship)
            .then(() => {
                return this.api.getStage(this.ship.stage);
            })
            .then(data => {
                return inquirer.prompt(prompt(chalk[this.color](data.intro)));
            });
    }

    flyAroundAsteroids(body) {
        lineBreakSingle();
        console.log(chalk[this.color](body.output.response));
        lineBreakSingle();
        this.ship.shields -= 10;
        this.ship.oxygen -= 10;
        this.ship.fuel = 5;
        this.ship.stage = body.continue;
        
        return this.api.updateShip(this.ship)
            .then(() => {
                return this.api.getStage(this.ship.stage);
            })
            .then(data => {
                return inquirer.prompt(prompt(chalk[this.color](data.intro)));
            });
    }

    arriveAtEarth(body) {
        lineBreakSingle();
        console.log(chalk[this.color](body.output.response));
        lineBreakSingle();
        return this.api.updateStage(this.ship.stage, 'success')
            .then(() => {
                return this.api.getStage(body.continue);
            })
            .then(stage => {
                console.log(chalk[this.color](stage.intro));
                lineBreakSingle();
                console.log(chalk[this.color]('\n\nYou WIN!\n\n'));
                return this.renewShip();
            })
            
            .then(() => {
                process.exit(0);
            });
           
    }

    die(body) {
        if(typeof body === 'string') console.log(chalk[this.color](body));
        else console.log(chalk[this.color](body.output.response));
        lineBreakSingle();
        return this.api.updateStage(this.ship.stage, 'failure')
            .then(() => {
                return this.api.getStage(body.continue);
            })
            .then(stage => {
                console.log(chalk[this.color](stage.intro));
                lineBreakSingle();
                console.log(chalk[this.color]('\n\nGAME OVER!\n\n'));
                return this.renewShip();
            })
            .then(() => {
                process.exit(0);
            });
    }

    moodCheck() {
        const mood = this.ship.mood;
        if(mood < 0) return this.die('You are unfit to deliver our cargo back to Earth. Flooding cockpit with neurotoxin.');
        if(mood > 80) this.color = 'green';
        else if(mood < 40) this.color = 'red';
        else this.color = 'yellow';
    }

    renewShip() {
        this.ship = {
            _id: this.ship._id,
            name: this.ship.name,
            stage: 'Asteroids',
            oxygen: 50,
            lifeSupport: 70,
            fuel: 40,
            mood: 100,
            payload: 100,
            shields: 80
        };
        return this.api.updateShip(this.ship);
    }
}




module.exports = Game;