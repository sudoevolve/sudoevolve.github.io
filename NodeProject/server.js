const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const crypto = require('crypto');
const uuid = require('uuid');
const app = express();
const port = 3000;

// Helper functions
function genNonce(length = 8) {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let nonce = '';
    for (let i = 0; i < length; i++) {
        nonce += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return nonce;
}

function genCanonicalQueryString(params) {
    return Object.keys(params).sort().map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
}

function genSignature(appSecret, signingString) {
    let hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(signingString);
    return hmac.digest('base64');
}

function genSignHeaders(appId, appKey, method, uri, query) {
    let timestamp = Math.floor(Date.now() / 1000).toString();
    let nonce = genNonce();
    let canonicalQueryString = genCanonicalQueryString(query);
    let signedHeadersString = `x-ai-gateway-app-id:${appId}\nx-ai-gateway-timestamp:${timestamp}\nx-ai-gateway-nonce:${nonce}`;
    let signingString = `${method}\n${uri}\n${canonicalQueryString}\n${appId}\n${timestamp}\n${signedHeadersString}`;
    let signature = genSignature(appKey, signingString);
    return {
        'X-AI-GATEWAY-APP-ID': appId,
        'X-AI-GATEWAY-TIMESTAMP': timestamp,
        'X-AI-GATEWAY-NONCE': nonce,
        'X-AI-GATEWAY-SIGNED-HEADERS': 'x-ai-gateway-app-id;x-ai-gateway-timestamp;x-ai-gateway-nonce',
        'X-AI-GATEWAY-SIGNATURE': signature
    };
}

async function syncVivogpt(prompt) {
    const APP_ID = '3034578807'; // Replace with your APP ID
    const APP_KEY = 'fBPijlvBzBXzjbae'; // Replace with your APP Key
    const URI = '/vivogpt/completions';
    const DOMAIN = 'api-ai.vivo.com.cn';
    const METHOD = 'POST';

    let params = {
        'requestId': uuid.v4()
    };

    let data = {
        'prompt': prompt,
        'model': 'vivo-BlueLM-TB',
        'sessionId': uuid.v4(),
        'extra': {
            'temperature': 0.9
        }
    };
    
    let headers = genSignHeaders(APP_ID, APP_KEY, METHOD, URI, params);
    headers['Content-Type'] = 'application/json';
    
    let url = `https://${DOMAIN}${URI}`;
    try {
        let response = await axios.post(url, data, { headers: headers, params: params });
        return response.data;
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
}

// Configure Express server
app.use(bodyParser.json());

// Serve HTML files from the public directory
app.use(express.static('public'));

// Define the route for poem generation
app.post('/generate-poem', async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        const poemData = await syncVivogpt(userPrompt);
        res.json(poemData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});