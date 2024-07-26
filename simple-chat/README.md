# Chat Minimal

This is a simple example of a chat app created using PrivMX Endpoint Web SDK. You can treat this project as a template for creating your own apps.
It is the simplest way to start creating end-to-end encrypted communication apps based on [PrivMX](https://privmx.cloud).

## Stack

This app uses:

- TypeScript for auto completion
- Tailwind CSS for styling
- React Router DOM for SPA router, loaders and form actions
- and @simplito/privmx-endpoint-web-sdk for integration with PrivMX Bridge

All app's hooks, loaders and actions logic is contained inside the `/logic` folder. Feel free to tweak it to your needs or copy it to your own app.

## Getting started

First, clone this project to your local machine and ensure that you are using node version **"v20.10" or higher.**

If you don't have it already, create account on [PrivMX Platform](https://privmx.cloud/) alongside with:

- one Solution;
- one Context inside the created Solution;
- at least two users in the created Context. **Important note**: Remember to save their Private Keys while adding to Context. Private Keys will be used as credentials for accessing the application.

1. Create `.env.local` in root of your project. You can copy `.env.example` or use snippets available in PrivMX Platform.
   Keep in mind that Vite only exports environmental variables to client if they start with `VITE_`. Modify your envs accordingly.

Here is an example `.env.local` file

```
VITE_SOLUTION_ID={Your Solution ID}
VITE_API_URL={Your API URL}
VITE_CONTEXT_ID={Your Context ID}
VITE_USERS="[user1,user1 Public key];[user2,user2 Public Key]"
```

Your `VITE_USERS` variable should be in format `"[{userID},{userPubKey}];[{userID},{userPubKey}]"` and contain all the generated users, who you want to be able to access the app.

2. Run

```sh
npm install registry="https://npm.simplito.com"
npm run dev
```

## Further Steps

This example shows how to integrate client-side only application with PrivMX Endpoint, which means it doesn't contain any backend endpoints.

In a real world example, you would want to have an additional server with a database for managing users and adding more functionalities for them. PrivMX Platform shares REST API that allows dynamic registration of users and Contexts by your server.

To learn more check our [API reference](https://api.privmx.cloud/docs/#privmx-cloud-platform-api).

> **Note**
> To analyze a more sophisticated example, including proper management for UserID/userPubKey pairs, see our other app: [Chatee](https://github.com/simplito/privmx-chatee).

## License

[MIT](./LICENSE)
