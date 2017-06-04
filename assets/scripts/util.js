//
// Utilities
// =========
//

// simple GraphQL client
const graphql = req => {
  return axios.post(appConfig.resources.graphql, req)
    .then(res => res.data.data)
    .catch(e => console.error('GraphQL Client:', e))
}
