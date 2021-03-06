import {ROUTES} from "@appchat/core/navigation/enums";
import {INavigationData} from "@appchat/core/navigation/interfaces";
import {INavigationPathsSecurity} from "@appchat/core/navigation/types";
import {UserInitState} from "@appchat/data/user/constants";
import {SIGN_OUT} from "@appchat/data/user/queries";

const NavigationData: INavigationData[] = [
  {
    active: false,
    auth: false,
    exact: false,
    icon: "person",
    id: "SignIn",
    label: "Sign In",
    payload: null
  },
  {
    active: false,
    auth: false,
    exact: false,
    icon: "person_add",
    id: "SignUp",
    label: "Sign Up",
    payload: null
  },
  {
    active: false,
    auth: true,
    exact: false,
    icon: "chat",
    id: "ChatRoom",
    label: "Chat Room",
    payload: null
  },
  {
    active: false,
    auth: true,
    exact: false,
    icon: "account_box",
    id: "Account",
    label: "User Info",
    payload: null
  },
  {
    active: false,
    auth: false,
    exact: true,
    icon: "home",
    id: "HomePage",
    label: "Home Page",
    payload: null
  },
  {
    auth: true,
    exact: false,
    icon: "contacts",
    id: "ONLINE_TOGGLE",
    label: "Online users",
    payload: {open: true, action: "ONLINE_OPEN"}
  },
  {
    auth: true,
    exact: false,
    icon: "settings_power",
    id: "USER_LOGOUT",
    label: "Logout",
    mutation: SIGN_OUT,
    payload: UserInitState,
  }
];

const NavigationPathsSecurity: INavigationPathsSecurity = {} as INavigationPathsSecurity;

NavigationData
  .filter((r) => typeof ROUTES[r.id as keyof typeof ROUTES] !== "undefined")
  .forEach((r) => { // @ts-ignore
    NavigationPathsSecurity[ROUTES[r.id as keyof typeof ROUTES]] = r.auth;
  });

export {NavigationData, NavigationPathsSecurity, INavigationData};
