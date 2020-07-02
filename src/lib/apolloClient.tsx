import {useMemo} from "react";
import {InMemoryCache, ApolloClient, HttpLink, NormalizedCacheObject, IdGetterObj} from "apollo-boost";

let apolloClient: ApolloClient<NormalizedCacheObject>;

const createApolloClient = () => {
    return new ApolloClient({
        ssrMode: typeof window === "undefined",
        link: new HttpLink({
            uri: "http://localhost:5000/graphql",
            credentials: 'same-origin'
        }),
        cache: new InMemoryCache({dataIdFromObject: (object: IdGetterObj) => object.id || null})
    })
}

export const initializeApollo = (initialState: any = null) => {
    const _apolloClient = apolloClient ?? createApolloClient();

    if (initialState) {
        _apolloClient.cache.restore(initialState)
    }
    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient

    return _apolloClient
}

export const useApollo = (initialState: any) => {
    const store = useMemo(() => initializeApollo(initialState), [initialState])
    return store;
}