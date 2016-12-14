<template>
    <ul :class="[ 'ui-pagination', 'b-platform-pagination', 'ui-pagination--between' ]">
        <li :class="[ 'ui-pagination__prev', { 'ui-pagination--hide': !prevLink }]">
            <ui-button :href="prevLink" class="ui-btn--circle ui-pagination__prev__link">
                <i class="uikit-arrow-back"></i>
            </ui-button>
            <span class="b-platform-pagination__name">{{ prevName }}</span>
        </li>
        <li class="ui-pagination__step">
            Шаг {{ step }} из {{ stepAll }}
        </li>
        <li class="ui-pagination__next">
            <span class="b-platform-pagination__name">{{ nextName }}</span>
            <ui-button :href="nextLink" :class="['ui-btn--circle', 'ui-pagination__next__link', { 'ui-btn--green': nextLink, 'ui-btn--gray': !nextLink } ]">
                <i class="uikit-arrow-forward"></i>
            </ui-button>
        </li>
    </ul>
</template>
<script>
    export default {
        props: ['prevLink', 'prevName', 'nextLink', 'nextName', 'step', 'stepAll']
    }
</script>
