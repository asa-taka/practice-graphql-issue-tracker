//
// Application Components
// ======================
//

Vue.component('identicon', {
  props: ['id'],
  template: `<img :src="imageData" :alt="id" />`,
  computed: {
    imageData: function() {
      const hash = objectHash.sha1(this.id)
      const data = new Identicon(hash, { format: 'svg' }).toString()
      return `data:image/svg+xml;base64,${data}`
    }
  }
})

Vue.component('issue-list', {
  template: `
    <div class="issue=list">
      <bu-panel>
        <div slot="heading">Issues</div>
        <div class="panel-block">
          <p class="control has-icons-left">
            <input class="input is-small" type="text" placeholder="Search" v-model="filterQuery">
            <span class="icon is-small is-left">
              <i class="fa fa-search"></i>
            </span>
          </p>
        </div>
        <p class="panel-tabs">
          <a class="is-active">All</a>
          <a>Unclosed</a>
          <a>Closed</a>
          <a>Long Term</a>
        </p>
        <bu-panel-block v-for="i in filteredIssues" key="i.id">
          <router-link :to="'/issues/' + i.id">
            {{ i.title }}
          </router-link>
        </bu-panel-block>
      </bu-panel>
    </div>
  `,
  data () {
    return {
      issues: [],
      filterQuery: '',
    }
  },
  computed: {
    filteredIssues () {
      console.log(this.issues)
      return queryFilter(this.issues, this.filterQuery)
    }
  },
  mounted () {
    vueGraphqlFetch(this, { query: `{ issues { id title }}` })
  }
})

Vue.component('activity-line', {
  props: ['activities', 'issueId'],
  template: `
    <div class="activity-list">
      <activity-form user="lbcat" :issueId="issueId">
      </activity-form>
      <activity-item v-for="a in sortedActivities" key="a.id" :activity="a">
      </activity-item>
    </div>
  `,
  computed: {
    sortedActivities () {
      return this.activities.slice().reverse() // shallow copy and reverse
    }
  },

  // component-internal dependencies
  components: {

    'activity-form': {
      props: ['user', 'issueId'],
      template: `
        <bu-media v-if="activity">
          <p class="image is-64x64" slot="icon">
            <identicon :id="activity.user"></identicon>
          </p>
          <div class="field">
            <p class="control">
              <textarea class="textarea" placeholder="Add a comment..." v-model="activity.comment">
              </textarea>
            </p>
          </div>
          <nav class="level">
            <div class="level-right">
              <div class="level-item">
                <a class="button is-info" @click="submit()">Submit</a>
              </div>
            </div>
          </nav>
        </bu-media>
      `,
      data () {
        return { activity: undefined }
      },
      methods: {
        initializeForm () {
          this.activity = {
            user: this.user,
            comment: '',
          }
        },
        submit () {
          graphql({
            query: `
              mutation ($issueId: ID!, $input: ActivityInput) {
                createActivity(issueId: $issueId, input: $input) { id user comment }
              }
            `,
            variables: {
              input: this.activity,
              issueId: this.issueId,
            }
          }).then(() => this.initializeForm())
        }
      },
      mounted () {
        this.initializeForm()
      }
    },

    'activity-item': {
      props: ['activity'],
      template: `
        <bu-media>
          <p class="image is-64x64" slot="icon">
            <identicon :id="activity.user"></identicon>
          </p>
          <div class="content">
            <strong>{{ activity.user }}</strong>
            <div>{{ activity.comment }}</div>
          </div>
        </bu-media>
      `
    }
  }
})

Vue.component('issue-detail', {
  props: ['id'],
  template: `
    <div v-if="issue">
      <h3 class="title">{{ issue.title }}</h3>
      <activity-line :activities="issue.activities" :issueId="id">
      </activity-line>
    </div>
  `,
  data () {
    return { issue: undefined }
  },
  methods: {
    fetch () {
      vueGraphqlFetch(this, { query: `{ issue(id: ${this.id}) { title activities { id user comment }}}`})
    }
  },
  mounted () {
    this.fetch()
    setInterval(() => this.fetch(), 3000)
  },
  destroyed () {
    console.log('destroy')
  }
})
