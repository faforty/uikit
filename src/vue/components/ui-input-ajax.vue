<template>
    <div>
        <div class="drop-out">
            <ui-input ref="input" :icon="stateIcon" :placeholder="placeholder" :color="color" icon-align="right" v-model="searchValue">
                <slot></slot>
            </ui-input>
            <div ref="dropResults" class="drop-out__results" :style="[{ 'max-height': maxHeight + 'px', 'overflow-y': 'scroll'}, dropResultsStyles]" v-show="opened">
                <a class="drop-out__result" v-for="(item, index) in items" @click="choiceItem(index)">
                    <div class="drop-out__result__content">
                        <div class="drop-out__result__content__title">
                            <div>{{ item.name }}<small>{{ item.description }}</small></div>
                        </div>
                    </div>
                </a>
                <div v-show="error" style="text-align: center;color: rgba(0,0,0,.4);padding: 10px">{{ error.name }}</div>
            </div>
        </div>
    </div>
</template>
<script>
    import throttle from '../until/throttle'

    export default {
        props: {
            ajaxUrl: String,
            ajaxQuery: {
                type: String,
                'default': 'name'
            },
            value: String,
            maxHeight: {
                type: Number,
                'default': 400
            },
            minHeight: {
                type: Number,
                'default': 70
            },
            adaptive: {
                type: Boolean,
                'default': true
            },
            placeholder: String,
            color: String,
            emitInput: {
                'default': 'id'
            },
            inputValue: String
        },
        data: () => ({
            opened: false,
            iconStyle: '',
            stateIcon: 'uikit-search',
            state: {
                icon: 'uikit-search'
            },
            searchValue: '',
            lock: false,
            items: [],
            dropResultsStyles: '',
            error: false,

            _maxHeight: 0
        }),
        methods: {
            choiceItem (index) {
                let item = this.items[index]

                this.lock = true
                this.opened = false
                this.searchValue = item.name

                if (this.emitInput == 'id') {
                    this.$emit('input', item.id)
                } else {
                    this.$emit('input', {
                        id: item.id,
                        name: item.name,
                    })
                }
            },
            reset () {
                this.iconStyle.style = ''

                this.stateIcon = this.state.icon
            },
            //ajax: throttle((value) => {
            //
            //}, 1500)
            ajax (value) {
                if (this.ajaxUrl) {
                    let params = {
                        [this.ajaxQuery]: value
                    }

                    this.$http
                        .get(this.ajaxUrl, { params: params })
                        .then(response => response.json().then(data => {
                            let items = data.items.data ? data.items.data : data.items

                            this.reset()

                            this.items = items

                            this.error = false

                            if (!items.length) {
                                this.error = {
                                    name: 'Не найдено',
                                    error: 'notFound'
                                }
                            }
                        }, {
                            beforeSend(xhr) {
                                if (this.lastRequest) {
                                    this.lastRequest.cancel()
                                }
                                this.lastRequest = xhr
                            },
                        }
                    )).catch(error => {
                        this.error = {
                            name: 'Ошибка соединения',
                            error: 'network'
                        }
                    })
                }
            }
        },

        watch: {
            inputValue (v) {
                console.log(v)
                this.searchValue = v
            },
            searchValue (value) {
                if (this.lock == true) {
                    this.lock = false

                    return ;
                }

                if (value) {
                    this.opened = true
                    this.state.icon = (this.state.icon != this.stateIcon) ? this.state.icon : this.stateIcon

                    this.iconStyle.style = 'padding: 10px;margin: 18px 20px !important;'
                    this.stateIcon = 'loader-spinner'

                    this.ajax(value)

                    return ;
                }

                this.opened = false
                this.reset()
            }
        },
        mounted () {
            let $input = this.$refs.input.$el,
                $dropResults = this.$refs.dropResults;

            this.iconStyle = $input.querySelector('.ico')
            this._maxHeight = this.maxHeight

            window.onscroll = () => {
                let offsetInput = $input.getBoundingClientRect().top - (window.innerHeight / 2) + ($input.clientHeight / 2)



                if (window.pageYOffset < $dropResults.getBoundingClientRect().bottom - window.pageYOffset) {

                    console.log($dropResults.getBoundingClientRect().bottom - window.pageYOffset)

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

