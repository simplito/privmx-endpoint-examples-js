export default {
  CONTEXT_ID: import.meta.env.VITE_CONTEXT_ID,
  SOLUTION_ID: import.meta.env.VITE_SOLUTION_ID,
  API_URL: import.meta.env.VITE_API_URL,
  USERS: (import.meta.env.VITE_USERS as string).split(";").map((userPair) => {
    const [userId, pubKey] = userPair.slice(1, -1).split(",");
    return { userId, pubKey };
  }),
  // IN DEV MODE
  PRIVATE_KEY: import.meta.env.VITE_PRIVATE_KEY,
};
