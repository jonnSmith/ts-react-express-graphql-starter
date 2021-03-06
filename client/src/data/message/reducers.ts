import {ACTIONS} from "@appchat/core/store/constants";
import {ICommonAction} from "@appchat/core/store/interfaces";
import {MessagesInitState} from "@appchat/data/message/constants";
import {IMessagesReducer} from "@appchat/data/message/interfaces";

const MessageReducer = (state: IMessagesReducer = MessagesInitState, action: ICommonAction): IMessagesReducer => {
  switch (action.type) {
    case ACTIONS.MESSAGES_UPDATED:
      return {...state, ...action.payload};
    // case ACTIONS.MESSAGE_ADDED:
    //   return {...state, ...action.payload};
    // case ACTIONS.MESSAGE_DELETED:
    //   return {...state, ...action.payload};
    // case ACTIONS.MESSAGE_UPDATED:
    //   return {...state, ...action.payload};
    // case ACTIONS.MESSAGE_PRELOADED:
    //   return {...state, ...action.payload};
  }
  return state;
};

export { MessageReducer };
