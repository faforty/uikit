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
                :info="info"
                :placeholder="placeholder"
                :state="state"
                :value="value"
                @focus="showDropdown"
                @input="inputValue"
                @change="changeValue"
                @keydown="keydown"
            >
                <slot></slot>
            </ui-input>
            <div ref="dropResults" class="drop-out__results" :style="[{ 'max-height': maxHeight + 'px', 'overflow-y': 'scroll'}, dropResultsStyles]" v-show="(results.length > 0 || error) && showList">
                <a :class="{'drop-out__result': true, 'drop-out__result--active': index === focusList}"
                    v-for="(item, index) in results"
                    @click.prevent="select(item)"
                    @mousemove="onListMousemove(index)"
                >
                    <div class="drop-out__result__content">
                        <div class="drop-out__result__content__title">
                            <div>{{ item.name }}<small>{{ item.description }}</small></div>
                        </div>
                    </div>
                </a>
                <div v-if="results.length < 1 && value != '' && error != ''" style="text-align: center;color: rgba(0,0,0,.4);padding: 10px">{{ error }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import uiInput from './ui-input.vue';

export default {
    components: {
        uiInput
    },
    props: {
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
        showList: true,
        dropResultsStyles: {},
    }),
    methods: {
        focus() {
            this.refs.input.focus();
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
    },
    mounted() {
        let $input = this.$refs.input.$el,
            $dropResults = this.$refs.dropResults;


        document.body.addEventListener('click', this.hideDropdown);


        window.onscroll = () => {
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
        }
    }
}
</script>
