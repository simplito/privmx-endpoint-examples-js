# Endpoint Web Example

Example usage of PrivMX Endpoint methods in js/ts.

## Getting started

Make sure that you have [PrivMX Cloud account](https://privmx.cloud/signin). To work with PrivMX Endpoint you need:

- `SolutionID` - created inside your Organization
- `Platform URL` - unique for your Instance
- at least one `ContextID`

After ensuring everything is created, copy `.env.example` in to `.env.local` and fill with necessary secrets.

Then install all dependencies

```sh
npm install
npm run dev
```

## Usage

This is example app. To see result of functions open web browser console.

## Important notes

### Loading core scripts

Right now all endpoint files must be served from `/public` directory.

You can use initialization script to setup your project. It will add necessary lib assets inside your `/public` folder and insert script tags shown below.

```sh
npx @simplito/privmx-endpoint-web-sdk
```

To use them, add the tags shown below
Make sure they are in the same order as showed below.

```html
  <!-- rest of headers  -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <script src="/wasmAssets/privmx-endpoint-web.js"></script>
    <script src="/wasmAssets/driver-web-context.js"></script>
    <script src="/wasmAssets/endpoint-wasm-module.js"></script>

    <title>Title</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- rest of app  -->

```

### Server configuration

To make this work with Vite server ( or any server ) you must also edit config of your server.

```js
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
  ],
});
```

To learn more about server configuration check out our [Java Script docs](https://docs.privmx.cloud/js/server-configuration)

## Documentation

Full documentation about this package's functions, types and example usage can be
found in our [docs](https://docs.privmx.cloud/js/server-configuration)

## Example Apps

Check out our full-fledged end-to-end encrypted app - [Chatee](https://github.com/simplito/privmx-chatee). There you can see how to:

- create a secure real-time chat using Threads;
- upload and share encrypted files using Stores;
- manage PrivMX Platform from your own Server using REST API.
