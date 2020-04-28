import "isomorphic-fetch"
import React from "react"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "react-apollo"
import Layout from "./src/components/layout"

const client = new ApolloClient({
  uri: "https://graphql.fauna.com/graphql",
  request: operation => {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${process.env.FAUNA_ADMIN_API_TOKEN}`,
      },
    })
  },
})

// export const wrapPageElement = ({ element, props }) => {
//   return <Layout {...props}>{element}</Layout>
// }

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
)
