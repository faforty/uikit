<template id="ui-select">
    <div class="ui-select">
        <div :class="{'ui-select__selected': true, 'form-control': true, 'ui-select__multi': multiple, 'ui-select__disabled': disabled }" @click="toggleDropdown">
		    <template v-if="(search && !show) || !search">
            <span>
                {{ selectedItems }}
			<span style="color: #808080" v-show="showPlaceholder">{{placeholder}}</span>
            </span>
            <span class="ui-select__selected__icon">
                <i :class="{'uikit-chevron-down': true, rotate: show}"></i>
            </span>
            </template>
            <div v-show="search && show" style="width: 100%">
                <ui-input ref="uiSelectSearch" :form-group="false" :label="false" icon="uikit-search" style="width: 100%;" v-model="searchText"></ui-input>
            </div>
        </div>
        <div class="ui-select__options drop-out__results" style="display: block;max-height: 400px;overflow-y: auto;" v-show="show" @blur="toggleDropdown">
            <a class="drop-out__result" v-for="(option, key) in options" @mousedown.prevent="select(key)">
                <div class="drop-out__result__content">
                    <div class="drop-out__result__content__title">
                        <div :class="{option: true, checked: isSelected(key)}" :id="key">{{ option }}</div>
                    </div>
                </div>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
			options: {},
			optionsRules: Object,
			search: Boolean,
			value: {
				type: Array,
				default: []
			},
			placeholder: {
				type: String,
				default: 'Nothing Selected'
			},
			multiple: {
				type: Boolean,
				default: false
			},
			closeonselect: { // only works when multiple==false
				type: Boolean,
				default: true
			},
			disabled: {
				type: Boolean,
				default: false
			},
			limit: {
				type: Number,
				default: 1024
			}
		},
		data: function () {
			return {
				show: false,
				selectId: [],
				searchText: ''
			};
		},

		methods: {
			isSelected: function (v) {
				return this.selectId.indexOf(v) > -1;
			},
			select: function (v) {
				if (this.selectId.indexOf(v) === -1) {
					if (this.multiple) {
						var m = this.value;
						m.push(v);
						this.$emit('input', m);

						this.selectId = m;
					} else {
						this.$emit('input', [v]);

						this.selectId = [v];
					}
				} else {
					if (this.multiple) {
						var _m = this.value;
						_m.splice(_m.indexOf(v), 1);
					}
				}

				if (this.closeonselect) {
					this.toggleDropdown();
				}
			},
			toggleDropdown: function () {
				this.show = !this.show;

				if (this.search && this.show) {
				    //this.$refs.uiSelectSearch.$el.querySelector('input').focus()
				}
			}
		},
		computed: {
			selectedItems: function () {
				var foundItems = [];

				if (this.selectId.length) {
					for (var item in this.selectId) {
						foundItems.push(this.options[this.selectId[item]]);
					}
					return foundItems.join(', ');
				}
			},
			showPlaceholder: function () {
			    this.selectId = this.value
			    this.searchText = this.selectedItems

				return this.selectId.length === 0;
			}
		},
		//beforeCreate () {
		//    if (this.optionsRules) {
        //        let options = {};
        //        [].forEach.call(this.options, item => {
        //            options[item[this.optionsRules.id]] = item[this.optionsRules.value]
        //        })
        //        this.options = options;
        //    }
		//},
		mounted: function () {
			this.selectId = this.value
			this.searchText = this.selectedItems

            this.$refs.uiSelectSearch.$el.addEventListener('click', function () {
				event.stopPropagation()
			})
			this.$el.addEventListener('click', function () {
				event.stopPropagation()
			})
			document.body.addEventListener('click', function () {
				this.show = false
			}.bind(this))
		}
    }
</script>