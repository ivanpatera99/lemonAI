## LemonAI
This repo is an aproach to an integration between slack and openAI api.
I used node.js with typescript and here is a step by step on how to test this code.
#### Before jumping to the terminal
##### Slack:
You will have to have setuped an slack app with the following permissions:
- `channels:history` 
- `channels:join` 
- `chat:write` 
- `commands` 
- `groups:history`

And setup two slash commands:
- `/hello`: for test purposes
- `/history-interpreter`: the interpreter jeje

Also setup an app-level token to enable socket_mode with the following scopes:
- `connection:write`
- `authorizations:read`

Enable messages tab to allow the app to write to channels

##### OpenAI:
You will also want to have an openAI account allready setuped to spend money on some expensive computation. From openAI you'll want the organization id and an auth token.

#### ENV
setup a .env file with your enviromental variables, you'll need something like this:
```
SLACK_SIGNING_SECRET={YO_SECRET}
SLACK_BOT_TOKEN={YO_SECRET}
APP_TOKEN={YO_SECRET} //app level token
OPENAI_API_KEY={YO_SECRET}
OPENAI_ORGANIZATION={YO_SECRET}
```

#### Action:
With all this setuped you are ready to test the app, run
```
> npm install
> npm run start:dev
```
Now from slack you can invite the app and call `/history-interpreter` to get a condensed sumary of the slack channel.
You can send more information to get a narrower part of your chat, example:

```
/history-interpreter oldest=2023-06-11T00:00:00
```
This will give you all messages from 2023-06-11T00:00:00 to date.

There is a few options more to play:

- `oldest` and `latest`: this go with the same format, a date in YYYY-MM-DDThh:mm:ss, this two will delimit your messages.
- `limit`: will limit the ammount of messages you select to the number you pass, your chat summary will return a `cursor` to keep navigating.
- `next-cursor`: pass this cursor to get the summary of the next page.
- `translate-to-native`: add a sentence in the gpt prompt to translate the summary to the language in witch the conversation is being held