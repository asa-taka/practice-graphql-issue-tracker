const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const cors = require('cors')

// GraphQL Schema

const schema = buildSchema(`

  scalar Date

  type Issue {
    id: ID!
    title: String
    user: String
    activities: [Activity]
  }

  input IssueInput {
    title: String
    user: String
  }

  type Activity {
    id: ID!
    user: String
    timestamp: Date
    comment: String
  }

  input ActivityInput {
    user: String
    comment: String
  }

  type Query {
    issues: [Issue]
    issue(id: ID!): Issue
    activities(issueId: ID!): [Activity]
  }

  type Mutation {
    createIssue(input: IssueInput): Issue
    createActivity(issueId: ID!, input: ActivityInput): Activity
  }

`);

// data models

class Issue {
  constructor(id, { title, user }) {
    this.id = id
    this.title = title || ''
    this.user = user || ''
    this.activities = []
  }
}

class Activity {
  constructor(id, { user, timestamp, comment }) {
    this.id = id
    this.user = user || user
    this.timestamp = timestamp || new Date()
    this.comment = comment || ''
  }
}

// mock data

const issues = [
  { id: '1', title: 'A Stupid Trouble', user: 'lbcat', activities: [
    { id: '1', user: 'monty', timestamp: new Date(), comment: "Today you'll learn how to wrap a present in the traditional packaging style, using brown paper and string, and discover how to easily tie a knot that's secure, ..." },
    { id: '2', user: 'lbcat', timestamp: new Date(), comment: 'super hyper' },
    { id: '3', user: 'dista', timestamp: new Date(), comment: 'super hyper' },
  ]},
  { id: '2', title: 'Memory Hybernate', user: 'lbcat', activities: [
    { id: '4', user: 'monty', timestamp: new Date(), comment: 'super hyper' },
    { id: '5', user: 'dogma', timestamp: new Date(), comment: 'super hyper' },
    { id: '6', user: 'oqupis', timestamp: new Date(), comment: 'super hyper' },
  ]},
  { id: '3', title: 'Raid Crush', user: 'lbcat', activities: [
    { id: '7', user: 'monty', timestamp: new Date(), comment: 'super hyper' },
    { id: '8', user: 'monty', timestamp: new Date(), comment: 'super hyper' },
    { id: '9', user: 'monty', timestamp: new Date(), comment: 'super hyper' },
  ]},
]

// utilities

const findById = (entries, id) => entries.find(e => e.id === id)
const pushAndReturn = (entries, entry) => {
  entries.push(entry)
  return entry
}

// root controller

const rootValue = {

  // Query
  issues: () => issues,
  issue: ({ id }) => findById(issues, id),

  // Mutation
  createIssue: ({ input }) => {
    const id = Date.now().toString()
    return pushAndReturn(issues, new Issue(id, input))
  },
  createActivity: ({ issueId, input }) => {
    const issue = findById(issues, issueId)
    const actId = Date.now().toString()
    return pushAndReturn(issue.activities, new Activity(actId, input))
  },
}

// serve

const app = express()
app.use(cors())

app.use('/graphql', graphqlHTTP({ schema, rootValue, graphiql: true }))
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'))
