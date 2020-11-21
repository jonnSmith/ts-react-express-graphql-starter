import { useQuery } from "@apollo/react-hooks";
import * as React from "react";
import { useDispatch } from "react-redux";
import { NavigationInterface } from "./components/navigation/drawer";
import { ApolloConnection } from "./gql/client";
import { GET_ME } from "./gql/queries/user";
import { NavigationPathsSecurity } from "./misc/constants/navigation";
import {ACTIONS} from "./misc/constants/store";

const App = () => {
    const { data, loading, refetch } = useQuery(GET_ME);
    const dispatch = useDispatch();

    React.useEffect( () => {
        if (data && typeof data?.user !== "undefined") {
            dispatch({type: data.user ? ACTIONS.USER_LOGIN : ACTIONS.USER_LOGOUT, payload: data});
        }
    }, [data]);

    React.useEffect(() => {
        if (
            ApolloConnection.history.action === "PUSH" &&
            NavigationPathsSecurity[ApolloConnection.history.location.pathname]
        ) {
            refetch().catch((e) => { console.debug(e.message); });
        }
    }, [ApolloConnection.history.location.pathname]);

    if (loading) { return <p>Still loading...</p>; }

    return <NavigationInterface />;
};

export { App };
