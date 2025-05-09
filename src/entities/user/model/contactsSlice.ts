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
}

const initialState: IConversationsListSliceProps = {
  contactsList: null,
  usersOnlineEmails: null,
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
  },
  selectors: {
    selectContactsList: (state) => state.contactsList,
    selectUsersOnlineEmails: (state) => state.usersOnlineEmails,
  },
});

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

const { setContactsListsState, setUsersOnlineEmailsState } =
  contactsListSlice.actions;

export const changeLastMessage =
  (
    conversationId: string,
    newLastMessage:
      | TLastMessage
      | { conversationId: string }
      | { seenStatus: boolean; conversationId: string }
  ) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      contactsList: { contactsList },
    } = getState();

    // IF we get only conversationId - conversation was deleted
    // OR IF we get message or new seen status - replace lastMessage to new for users with passed conversationId
    const newConversationsList = contactsList
      ? contactsList.map((user) => {
          if (user.lastMessage?.conversationId !== conversationId) return user;
          if (!("_id" in newLastMessage)) {
            return {
              ...user,
              lastMessage:
                "seenStatus" in newLastMessage
                  ? {
                      ...user.lastMessage,
                      seenStatus: newLastMessage.seenStatus,
                    }
                  : null,
            };
          }

          return {
            ...user,
            lastMessage: {
              ...newLastMessage,
            },
          };
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
              let usersTypingIds = contact.usersTypingIds
                ? [...contact.usersTypingIds]
                : [];
              if (typingStatus) {
                usersTypingIds
                  ? usersTypingIds.indexOf(userId) === -1 &&
                    usersTypingIds.push(userId)
                  : (usersTypingIds = [userId]);
              } else {
                usersTypingIds = usersTypingIds
                  ? usersTypingIds.filter(
                      (userTypingId) => userTypingId !== userId
                    )
                  : usersTypingIds;
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
          if (contact.type === "group") return contact;
          if (contact._id !== userId) return contact;
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
      lastMessage: {
        conversationId: newGroupConvesation._id,
      } as TLastMessage,
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
export const deleteMemberFromContact =
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

export const { selectContactsList, selectUsersOnlineEmails } =
  contactsListSlice.selectors;
const contactsListReducer = contactsListSlice.reducer;
export default contactsListReducer;
