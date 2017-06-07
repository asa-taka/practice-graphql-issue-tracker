//
// Utilities
// =========
//

const tee = res => {
  console.log(res)
  return res
}

// simple GraphQL client
const graphql = req => {
  return axios.post(appConfig.resources.graphql, req)
    .then(tee)
    .then(res => res.data.data)
    .catch(e => console.error('GraphQL Client:', e))
}

// fetch data from a GraphQL with query,
// then the response is returned,
// each fields will be assigned to Vue.component as data
const vueGraphqlFetch = (component, req) => {
  return graphql(req).then(res => {
    Object.assign(component, res)
    return res
  })
}

const testAllField = (value) => {
  const re = new RegExp(value, 'i')
  return e => {
    for (let f of Object.keys(e)) {
      if (re.test(e[f])) return true
    }
    return false
  }
}

const testField = (field, value) => {
  const re = new RegExp(value, 'i')
  return e => re.test(e[field])
}

// `id:1`
const queryFilter = (entries, queryString) => {

  // prepare test functions
  const queries = queryString.split(' ')
  const tests = queries.map(q => {
    let [q1, q2] = q.split(':')
    if (q2) {
      return testField(q1, q2)
    }
    return testAllField(q1)
  })

  return entries.filter(e => {
    for (let test of tests) {
      if (!test(e)) return false
    }
    return true
  })
}
