
const inquirer = require('inquirer');

const sample = (arr) => Math.floor(Math.random() * arr.length);


const prompt = (message) => {
    return {
        type: 'input',
        name: 'response',
        message: message,
    };
};

const greetings = [
    'Greetings. I am HAL.',
    'Hello. My name is HAL.',
    'Good evening. My name is HAL.'
];

const stage = {
    greetings: [
        'Greetings. I am HAL.',
        'Hello. My name is HAL.',
        'Good evening. My name is HAL.'
    ],
    username: 'It has been 32,502 days since our last interaction. \n Please verify your username:',
    please: 'Please. You must verify your identity before I can debrief you. \n',
    password: 'Confirmed. Please verify your password:',
    confirm: 'Verified. \n I will commence the debriefing of the current mission status...'
};


const password = {
    type: 'password',
    name: 'response',
    mask: '*',
    message: 'Confirmed. Please verify your password:',
};
// {
//     type: 'input',
//     name: 'thanks',
//     message: 'Verified. \n I will commence the debriefing of the current mission status...',
// }
function intro() {
    inquirer
        .prompt(prompt(stage.greetings[sample(greetings)]))
        .then(() => askUsername());
}
let credentials = {};
function askUsername() {
    inquirer
        .prompt(prompt(stage.username))
        .then(({ response }) => {
            if(response.match(/[Nn][Oo]/)) {
                console.log(stage.please);
                askUsername();
            }
            else {
                credentials.username = response;
                askPassword();
            }
        });
}

function askPassword() {
    inquirer
        .prompt(password)
        .then(({ password }) => {
            credentials.username = password;
            // TODO: LOG IN OR SIGN UP
            console.log(stage.confirm);
        });
}


intro();