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
        <bu-panel-block v-for="i in issues" key="i.id">
          <router-link :to="'/issues/' + i.id">
            {{ i.title }}
          </router-link>
        </bu-panel-block>
      </bu-panel>
    </div>
  `,
  data () {
    return { issues: [] }
  },
  mounted () {
    graphql({ query: `{ issues { id title }}` }).then(res => this.issues = res.issues)
  }
})

Vue.component('activity-line', {
  props: ['activities', 'issueId'],
  template: `
    <div class="activity-list">
      <activity-form user="lbcat" :issueId="issueId"></activity-form>
      <activity-item v-for="a in activities" key="a.id" :activity="a">
      </activity-item>
    </div>
  `,

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
            <div class="level-left">
              <div class="level-item">
                <a class="button is-info" @click="submit()">Submit</a>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <label class="checkbox">
                  <input type="checkbox"> Press enter to submit
                </label>
              </div>
            </div>
          </nav>
        </bu-media>
      `,
      data () {
        return { activity: undefined }
      },
      methods: {
        activityFactory () {
          return {
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
          })
        }
      },
      mounted () {
        console.log(this.activityFactory())
        this.activity = this.activityFactory()
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
      graphql({ query: `{ issue(id: ${this.id}) { title activities { id user comment }}}`})
      .then(res => this.issue = res.issue)
    }
  },
  mounted () {
    this.fetch()
  },
})
