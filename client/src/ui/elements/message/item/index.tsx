import {config} from "@appchat/core/config";
import {MessageDeleteButton} from "@appchat/ui/elements/message/delete-button";
import {IMessageListItemProps} from "@appchat/ui/elements/message/interfaces";
import * as moment from "moment";
import * as React from "react";
import {ListItem} from "react-md";

const MessagesListItem = ({message, user, onDelete, active}: IMessageListItemProps) => {
  
  const {text, createdAt, userId, user: author} = message;
  const {email} = author;

  return <ListItem
    primaryText={email}
    secondaryText={`${text} ( ${moment.unix(createdAt as any / 1000).format(config.client.formats.message.date)} )`}
    rightIcon={(user.id as string === userId as string) &&
      <MessageDeleteButton active={user?.id === userId} onClick={onDelete}/>
    }
  />;
};

export {MessagesListItem};
