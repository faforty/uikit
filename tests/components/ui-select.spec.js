import Vue from 'vue';
import VueTestUtils from 'vue-test-utils';
import uiSelect from 'components/ui-select';

Vue.use(VueTestUtils);

const DATA = {
    optionsObject: {
        '1': 'Option 1',
        '2': 'Option 2',
        '3': 'Option 3',
        '4': 'Option 4',
        '5': 'Option 5',
        '6': 'Last option',
    },
    optionsArray: [
        {id: 5, name: 'Option 5'},
        {id: 4, name: 'Option 4'},
        {id: 3, name: 'Option 3'},
        {id: 2, name: 'Option 2'},
        {id: 1, name: 'Option 1'},
    ]
}

const SELECTOR = {
    label:         '.ui-label',
    hint:          '.ui-hint',
    selectedLabel: '.ui-select__selected > span:first-child',
    dropdown:      '.ui-select__options',
    options:       '.drop-out__result',
};

const makeVm = (template, opt = {}) => {
    return new Vue({
        template,
        components: {uiSelect},
        ...opt
    }).$mount();
}


describe('ui-select', () => {

    it('Label, hint, placeholder', () => {
        const vm = makeVm('<ui-select hint="Hint text" placeholder="Empty value">Label text</ui-select>');

        expect(vm.$(SELECTOR.label).textContent).toBe('Label text');
        expect(vm.$(SELECTOR.hint).textContent).toBe('Hint text');
        expect(vm.$(SELECTOR.selectedLabel).textContent).toBe('Empty value');
    });


    it('Selected value', () => {
        const vm = makeVm('<ui-select v-model="value" :options="options"></ui-select>', {
            data:{
                options: DATA.optionsObject,
                value:   '3'
            }
        });

        expect(vm.$(SELECTOR.selectedLabel).textContent).toBe('Option 3');
    });


    it('Multiple value', () => {
        const vm = makeVm('<ui-select multiple v-model="value" :options="options"></ui-select>', {
            data:{
                options: DATA.optionsObject,
                value:   ['1', '2', '4']
            }
        });

        expect(vm.$(SELECTOR.selectedLabel).textContent).toBe('Option 1, Option 2, Option 4');
    });


    it('Autoselect', () => {
        const vm = makeVm('<ui-select autoselect v-model="value" :options="options"></ui-select>', {
            data:{
                options: DATA.optionsObject,
                value:   null,
            }
        });

        Vue.nextTick(() => {
            expect(vm.$(SELECTOR.selectedLabel).textContent).toBe('Option 1');
        });
    });


    it('Autoselect: value alredy set', () => {
        const vm = makeVm('<ui-select autoselect v-model="value" :options="options"></ui-select>', {
            data:{
                options: DATA.optionsObject,
                value:   3,
            }
        });

        Vue.nextTick(() => {
            expect(vm.$(SELECTOR.selectedLabel).textContent).toBe('Option 3');
        });
    });

    it('Dropdown', () => {
        const vm = makeVm('<ui-select v-model="value" :options="options"></ui-select>', {
            data:{
                options: DATA.optionsArray,
                value:   null,
            }
        });

        vm.$fire(SELECTOR.selectedLabel, 'click');
        Vue.nextTick(() => {
            expect(vm.$(SELECTOR.dropdown).style.display).toBe('block');
            expect(vm.$$(SELECTOR.options)).toHaveLength(DATA.optionsArray.length);

            vm.$fire(SELECTOR.selectedLabel, 'click');
            Vue.nextTick(() => {
                expect(vm.$(SELECTOR.dropdown).style.display).toBe('none');
            });
        });
    });

    it('Value as array', () => {
        const vm = makeVm('<ui-select autoselect v-model="value" :options="options"></ui-select>', {
            data:{
                options: DATA.optionsObject,
                value:   [],
            }
        });

        expect(vm.value).toEqual(['1']);
    });

    it('Value as string', () => {
        const vm = makeVm('<ui-select autoselect v-model="value" :options="options"></ui-select>', {
            data:{
                options: DATA.optionsObject,
                value:   null,
            }
        });

        expect(vm.value).toBe('1');
    });

    it('Value as number', () => {
        const vm = makeVm('<ui-select autoselect v-model.number="value" :options="options"></ui-select>', {
            data:{
                options: DATA.optionsObject,
                value:   null,
            }
        });

        expect(vm.value).toBe(1);
    });

});