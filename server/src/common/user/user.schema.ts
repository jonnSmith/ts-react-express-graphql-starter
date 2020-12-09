import * as jwt from 'jsonwebtoken';
import Workspace from '../workspace/workspace.model';
// tslint:disable-next-line:no-submodule-imports
import {UserInputError} from '@apollo/server/errors';
import User from './user.model';
import config from '../../../../configs/config.app';
import {CoreBus} from "../../core/bus";
import {ONLINE_USERS_TRIGGER} from "../../core/bus/actions";

// TODO: Remove password field from User data type

export const userTypeDefs = `

  type User {
    id: ID!
    workspaceId: String
    workspace: Workspace
    email: String
    password: String
    firstName: String
    lastName: String
    token: String
  }

  input UserFilterInput {
    limit: Int
  }

  extend type Query {
    users(filter: UserFilterInput): [User]
    user(id: String!): User
  }

  input UserInput {
    email: String
    password: String
    firstName: String
    lastName: String
    workspaceId: String
  }

  extend type Mutation {
    addUser(input: UserInput!): User
    editUser(id: String!, input: UserInput!): User
    deleteUser(id: String!): User
    signInUser(email: String!, password: String!): User
    signUpUser(email: String!, password: String!, firstName: String!, lastName: String): User
  }
  
  extend type Subscription {
    onlineUsers: OnlineUsersAction
  }
  
  type OnlineUsersAction {
    action: String
    list: [OnlineUser]
  }
  
  type OnlineUser {
    email: String
    typing: Boolean
  }

`;

const PubSub = CoreBus.pubsub;

export const userResolvers = {
  Query: {
    async users(_, { filter = {} }) {
      const users: any[] = await User.find({}, null, filter);
      return users.map(user => user.toObject());
    },
    async user(_, { id }) {
      const user: any = await User.findById(id);
      return user.toObject();
    },
  },
  Mutation: {
    async addUser(_, { input }) {
      const user: any = await User.create(input);
      return user.toObject();
    },
    async editUser(_, { id, input }) {
      const user: any = await User.findByIdAndUpdate(id, input);
      return user.toObject();
    },
    async deleteUser(_, { id }) {
      const user: any = await User.findByIdAndRemove(id);
      return user ? user.toObject() : null;
    },
    async signUpUser(_, data) {
      const { email, password, firstName, lastName} = data;
      let userObject;
      try {
        const user: any = await User.create({email, password, firstName, lastName});
        userObject = user.toObject();
        userObject.token = jwt.sign({id: user.id}, config.token.secret);
      } catch (e) {
        throw new UserInputError(e);
      }
      return userObject;
    },
    async signInUser(_, data) {
      const { email, password} = data;
      let userObject;
      try {
        const user: any = await User.findOne({email});
        const match: boolean = await user.comparePassword(password);
        userObject = match ? user.toObject() : null;
        userObject.token = jwt.sign({id: user.id}, config.token.secret);
      } catch (e) {
        throw new UserInputError(e);
      }
      return userObject;
    }
  },
  Subscription: {
    onlineUsers: {
      subscribe: () => PubSub.asyncIterator([ONLINE_USERS_TRIGGER]),
    }
  },
  User: {
    async workspace(user: { workspaceId: string }) {
      if (user.workspaceId) {
        const workspace: any = await Workspace.findById(user.workspaceId);
        return workspace.toObject();
      }
      return null;
    },
  },
};
