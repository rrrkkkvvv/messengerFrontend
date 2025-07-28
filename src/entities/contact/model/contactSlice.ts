import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../../app/store/store";
import { TLastMessage } from "../../../shared/types/UserEntityTypes";
import {
  TContact,
  TContactsList,
  TGroupConversation,
} from "../../../shared/types/Contact";
import { deleteCurrentConversation } from "../../conversation/model";
import { TEditGroupInfo } from "../../conversation/api/conversationTypes";

interface IConversationsListSliceProps {
  contactsList: TContactsList | null;
  usersOnlineEmails: string[] | null;
  isLoading: boolean;
}

const initialState: IConversationsListSliceProps = {
  contactsList: null,
  usersOnlineEmails: null,
  isLoading: true,
};
const contactsListSlice = createSlice({
  name: "contactsList",
  initialState,
  reducers: {
    setContactsListsState: (
      state,
      action: PayloadAction<TContactsList | null>
    ) => {
      state.contactsList = action.payload;
    },
    setUsersOnlineEmailsState: (
      state,
      action: PayloadAction<string[] | null>
    ) => {
      state.usersOnlineEmails = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  selectors: {
    selectContactsList: (state) => state.contactsList,
    selectUsersOnlineEmails: (state) => state.usersOnlineEmails,
    selectIsLoadnigContacts: (state) => state.isLoading,
  },
});
const { setContactsListsState, setUsersOnlineEmailsState, setIsLoading } =
  contactsListSlice.actions;
export const {
  selectContactsList,
  selectUsersOnlineEmails,
  selectIsLoadnigContacts,
} = contactsListSlice.selectors;
export const selectUsersByIds = (userIds: string[] | undefined) =>
  createSelector([selectContactsList], (contacts) => {
    if (userIds) {
      const users: TContact[] = [];
      userIds.forEach((userId) => {
        const user = contacts?.find(
          (contact) => contact._id === userId && contact.type === "single"
        );
        if (user) {
          users.push(user);
        }
      });
      return users;
    } else {
      return [];
    }
  });

type TChangeLastMessageProps =
  | { status: "newLastMessage"; message: TLastMessage }
  | { status: "lastMessageSeen"; message: { conversationId: string } };

export const changeLastMessage =
  (data: TChangeLastMessageProps) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      contactsList: { contactsList },
    } = getState();
    const { message, status } = data;
    const newConversationsList = contactsList
      ? contactsList.map((contact) => {
          if (contact.type === "group") {
            if (contact._id !== message.conversationId) {
              return contact;
            }
          } else {
            if (
              contact.lastMessage?.conversationId !== message.conversationId
            ) {
              return contact;
            }
          }

          if (status === "lastMessageSeen") {
            return {
              ...contact,
              lastMessage: { ...contact.lastMessage, seenStatus: true },
            } as TContact;
          } else if (status === "newLastMessage") {
            return {
              ...contact,
              lastMessage: { ...message },
            };
          }
          return contact;
        })
      : null;

    dispatch(setContactsListsState(newConversationsList));
  };

export const resetLastMessage =
  (conversationId: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      contactsList: { contactsList },
    } = getState();
    // Remove lastMessage for users with passed conversationId
    const newConversationsList = contactsList
      ? contactsList.map((contact) => {
          if (contact.lastMessage?.conversationId !== conversationId)
            return contact;
          return {
            ...contact,
            lastMessage: { conversationId } as TLastMessage,
          };
        })
      : null;

    dispatch(setContactsListsState(newConversationsList));
  };
export const changeUserTypingStatus =
  (userId: string, conversationId: string, typingStatus: boolean) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      contactsList: { contactsList },
      currentUser: { currentUser },
    } = getState();
    if (userId === currentUser?._id) return;
    const newConversationsList = contactsList
      ? contactsList.map((contact) => {
          if (contact.type === "group") {
            if (contact._id === conversationId) {
              // WE HAVE usersTypingIds array, and we get new userTypingId with status. IF status is true and user is not in list - add, if status false remove him from list
              let usersTypingIds = contact.usersTypingIds
                ? [...contact.usersTypingIds]
                : [];

              if (typingStatus) {
                usersTypingIds.indexOf(userId) === -1;
                usersTypingIds.push(userId);
              } else {
                usersTypingIds = usersTypingIds.filter(
                  (userTypingId) => userTypingId !== userId
                );
              }

              return {
                ...contact,
                usersTypingIds,
              };
            }
          }
          if (contact.type === "single") {
            if (contact.conversationId === conversationId) {
              return {
                ...contact,
                isTyping: typingStatus,
              };
            }
          }
          return contact;
        })
      : null;

    dispatch(setContactsListsState(newConversationsList));
  };

