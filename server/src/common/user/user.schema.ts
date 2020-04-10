import * as jwt from 'jsonwebtoken';
import Workspace from '../workspace/workspace.model';
import { Sequelize } from 'sequelize';
import { ForbiddenError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import User from './user.model';
import { isAuthenticated, isMessageOwner } from '../../helpers/authorization';
import config from '../../../../configs/config.app';

export const userTypeDefs = `

  type User {
    id: ID!
    workspaceId: String
    workspace: Workspace
    email: String!
    password: String!
    firstName: String!
    lastName: String
  }

  input UserFilterInput {
    limit: Int
  }

  extend type Query {
    users(filter: UserFilterInput): [User]
    user(id: String!): User
    currentUser: User
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
    signInUser(email: String!, password: String!): String!
    signUpUser(email: String!, password: String!, firstName: String!, lastName: String): String!
  }

`;

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
    async currentUser(_, {}, { user }) {
      if (!user || !user.id) { return null; }
      const currentUser: any = await User.findById(user.id);
      return currentUser.toObject();
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
    async signUpUser(_, { email, password, firstName, lastName}) {
      const user: any = await User.create({email, password, firstName, lastName});
      return jwt.sign({ id: user.id }, config.token.secret);
    },
    async signInUser(_, { email, password,  }) {
      const user: any = await User.findOne({ email });
      const match: boolean = await user.comparePassword(password);
      if (match) {
        return jwt.sign({ id: user.id }, config.token.secret);
      }
      throw new ForbiddenError('Not Authorised.');
    },
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
