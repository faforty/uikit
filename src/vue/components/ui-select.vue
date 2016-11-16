<template>
    <div class="ui-select form-group">

        <select class="no-uikit" :name="name"   multiple style="display: none">
            <option v-for="(option, key) in options" :value="key">{{ option }}</option>
        </select>

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
			label: String,
			name: String,
			options: {},
			value: {
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

				var value =  this.value;

				if (this.multiple)
					if (typeof value == "string")
						value =  value.split(',');

				if (this.selectId.indexOf(v) === -1) {
					if (this.multiple) {
						var m = value;
						m.push(v);
						this.$emit('input', m);

						this.selectId = m;
					} else {

						this.$emit('input', v);

						this.selectId = [v];
					}
				} else {
					if (this.multiple) {

						var _m = value;
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

				if (!this.multiple) {
					var value = this.value;

					if (typeof value != "array")
						value = [this.value];

					this.selectId = value;
				}

				console.log(this.selectId)

				if (this.selectId.length) {
					for (var item in this.selectId) {
						foundItems.push(this.options[this.selectId[item]]);
					}
					return foundItems.join(', ');
				}
			},
			showPlaceholder: function () {
				return this.selectId.length === 0;
			}
		},
		mounted: function () {

			var value =  this.value;

			if (typeof value == "string")
				value =  value.split(',');

			this.selectId = value

			this.$el.addEventListener('click', function () {
				event.stopPropagation()
			})
			document.body.addEventListener('click', function () {
				this.show = false
			}.bind(this))
		}
    }
</script>
