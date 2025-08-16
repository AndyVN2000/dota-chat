# dota-chat

## TODO list

### Commands not appearing in Discord

Registering my Discord commands by running in shell:

```shell
npm run register
```

This goes through without error. But after this, it should be possible to see my commands inside
the Discord server where the app is installed. (Writing `/roll` should be recognized as a command,
but it is not).

I think I just have to continue coding on `app.js` and hopefully, it will appear.

UPDATE: It was a case of waiting in real time for the chat bot to come online.
    It is now working, but I am not sure why I have to wait though.

### `InteractionResponseFlags` from `discord-interations` module

Read up on the documentation to fully understand the usage.
