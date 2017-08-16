'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const token = "EAATy8uH6k5IBAAe6f4HZCLVhgNB9SP68l4DOuVvzHqWUqQok8HqihVZBxA4mmPZBPP9bqgjQgpZCwMcgZBUkDlg0IvjhGlUFYLQjzefIZA5RpUzMfCWKWP2sOMW4bntwZAXDytOZCjz8SAKhVi5zCrFDgTa8hIuSII0eIxmxVxjWrAZDZD ";

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    console.log("inside get");
	if (req.query['hub.verify_token'] === token) {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// Now the fun begins//

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'hi') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "You said : " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
    })

// function to echo back messages - added by Stefan

function sendTextMessage(sender, text) {
    messageData = {
        text:text
        }
    request({
        url: 'https://graph.facebook.com/v2.6/me/...',
        qs: {access_token:token},
        method: 'POST',
        json: {
        recipient: {id:sender},
        message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


// Send an test message back as two cards.

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
        "type": "template",
        "payload": {
        "template_type": "generic",
        "elements": [
            {
                "title": "Ai Chat Bot for Business",
                "subtitle": "How to use chat bots for business",
                "image_url": "https://image.slidesharecdn.com/kooki-aiassistantchatbottrendsforenterpriseaug2016-160801100203/95/ai-agent-and-chatbot-trends-for-enterprises-35-638.jpg?cb=1478238528",
                "buttons": [
                    {
                        "type": "web_url",
                        "url": "https://www.forbes.com/sites/mnewlands/2017/06/29/how-enterprise-chatbot-platforms-and-ai-are-fundamentally-changing-the-way-we-do-business/#5b23fab37a28",
                        "title": "Chatbots+AI in business"
                    }, 
                    {
                        "type": "web_url",
                        "url": "https://www.ducttapemarketing.com/chatbots-for-business/",
                        "title": "Chatbots are taking over"
                    },
                    {
                        "type": "web_url",
                        "url": "http://www.businessnewsdaily.com/9821-smb-artificial-intelligence-chatbots.html",
                        "title": "Chatbots for small business's"
                    }
                ]
            }, 
            {
                "title": "Chatbots Know-how",
                "subtitle": "Aking the real questions?",
                "image_url": "http://observer.com/2017/04/11-amazing-facts-chatbots-messaging-virtual-assistants-bots-artificial-intelligence/",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "What's the benefit?",
                        "payload": "Chatbots make it seem like you are talking to a person",
                    },
                    {
                        "type": "postback",
                        "title": "What can Chatbots do",
                        "payload": "They can answer users questions quickly, with no wait time. ",
                    }, 
                    {
                        "type": "postback",
                        "title": "The Future",
                        "payload": "Chatbots take over the world...AAAH",
                    }]
            }]
        }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, 
            function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}