//
// Application Main script
// =======================
//

// define paths and their page contents

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: 'issues'
    },
    {
      path: '/issues',
      name: 'issues',
      component: { template: `
        <div class="columns">
          <div class="column is-5">
            <issue-list></issue-list>
          </div>
          <div class="column">
            <router-view></router-view>
          </div>
        </div>
      `},
      children: [
        {
          path: ':id',
          name: 'issue',
          component: { template: `
            <div>
              <issue-detail :id="$route.params.id" :key="$route.path">
              </issue-detail>
            </div>
          `}
        }
      ]
    }
  ]
})

// bootstrap

new Vue({
  el: '#app',
  router,
})
