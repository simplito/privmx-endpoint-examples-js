import {
  EndpointApiInterface,
  Platform,
} from "@simplito/privmx-endpoint-web-sdk";

export const env = {
  /**
   * Solution groups related instances and contexts inside organizations
   */
  SOLUTION_ID: import.meta.env.VITE_SOLUTION_ID,

  /**
   * Id of context located inside solution
   */
  CONTEXT_ID: import.meta.env.VITE_CONTEXT_ID,

  /**
   * Api url is a link to backend server or Bridge that manages
   * all logic for Threads, Stores ,Inboxes and User authentication
   */
  API_URL: import.meta.env.VITE_API_URL,

  /**
   * Access pub key gives access to managing your solution contexts and should not be send to client application.
   * It can be used to for example register user's public key or for creating new context
   */
  ACCESS_PUBKEY: import.meta.env.VITE_ACCESS_KEY,

  /**
   * Secret generated on Privmx Cloud
   */
  ACCESS_SECRET: import.meta.env.VITE_ACCESS_SECRET,
};

/**
 * Cloud is an admin panel used for managing contexts, solutions and users inside of them
 * This can be used for programmatically creating/deleting contexts for your application needs
 */
const CLOUD_URL = "https://api.privmx.cloud/main";


/**
 * Registers new user id / priv key pair in PrivMXCloud
 *
 * @param userId must be unique inside context
 * @param privkey valid key in WIF format
 * can be generated using one of endpoint helper functions or passed directly by user
 *
 * @see {@link EndpointApiInterface.cryptoPrivKeyNewPbkdf2} - for creating WIF keys from plain text
 * @see {@link EndpointApiInterface.cryptoPrivKeyNew} - for creating random WIF keys
 * @see {@link EndpointApiInterface.cryptoKeyConvertPEMToWIF} - for converting PEM (used in for example ssh) keys to WIF
 *
 */
export async function registerUser(userId: string, privkey: string) {
  const userPubKey = await Platform.cryptoPubKeyNew(privkey);

  const timestamp = Date.now();
  const nonce = crypto.randomUUID().slice(0, 13);

  const params = {
    contextId: env.CONTEXT_ID,
    user: {
      userId,
      pubKey: userPubKey,
    },
  };

  const body = {
    jsonrpc: "2.0",
    id: 0,
    method: "context/addUserToContext",
    params,
  };

  const signatureToSign = `${env.ACCESS_PUBKEY};1;${timestamp};${nonce};${
    env.ACCESS_SECRET
  };${JSON.stringify(body)}`;

  const encoder = new TextEncoder();
  const encodedSignature = encoder.encode(signatureToSign);
  const signatureDigest = new Uint8Array(
    (await crypto.subtle.digest("SHA-256", encodedSignature)).slice(0, 20)
  );

  let binary = "";
  var len = signatureDigest.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(signatureDigest[i]);
  }
  const signatureBase64 = window.btoa(binary);

  console.log(signatureBase64);

  /**
   * This request should be performed on your server because it's exposing access keys
   * Here it's used only for demonstration purposes
   */
  await fetch(CLOUD_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Access-Sig": `${env.ACCESS_PUBKEY};1;${timestamp};${nonce};${signatureBase64}`,
    },
    body: JSON.stringify(body),
  });

  return userPubKey;
}


export const readFile = (file: File): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const arrayBuffer = event.target?.result;
      if (arrayBuffer) {
        resolve(new Uint8Array(arrayBuffer as ArrayBuffer));
      } else {
        reject(new Error("Failed to read file."));
      }
    };

    fileReader.onerror = () => {
      reject(new Error("File could not be read."));
    };

    fileReader.readAsArrayBuffer(file);
  });
};
