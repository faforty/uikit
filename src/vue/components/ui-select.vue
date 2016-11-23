<template id="ui-select">
    <div class="ui-select">
        <!--<select class="no-uikit" v-model="selectId" multiple>-->
        <!--<option v-for="(option, key) in options" :value="key">@{{ option }}</option>-->
        <!--</select>-->
        <div :class="{'ui-select__selected': true, 'form-control': true, 'ui-select__multi': multiple }" @click="toggleDropdown">
		<span>
                {{ selectedItems }}
			<span style="color: #808080" v-show="showPlaceholder">{{placeholder}}</span>
            </span>
            <span class="ui-select__selected__icon">
                <i :class="{'uikit-chevron-down': true, rotate: show}"></i>
            </span>
        </div>
        <div class="ui-select__options drop-out__results" style="display: block" v-show="show" @blur="toggleDropdown">
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
				selectId: []
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

				return this.selectId.length === 0;
			}
		},
		mounted: function () {
			this.selectId = this.value

			this.$el.addEventListener('click', function () {
				event.stopPropagation()
			})
			document.body.addEventListener('click', function () {
				this.show = false
			}.bind(this))
		}
    }
</script>