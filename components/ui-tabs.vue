<template>
    <div class="ui-tabs">
        <div class="ui-tabs-wrapper ui-tabs-revers-1" :class="{'ui-tabs--scroll-min': !isScrollMin, 'ui-tabs--scroll-max': !isScrollMax}">
            <ul class="ui-tabs__bar" ref="tabs" @scroll="onScroll">
                <slot></slot>
                <div ref="indicator" class="ui-tabs__indicator" :style="{ 'height': indicatorHeight + 'px', [align]: 0 }"></div>
            </ul>
        </div>
        <div class="ui-tabs__b" v-show="indicatorBorder"></div>
        <slot name="contents"></slot>
    </div>
</template>

<script>
    var Velocity = require('velocity-animate')

    export default {
        props: {
            percent: {
                type:      Number,
                'default': 100
            },
            active: {
                'default': null
            },
            indicatorHeight: {
                type: Number,
                'default': 1
            },
            indicatorBorder: {
                type: Boolean,
                'default': true
            },
            align: {
                type: String,
                'default': 'bottom'
            }
        },
        watch: {
            active (value) {
                this.scrollOnce = true;
                this.tabSelect(value);
            }
        },
        data: () => ({
            activeTab:   false,
            scrollOnce:  true,
            isScrollMin: true,
            isScrollMax: true,
            maxScroll:   0,
            indicator:   {
                left:  '0',
                right: '0'
            }
        }),
        methods: {
            onScroll (e) {
                var scrollLeft = e.target.scrollLeft;
                this.isScrollMin = scrollLeft === 0;
                this.isScrollMax = scrollLeft >= this.maxScroll - 1;
            },
            isSelected (tab) {
                return this.activeTab === tab
            },
            select (tab) {
                this.$nextTick(() => {
                    this.activeTab = tab

                    let target = tab.$el,
                        parent = target.parentElement
                    let indicator       = this.$refs.indicator,
                        indicatorLeft   = parseInt(indicator.style.left, 10) || this.indicator.left,
                        indicatorRight  = parseInt(indicator.style.right, 10) || this.indicator.right

                    this.moveIndicator(
                        indicatorLeft,  target.offsetLeft,
                        indicatorRight, parent.offsetWidth - target.offsetLeft - target.offsetWidth
                    )

                    let minWidth        = 200,
                        tabWidth        = target.offsetWidth,
                        tabsWidth       = this.$el.getElementsByClassName('ui-tabs__bar')[0].offsetWidth,
                        tabsScrollWidth = this.$el.getElementsByClassName('ui-tabs__bar')[0].scrollWidth;

                    this.maxScroll = tabsScrollWidth - tabsWidth;

                    if (this.scrollOnce) {
                        this.scrollOnce = false;
                        Velocity(tab.$el, "scroll", {
                            offset:    -(tabsWidth-tabWidth)/2, // center tab
                            container: this.$refs.tabs,
                            duration:  300,
                            easing:    'easeOutQuad',
                            axis:      'x'
                        });
                    }

                    this.$emit('change', this.activeTab)
                    this.choiceContent(tab.name || tab.index)
                })
            },
            resizeIndicator() {
                if (!this.activeTab) {
                    return;
                }

                let target = this.activeTab.$el,
                    parent = target.parentElement

                let indicator       = this.$refs.indicator,
                    indicatorLeft   = parseInt(indicator.style.left, 10) || this.indicator.left,
                    indicatorRight  = parseInt(indicator.style.right, 10) || this.indicator.right

                this.moveIndicator(
                    indicatorLeft,  target.offsetLeft,
                    indicatorRight, parent.offsetWidth - target.offsetLeft - target.offsetWidth
                )
            },
            moveIndicator (left, newLeft, right, newRight) {
                var indicator = this.$refs.indicator

                let width = this.$el.offsetWidth - newRight - newLeft,
                    pWidth = width * (100 - this.percent) / 100;

                newRight += pWidth

                let tX = left * 100 / this.$el.offsetWidth;

                // Update indicator
                if ((newLeft - left) >= 0) {

                    Velocity(indicator,
                        {right: newRight},
                        {duration: 300, queue: false, easing: 'easeOutQuad'}
                    )
                    Velocity(indicator,
                        {left: newLeft},
                        {duration: 300, queue: false, easing: 'easeOutQuad', delay: 90}
                    )
                } else {
                    Velocity(indicator,
                        {left: newLeft},
                        {duration: 300, queue: false, easing: 'easeOutQuad'}
                    )
                    Velocity(indicator,
                        {right: newRight},
                        {duration: 300, queue: false, easing: 'easeOutQuad', delay: 90}
                    )
                }
            },
            tabSelect(value) {
                this.$children.forEach(tab => {
                    if (tab.select) tab.select(this.active)
                })
            },
            choiceContent (tabId) {
                var slotContent = this.$slots.contents[0];
                if (slotContent && slotContent.elm) {
                    var contentList = slotContent.elm.children;
                    for (var i = 0; i < contentList.length; i++) {
                        var tabName = contentList[i].getAttribute('tab-name');
                        if (tabName) {
                            contentList[i].style.display = tabName == tabId ? 'block' : 'none';
                        }
                    }
                }
            }
        },
        computed: {
            tabsCount() {
                if (!this.$children) {
                    return 0;
                }
                else {
                    return this.$children.length;
                }
            }
        },
        mounted () {
            this.tabSelect(this.active);

            this._resizeEvent = event => {
                this.resizeIndicator()
            };
            window.addEventListener('resize', this._resizeEvent);
        },
        destroyed () {
            if (this._resizeEvent) {
                window.removeEventListener('resize', this._resizeEvent);
            }
        }
    }
</script>
