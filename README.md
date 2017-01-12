# uiKit

> A Vue.js project

## Use it

### Npm package

#### Install

```sh
$ npm i -S uikit-agro24
```

#### In your code

```js
import uiKit from 'uikit-agro24';

Vue.use(uiKit);
```

or for reduce bundle size

```js
// index.js
import Vue from 'vue';
import uiKitPlugins from 'uikit-agro24/plugins';
import App from 'App.vue';

Vue.use(uiKitPlugins);
new Vue({
    el: '#app',
    render: h => h(App)
});
```

```js
// App.js
<template>
    <div>
        <ui-button :href="prevLink" class="ui-btn--circle ui-pagination__prev__link">
            <i class="uikit-arrow-back"></i>
        </ui-button>
    </div>
</template>

<script>
import uiButton from 'uikit-agro24/components/ui-button.vue';

export default {
    components: {
        uiBotton
    }
};
</script>
```

> Don't forget styles

### Browser globals

```html
<!-- In head. -->
<link href="//fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&subset=cyrillic" rel="stylesheet">
<link rel="stylesheet" src="/uikit/<version>/uikit.css">
<!-- In bottom of body. After vue.js include. -->
<script src="/uikit/<version>/uikit.js"></script>
```