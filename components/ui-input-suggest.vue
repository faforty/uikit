<template>
    <div>
        <div class="drop-out" @mousemove="">
            <ui-input
                ref="input"
                return-event
                autocomplete="off"
                :autofocus="autofocus"
                :color="color"
                :disabled="disabled"
                :hint="hint"
                :icon-align="iconAlign"
                :icon="icon"
                :loading="loading"
                :info="info"
                :placeholder="placeholder"
                :state="state"
                :value="value"
                @focus="onFocus"
                @blur="onBlur"
                @input="inputValue"
                @change="changeValue"
                @keydown="keydown"
            >
                <slot></slot>

                <div slot="dropdown" ref="dropResults" class="drop-out__results" :style="[{ 'max-height': maxHeight + 'px', 'overflow-y': 'scroll'}, dropResultsStyles]" v-show="(results.length > 0 || error) && showList">
                    <a :class="{'drop-out__result': true, 'drop-out__result--active': index === focusList}"
                        v-for="(item, index) in results"
                        @click.prevent="select(item)"
                        @mousemove="onListMousemove(index)"
                    >
                        <div class="drop-out__result__content">
                            <div class="drop-out__result__content__title">
                                <div v-html="item[itemAttribute]"><small v-html="item.description" /></div>
                            </div>
                        </div>
                    </a>
                <div v-if="results.length < 1 && value != '' && error != ''" style="text-align: center;color: rgba(0,0,0,.4);padding: 10px">{{ error }}</div>
            </div>
            </ui-input>

        </div>
    </div>
</template>

<script>
import uiInput from './ui-input.vue';

export default {
    name: 'ui-input-suggest',
    components: {
        uiInput
    },
    props: {
        itemAttribute: {
            type: String,
            default: 'name'
        },
        autofocus: {
            type: Boolean,
            default: false
        },
        color: String,
        disabled: Boolean,
        error: [String],
        results: {
            type: Array,
            default: []
        },
        value: String,
        minHeight: {
            type: Number,
            default: 70
        },
        maxHeight: {
            type: Number,
            default: 400
        },
        placeholder: String,
        loading: [Boolean, Object],
        icon: {
            type: String,
            default: ''
        },
        iconAlign: String,
        hint: String,
        info: String,
        state: String
    },
    data: () => ({
        focusList: 0,
        showList: false,
        dropResultsStyles: {},
    }),
    methods: {
        focus() {
            this.$refs.input.focus();
        },

        inputValue({ target }) {
            if (target.value != '')
                this.showList = true;

            this.$emit('input', target.value);
        },

        changeValue({ target }) {
            if (target.value != '')
                this.showList = true;

            this.$emit('change', target.value);
        },

        select(item) {
            this.showList = false;
            this.$emit('select', item);
        },

        hideDropdown() {
            if (this._lock) {
                this._lock = false;
            } else {
                this.focusList = 0;

                this.showList = false;
            }
        },

        showDropdown() {
            this.focusList = 0;

            this._lock = true;
            this.showList = true;
        },

        onFocus() {
            this.showDropdown();
            this.$emit('focus');
        },

        onBlur() {
            this.$emit('blur');
        },

        onListMousemove(index) {
            this.focusList = index;
        },

        keydown(e) {
            var { keyCode } = e;

           // Disable when list isn't showing up
           if(!this.showList) return;

           switch (keyCode) {
             case 40: //down
               this.focusList++;
               e.preventDefault();
             break;
             case 38: //up
               this.focusList--;
               e.preventDefault();
             break;
             case 13: //enter
                this.select(this.results[this.focusList]);
                e.preventDefault();
             break;
             case 27: //esc
               this.showList = false;
               e.preventDefault();
             break;
           }

           // When cursor out of range
           var listLength = this.results.length - 1;
           this.focusList = this.focusList > listLength ? 0 : this.focusList < 0 ? listLength : this.focusList;
         },

        calculateDropdown() {
            let $input = this.$refs.input.$el,
                $dropResults = this.$refs.dropResults;

            let offsetInput = $input.getBoundingClientRect().top - (window.innerHeight / 2) + ($input.clientHeight / 2)



            if (window.pageYOffset < $dropResults.getBoundingClientRect().bottom - window.pageYOffset) {
                let height = this._maxHeight - ($dropResults.getBoundingClientRect().top - this._maxHeight) + 50

                if (this.minHeight < height) {
                    //this.maxHeight = height
                }

            }

            if (offsetInput > 0) {
                this.dropResultsStyles = {
                    'box-shadow': '0 -5px 31px -3px #cdcdcd',
                    'top': 'initial',
                    'bottom': '58px'
                }
            } else {
                this.dropResultsStyles = {}
            }
         },

        loadingStart() {
            this.$refs.input.loadingState();
        },

        loadingStop() {
            this.$refs.input.loadingStop();
        }
    },
    mounted() {
        document.body.addEventListener('click', this.hideDropdown);
        document.body.addEventListener('scroll', this.calculateDropdown);
    },

    beforeDestroy() {
        document.body.removeEventListener('click', this.hideDropdown);
        document.body.removeEventListener('scroll', this.calculateDropdown);
    }
}
</script>