export const createChatWithUser =
  (userId: string, conversationId: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      contactsList: { contactsList },
    } = getState();

    // Replace lastMessage to new for users with passed conversationId
    const newConversationsList = contactsList
      ? contactsList.map((contact) => {
          if (contact.type === "group" || contact._id !== userId)
            return contact;
          return {
            ...contact,
            conversationId: conversationId,
            lastMessage: {
              ...contact.lastMessage,
              conversationId,
            } as TLastMessage,
          };
        })
      : null;

    dispatch(setContactsListsState(newConversationsList));
  };

export const addGroupToContacts =
  (newGroupConvesation: TGroupConversation) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      contactsList: { contactsList },
    } = getState();
    const groupConversation = {
      ...newGroupConvesation,
      type: "group",
    } as TContact;

    dispatch(
      setContactsListsState(
        contactsList
          ? [...contactsList, groupConversation]
          : [groupConversation]
      )
    );
  };
export const setContactsList =
  (conversationsList: TContactsList | null) =>
  async (dispatch: AppDispatch) => {
    dispatch(setIsLoading(false));
    dispatch(setContactsListsState(conversationsList));
  };
export const setUsersOnlineEmails =
  (usersOnlineEmails: string[] | null) => async (dispatch: AppDispatch) => {
    dispatch(setUsersOnlineEmailsState(usersOnlineEmails));
  };
export const deleteConversation =
  (conversationId: string, isGroup: boolean) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      contactsList: { contactsList },
      currentConversation,
    } = getState();
    if (currentConversation.conversationId === conversationId) {
      dispatch(deleteCurrentConversation());
    }
    if (!contactsList) return;
    if (isGroup) {
      let newContactsList = contactsList.filter(
        (contact) => contact._id !== conversationId
      );
      dispatch(setContactsListsState(newContactsList));
    } else {
      let newContactsList = contactsList.map((contact) => {
        if (contact.lastMessage?.conversationId !== conversationId)
          return contact;

        return { ...contact, lastMessage: null };
      });

      dispatch(setContactsListsState(newContactsList));
    }
  };
export const updateGroupContact =
  (updatedInfo: TEditGroupInfo) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      contactsList: { contactsList },
    } = getState();
    if (!contactsList) return;
    const newContactsList = contactsList.map((contact) => {
      if (contact._id === updatedInfo._id && contact.type === "group") {
        return { ...contact, ...updatedInfo };
      } else {
        return contact;
      }
    });
    dispatch(setContactsListsState(newContactsList));
  };
export const deleteMemberFromGroup =
  (conversationId: string, kickedUserId: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      contactsList: { contactsList },
      currentUser: { currentUser },
    } = getState();
    if (!contactsList) return;
    if (currentUser?._id === kickedUserId) {
      const newContactsList = contactsList.filter(
        (contact) => contact._id !== conversationId && contact.type !== "group"
      );
      dispatch(setContactsListsState(newContactsList));
      return;
    }
    const newContactsList = contactsList.map((contact) => {
      if (contact._id === conversationId && contact.type === "group") {
        return {
          ...contact,
          userIds: contact.userIds.filter((userId) => userId !== kickedUserId),
        };
      } else {
        return contact;
      }
    });
    dispatch(setContactsListsState(newContactsList));
  };
export const addUsersToConversation =
  (conversationId: string, users: string[]) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      contactsList: { contactsList },
    } = getState();
    if (!contactsList) return;

    const newContactsList = contactsList.map((contact) => {
      if (contact._id === conversationId && contact.type === "group") {
        return {
          ...contact,
          userIds: [...contact.userIds, ...users],
        };
      } else {
        return contact;
      }
    });
    dispatch(setContactsListsState(newContactsList));
  };

const contactsListReducer = contactsListSlice.reducer;
export default contactsListReducer;
