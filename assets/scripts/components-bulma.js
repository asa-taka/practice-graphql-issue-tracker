//
// Bulma Components
// ================
//

Vue.component('bu-media', {
  template: `
    <article class="media">
      <figure class="media-left">
        <slot name="icon"></slot>
      </figure>
      <div class="media-content">
        <slot></slot>
      </div>
      <div class="media-right">
        <button class="delete"></button>
      </div>
    </article>
  `
})

Vue.component('bu-icon', {
  props: ['name'],
  template: `
    <span class="icon is-small"><i class="fa fa-reply"></i></span>
  `
})

Vue.component('bu-panel-block', {
  props: ['icon'],
  template: `
    <a class="panel-block">
      <span class="panel-icon">
        <i class="fa fa-book"></i>
      </span>
      <slot></slot>
    </a>
  `
})

Vue.component('bu-panel', {
  template: `
    <nav class="panel">
      <p class="panel-heading">
        <slot name="heading"></slot>
      </p>
      <div class="panel-block">
        <p class="control has-icons-left">
          <input class="input is-small" type="text" placeholder="Search">
          <span class="icon is-small is-left">
            <i class="fa fa-search"></i>
          </span>
        </p>
      </div>
      <p class="panel-tabs">
        <a class="is-active">All</a>
        <a>Public</a>
        <a>Private</a>
        <a>Sources</a>
        <a>Forks</a>
      </p>
      <slot></slot>
    </nav>
  `
})
