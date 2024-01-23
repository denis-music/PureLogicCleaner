# TimerTrigger - Python

The `TimerTrigger` makes it incredibly easy to have your functions executed on a schedule. This sample demonstrates a simple use case of calling your function every 5 minutes.

## How it works

For a `TimerTrigger` to work, you provide a schedule in the form of a [cron expression](https://en.wikipedia.org/wiki/Cron#CRON_expression)(See the link for full details). A cron expression is a string with 6 separate expressions which represent a given schedule via patterns. The pattern we use to represent every 5 minutes is `0 */5 * * * *`. This, in plain text, means: "When seconds is equal to 0, minutes is divisible by 5, for any hour, day of the month, month, day of the week, or year".

## Learn more

<TODO> Documentation

1. Install Azurite

```npm install -g azurite```

2. Run Azurite in separate terminal: 

```azurite --silent --location . --debug azurite-debug.log```

Azurite is an open-source Azure Storage emulator, primarily used for local development and testing of applications that use Azure Storage services. 

3. Run function on local env:

```func start --verbose```

NOTE: Ensure enviroment variables are set in .env file.