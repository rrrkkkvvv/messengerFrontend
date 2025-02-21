export const apiURLs = {
  googleTokenAPIUrl: "https://oauth2.googleapis.com/tokeninfo?id_token=",
  baseURL: "http://localhost/projects/messenger/servicies",
  conversationWebsocketConn: "ws://localhost:8080",
  getUsersWebsocketConn: "ws://localhost:8081",
  paths: {
    authAPI: "/auth_service.php",
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
      updateOnlineUsersList: "Update online users list";
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
      updateOnlineUsersList: "Update online users list",

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
