import { ApolloClient, InMemoryCache } from '@apollo/client';

const token = 'fa484627252fd46ad35fb7c19669171b109fa013';

const graphql = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default graphql;
