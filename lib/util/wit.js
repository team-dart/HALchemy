require('dotenv').config();
const apiKey = process.env.WIT_API_KEY;
const request = require('superagent');

const getIntentUrl = query => {
    return `https://api.wit.ai/message?v=20180730&q=${query}`;
};

const get = url => {
    return request.get(url)
        .set('Authorization', 'Bearer ' + apiKey)
        .then(({ body }) => body.entities.intent);
};

module.exports = query => get(getIntentUrl(query));