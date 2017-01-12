<template>
    <div>
        <slot></slot>
    </div>
</template>
<script>
    export default {
        props: ['input'],
        data () {
            return {
                data: []
            }
        },
        methods: {
            removeItem (id) {
                let index = this.data.indexOf(id)

                if (index > -1) {
                    if (index === 0) {
                        this.data.splice(0, 1)
                    } else {
                        this.data.splice(index, index)
                    }
                }

                this.$emit('input', this.data)
            },
        },
        mounted () {
            this.$children.forEach(item => this.data.push(item.id))

            if (!this.input) {
                this.$emit('input', this.data)
            }
        }
    }
</script>
