export const apiURLs = {
  googleTokenAPIUrl: "https://oauth2.googleapis.com/tokeninfo?id_token=",
  baseURL: "http://localhost/projects/messenger/servicies",
  websocketConn: "ws://localhost:8080?member_ids=",
  paths: {
    userAPI: "/user_service.php",
    chatServerAPI: "/conversation_service.php",
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
    conversationCreating: "Conversation is created/already exists";
    messagesUpdate: "Websocket message";
    conversationDeleted: "Conversation was deleted";
  };
  [key: string]: any;
};

export const backendMessages: websocketMessages = {
  websocket: {
    conversationCreating: "Conversation is created/already exists",
    messagesUpdate: "Websocket message",
    conversationDeleted: "Conversation was deleted",
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
  conversation: "/conversation",
  profile: "/profile",
};
