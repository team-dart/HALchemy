// const apiKey = process.env.WU_API_KEY;
const request = require('superagent');
// if(!apiKey) {
//     console.log('No API key present!');
//     process.exit(1);
// }

const getIntent = query => {
    console.log(query);
    return `https://api.wit.ai/message?v=20180730&q=${query}`;
};

const get = url => {
    return request.get(url)
        .set('Authorization', 'Bearer W6TK6LCHLKM32BTCJHJQTQUPWKPRBKL5')
        .then(res => {
            const intent = JSON.parse(res.text);
            return intent.entities.intent;
        });
};

module.exports = function getWit(query) {
    return get(getIntent(query))
        .then(data => data);
};