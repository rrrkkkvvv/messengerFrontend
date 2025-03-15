export const apiURLs = {
  baseURL: "http://localhost:3000",
  wsServer: {
    base: "ws://localhost:3000",
    namespaces: {
      users: "/users",
      conversations: "/conversations",
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
    successConversationDelete: "Chat was successfully deleted",
  },
  error: {
    errorConversationDelete: "Chat deleting error",
    errorEditUser: "Data must be different and valid",
    errorAuth: "Authentication error",
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
  conversationWithUserId: "/conversation/:anotherUserIdParam",
  conversationBase: "/conversation",
  profile: "/profile",
};
