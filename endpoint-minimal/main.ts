import "./style.css";
import typescriptLogo from "./typescript.svg";
import { Platform, StoreClient } from "@simplito/privmx-endpoint-web-sdk";
import { env, registerUser } from "./lib";
import { ThreadClient } from "@simplito/privmx-endpoint-web-sdk";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
   
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Minimal PrivMX Endpoint</h1>
    <h1>Minimal PrivMX Endpoint</h1>
    <p class="read-the-docs">
      Open console to use endpoint methods
    </p>
   <div class="stack">
      <button id="user">Create Users</button>
      <button id="thread">Run Thread example</button>
      <button id="store">Run Store example</button>
   </div>

  </div>
`;

// There are no user accounts in PrivMX Cloud.
// To identify your app' users Platform needs only userId which is unique identifier like e-mail or username
// and public key generated from user's private key. More about this later.

const users = {
  user1: {
    pubKey: "",
    userId: "User1",
  },
  user2: {
    pubKey: "",
    userId: "User2",
  },
};

/*First lets register two example users in our Context.
Context is a data subcontainer, extended with specified access rights for your users,
managing data for Tools provided by the Platform.
It can be linked with particular features implemented in your software.
*/
async function createUsers() {
  console.log("Initializing cloud endpoint");

  /*
    In this example users's private keys are generated from their passwords, however 
    it can also be done using something like physical key or passed directly from user.
    Only requirements are that it must be known only by user and has to be in WIF format
   */
  const privKey1 = await Platform.cryptoPrivKeyNewPbkdf2(
    users.user1.userId,
    "pass"
  );
  const privKey2 = await Platform.cryptoPrivKeyNewPbkdf2(
    users.user2.userId,
    "pass"
  );

  /**
   * Now we can register them inside our Context.
   * This request should be performed on your server because it's exposing access keys
   * Here it's used only for demonstration purposes
   * Check `registerUser` function for implementation
   */
  console.info("Registering user1");
  console.info("Registering user1");
  users.user2.pubKey = await registerUser(users.user2.userId, privKey2);
  users.user2.pubKey = await registerUser(users.user2.userId, privKey2);

  console.log("Creating endpoint context");
  /**
   *Before user execute any Platform methods they have to connect to it first.
   */
  await Platform.connect({
    privKey: privKey1,
    platformUrl: env.API_URL,
    solutionId: env.SOLUTION_ID,
  });
  console.log("Endpoint context created");
}

const ctx = Platform.context(env.CONTEXT_ID);

async function runThread() {
  const usersList = [users.user1, users.user2];

  /* 
    At the core Threads are a way to exchange encrypted messages between assigned members.
    First we create Thread assigning our users to it.

    Note:
    Managers differ from regular users in that they have editing rights.
    They can for example add or remove users or change title
   */
  console.log("Creating new thread");

  const threadId = await ctx.threads.new({
    name: "Test thread",
    users: usersList,
    managers: usersList,
  });
  console.log("New thread created");

  /**
   * We can get list of our Thread inside Context
   */
  console.log("Getting list of threads");

  const threads = await ctx.threads.list();

  console.log("List of threads: ", threads.threads);

  console.log("Sending message to Thread");
  /*
   * ThreadClient is wrapper class that expose high level api for working with Thread
   */
  const thread = new ThreadClient(threadId);

  /*
    Finally we can send message. Messages inside Threads consists of three fields.
    Data is a content of Message, private Data is a metadata about message and
    Public Data is a metadata that won't be encrypted before sending, which allows your server to read it.
  */
  const msgId = await thread.sendMessage({ data: "New Message" });

  console.log("Message sent" + msgId);
  /**
   * After sending, we can download a list of all messages
   */
  const messages = await thread.getMessages();
  console.log("Thread messages", messages);
}

async function runStore() {
  const usersList = [users.user1, users.user2];

  console.info("Creating store");

  /**
   * Stores are very similar to Threads, only difference is that they hold files instead of messages
   */
  const storeId = await ctx.stores.new({
    title: "Test store",
    users: usersList,
    managers: usersList,
  });
  console.info("Store created with id " + storeId);

  const store = new StoreClient(storeId);

  let file;

  const input = document.createElement("input");
  input.type = "file";
  await new Promise((resolve) => {
    input.addEventListener("change", async (e) => {
      file = (e.target as any).files[0];
      console.info(`Sending file: "${file.name}" to store "Test store"`);
      const id = await store.uploadFile(file);
      console.log("File sent new file id: ", id);
      resolve(id);
    });

    input.click();
  });

  console.log("Getting file list from Store");
  const files = await store.getFiles();
  console.log("Files in store", files);

  console.log("Renaming store");

  /*
   * We can change name or add/remove user from Store using `storeUpdate`
   * It will override all fields using those passed to the storeUpdate
   */
  await store.storeUpdate({
    storeId: storeId,
    users: usersList,
    managers: usersList,
    name: "New name for store",
    version: 1,
    force: false,
  });

  console.log("Getting info about store");
  const storeInfo = await store.getInfo();
  console.log("Store info", storeInfo);
}

function main() {
  const storeButton = document.querySelector("button#store");
  const threadButton = document.querySelector("button#thread");
  const mainButton = document.querySelector("button#user");

  storeButton?.addEventListener("click", runStore);
  threadButton?.addEventListener("click", runThread);
  mainButton?.addEventListener("click", createUsers);
}

main();
