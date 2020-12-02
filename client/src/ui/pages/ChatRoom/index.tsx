import {useMutation, useQuery, useSubscription} from "@apollo/react-hooks";
import {ACTIONS} from "@appchat/core/store/constants";
import {CHAT_UPDATED, CREATE_MESSAGE, PRELOAD_MESSAGE} from "@appchat/data/message/queries";
import {ContainerPage} from "@appchat/ui/containers/page";
import {IMessageSendForm} from "@appchat/ui/templates/message/interfaces";
import {MessageList} from "@appchat/ui/templates/message/list";
import {MessageSend} from "@appchat/ui/templates/message/send";
import * as React from "react";
import {useDispatch} from "react-redux";
import {useUpdate} from "react-use";

const ChatRoom = () => {
  const update = useUpdate();
  const [sendMessage,
    {data: created, loading: sending}] = useMutation(CREATE_MESSAGE, {notifyOnNetworkStatusChange: true});
  const {data: preloaded, loading: preloading} = useQuery(PRELOAD_MESSAGE);
  const {data: updated, loading} = useSubscription(CHAT_UPDATED);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (preloaded && !preloading) {
      dispatch({type: ACTIONS.MESSAGE_ADDED, payload: {message: preloaded.message}});
      update();
    }
  }, [preloaded?.message, preloading]);

  React.useEffect(() => {
    if (updated && !loading) {
      dispatch({type: ACTIONS.MESSAGE_ADDED, payload: {message: updated.chatUpdated.message}});
      update();
    }
  }, [updated?.chatUpdated, loading]);

  // TODO: operate with data for performance saving, cleanup after
  // Last sent your message: JSON.stringify(created)
  // Stream update from websocket: JSON.stringify(updated)
  // Last message loaded on start: JSON.stringify(preloaded)

  return (<ContainerPage title="Chat room">
    <section>
      <MessageList active={!loading}/>
      <MessageSend
        onSubmit={(variables: IMessageSendForm) => {
          sendMessage({variables});
        }}
        loading={sending}/>
    </section>
  </ContainerPage>);
};

export default ChatRoom;
