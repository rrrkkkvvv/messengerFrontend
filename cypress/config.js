export const apiURLs = {
  baseURL: "http://localhost:3000",
  wsServer: {
    base: "http://localhost:3000",
    namespaces: {
      users: "/users",
      conversations: "/conversations",
      calls: "/calls",
    },
  },
  paths: {
    user: {
      deleteAccount: "/users/deleteAccount",
      updateProfile: "/users/updateProfile",
    },
    auth: {
      signUpPath: "/auth/signUp",
      signInPath: "/auth/signIn",
      googleAuthPath: "/auth/googleAuth",
      logoutPath: "/auth/logout",
      refreshPath: "/auth/refresh",
    },
    conversation: {
      createGroupConversation: "/conversations/createGroupConversation",
    },
  },
};
export const strValues = {
  testAccountPassword: "password",
};
