# uiKit

> A Vue.js super project created to inspire

![UiKit Logo](https://github.com/faforty/uikit/raw/master/uikit.jpg)

## Use it

### Npm package

#### Install

```sh
$ npm i -S uikit-agro24
```
> **Important**: don't turn off vue-loader and babel on node_modules for this package. It used for compiling package for your version of vue.

> **Important**: include in your bundle only necessary languages

```js
// webpack.config.js

module.exports = {
    ...
    plugins: [
        ...
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
        new webpack.ContextReplacementPlugin(/validatorjs[\/\\]src[\/\\]lang$/, /en|ru/),
        ...
    ]
    ...
}
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
        uiButton
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

### Options

Lang change. By default we use 'ru' lang.

```js
Vue.useLang('en');
```

We had proxy for Validatorjs on Vue object.

```js
Vue.validator.register('telephone', function(value, requirement, attribute) {
    return value.match(/^\d{3}-\d{3}-\d{4}$/);
}, 'The :attribute phone number is not in the format XXX-XXX-XXXX.');
```

Options than we could use in package version.

```js
Vue.use(uiKit, {
    lang: 'ru'
});

// or for uiKitPlugins

Vue.use(uiKitPlugins, options);
```
