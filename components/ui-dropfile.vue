<template>

    <div class="ui-dropfile" :class="{'ui-dropfile--over':dropzoneOver, 'ui-dropfile--body-over':bodyOver, 'ui-dropfile--empty':isEmpty}">

        <div ref="dropzone" class="ui-dropfile-dropzone">
            <div
                @dragover.stop.prevent="dragOver($event, true)"
                @dragleave.stop.prevent="dragLeave"
                @drop.stop.prevent="fileSelect"
            >
                <slot name="on-drop">
                    <div class="ui-dropfile-overtext">
                        <div class="ui-dropfile-icon"><i class="uikit-cloud-send"></i></div>
                        Перетяните изображение сюда
                    </div>
                </slot>
            </div>

            <slot>
                <!-- <img v-for="file in files" :src="file" width="50" height="50"> -->
                <!-- <div class="ui-dropfile-overtext" style="display:flex">Перетяните изображение сюда</div> -->
            </slot>
        </div>

        <label :for="inputId" class="ui-btn ui-btn--sm">
            {{buttonLabel}}
        </label>

        <input class="ui-dropfile-input" :id="inputId" @change="fileSelect" ref="fileInput" type="file" :multiple="multiple" />

    </div>
</template>

<script>
export default {
    props: {
        value: {},
        multiple: {
            type:    Boolean,
            default: false
        },
        url: {
            type:     String,
            // required: true,
        },
        name: {
            type:    String,
            default: 'file',
        },
        buttonLabel: {
            type:    String,
            default: 'Выбрать файл',
        },
        customRequest: {
            type:    Function,
            default: null
        },
        onResponse: {
            type:    Function,
            default: (response) => {}
        },
        onError: {
            type:    Function,
            default: (error) => {}
        },
    },

    data: () => ({
        dropzoneOver: false,
        bodyOver:     false,
        data:         null,
    }),

    watch: {
        value(value) {
            this.data = value;
        }
    },

    computed: {
        fieldName() {
            return this.name + (this.multiple ? '[]' : '');
        },
        inputId() {
            return 'dropfile' + this._uid;
        },
        isEmpty() {
            // return true;
            return Array.isArray(this.value) ? this.value.length === 0 : !this.value;
        }
    },

    methods: {
        dragOver(e, isDropzone = false) {
            if (this._leaveTimeout) {
                clearTimeout(this._leaveTimeout);
            }

            this.bodyOver = true;

            if (isDropzone) {
                this.dropzoneOver = true;
            }
        },

        dragLeave(e) {
            if (this._leaveTimeout) {
                clearTimeout(this._leaveTimeout);
            }

            this._leaveTimeout = setTimeout(() => {
                this.bodyOver = false;
            }, 50);

            this.dropzoneOver = false;
        },

        fileSelect(e) {
            this.bodyOver     = false;
            this.dropzoneOver = false;

            var files = e.target.files || e.dataTransfer.files;

            var formData = new FormData();

            for (var i = 0, file; file = files[i]; i++) {
                formData.append(this.fieldName, file, file.name);

                // var reader = new FileReader();
                // reader.readAsDataURL(file);
                // reader.onloadend = () => {
                //     this.$refs.dropzone.style.background = 'url("'+reader.result+'")'
                // }
            }

            if (!this.url && !this.customRequest) {
                console.error('[uikit:ui-dropfile]: Missing required prop: "url" or "customRequest"');
            }

            if (this.customRequest) {
                this.customRequest(formData);
            } else {
                this.$http.post(this.url, formData).then(response => {
                    this.onResponse(response);

                    response.json().then(data => {
                        if (this.multiple) {
                            if (!this.data) {
                                this.data = [];
                            }
                            this.data = this.data.concat(data[this.name]);
                        } else {
                            this.data = data[this.name];
                        }

                        this.$emit('input', this.data);
                    }),
                    error => {
                        this.onError(error);
                    }
                });
            }
        },
    },

    mounted() {
        this.data = this.value;
        document.body.addEventListener('dragover',  this.dragOver);
        document.body.addEventListener('dragleave', this.dragLeave);
    },

    beforeDestroy() {
        document.body.removeEventListener('dragover',  this.dragOver);
        document.body.removeEventListener('dragleave', this.dragLeave);
    }

}
</script>