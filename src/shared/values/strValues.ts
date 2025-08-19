export const apiURLs = {
  baseURL: import.meta.env.VITE_DEV
    ? "http://localhost:3000"
    : "https://messengerbackend-3qj2.onrender.com",
  wsServer: {
    base: import.meta.env.VITE_DEV
      ? "http://localhost:3000"
      : "https://messengerbackend-3qj2.onrender.com",
    namespaces: {
      users: "/users",
      conversations: "/conversations",
      calls: "/calls",
    },
  },
  paths: {
    auth: {
      signUpPath: "/auth/signUp",
      signInPath: "/auth/signIn",
      googleAuthPath: "/auth/googleAuth",
      logoutPath: "/auth/logout",
      refreshPath: "/auth/refresh",
    },
  },
};
export const localStorageItems = {
  jwtToken: "JWT",
  isLoggedIn: "isLoggedIn",
  isLoggedInText: "loggedIn",
};
export const toastTexts = {
  success: {
    successAuth: "Authenticated successfully",
    successSignup: "Signed up",
    successSignin: "Signed in",
    successEditUser: "Edited",
    successGroupCreating: "Creating new group",
    successKickUser: "User was kicked",
    successGroupCreate: "A group with you was created",
    successConversationDelete: "Chat was successfully deleted",
    successAddUsersToConversation: "Users were added successfully",
  },

  error: {
    errorGroupCreate: "Not enough data for create group",
    errorKickUser: "Cannot kick user now",
    errorConversationDelete: "Chat deleting error",
    errorEditUser: "Data must be different and valid",
    errorAuth: "Authentication error",
    errorAddUsersToConversation: "Users were not added, an error occurred",
  },
};
type websocketMessages = {} & {
  websocket: {
    conversationWS: {
      conversationCreating: "Conversation is created/already exists";
      sendedMessage: "Sended message";
      editedMessage: "Edited message";
      deletedMessage: "Deleted message";
      conversationDeleted: "Conversation was deleted";
    };
    getUsersWS: {
      updateOnlineUsersList: "users_online_list";
      successGetUsers: "Success get users";
      unathorized: "Unauthorized";
    };
  };
  [key: string]: any;
};

export const backendMessages: websocketMessages = {
  websocket: {
    conversationWS: {
      conversationCreating: "Conversation is created/already exists",
      sendedMessage: "Sended message",
      editedMessage: "Edited message",
      deletedMessage: "Deleted message",
      conversationDeleted: "Conversation was deleted",
    },
    getUsersWS: {
      updateOnlineUsersList: "users_online_list",

      successGetUsers: "Success get users",
      unathorized: "Unauthorized",
    },
  },
  auth: {
    success: {
      successSignup: "User was signed up",
      successSignin: "User was signed in",
    },
  },
  user: {
    success: {
      successEdit: "User was edited",
    },
  },
};
export const routes = {
  auth: "/auth",
  main: "/",
  conversation: "/conversation/:type/:contactId",
};
