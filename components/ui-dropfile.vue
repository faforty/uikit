<template>

    <div class="ui-dropfile" :class="{'ui-dropfile--over':dropzoneOver, 'ui-dropfile--body-over':bodyOver}">

        <div ref="dropzone" class="ui-dropfile-dropzone">
            <div
                @dragover.stop.prevent="dragOver($event, true)"
                @dragleave.stop.prevent="dragLeave"
                @drop.stop.prevent="fileSelect"
            >
                <slot name="on-drop">
                    <div class="ui-dropfile-overtext">
                        <div class="ui-dropfile-icon">
                            <i class="uikit-cloud-send"></i>
                        </div>

                        <span :class="{'mr-1': info !== false}">Перетяните изображение сюда</span>

                        <ui-popover v-if="info" placement="right">
                            <span class="ui-action ui-input__help__action uikit-info"></span>

                            <div slot="content">{{ info }}</div>
                        </ui-popover>
                    </div>
                </slot>
            </div>


            <div class="ui-dropfile-content">
                <slot>
                    <!-- <img v-for="file in files" :src="file" width="50" height="50"> -->
                    <!-- <div class="ui-dropfile-overtext" style="display:flex">Перетяните изображение сюда</div> -->
                </slot>
            </div>
        </div>

        <label v-if="buttonLabel" :for="inputId" class="ui-btn ui-btn--sm">
            {{buttonLabel}}
        </label>

        <input class="ui-dropfile-input" :id="inputId" @change="fileSelect" ref="fileInput" type="file" :multiple="multiple" />

    </div>
</template>

<script>
import uiPopover from './ui-popover.vue';

export default {
    components: {
        uiPopover
    },
    props: {
        value: {},

        // Лэйбл кнопки выбора файла
        buttonLabel: {
            type:    String,
            default: 'Выбрать файл',
        },

        info: {
            type:    [Boolean, String],
            default: false
        },

        // Множественная загрузка файлов
        multiple: {
            type:    Boolean,
            default: false
        },

        autoUpload: {
            type:    Boolean,
            default: false
        },

        // Адрес отправки файла
        url: {
            type:     String,
            // required: true,
        },
        // Имя отправляемого поля
        name: {
            type:    String,
            default: 'file',
        },

        // Deprecated: use @upload-success
        onResponse: {
            type:    Function,
            default: (response) => {}
        },
        // Deprecated: use @upload-error
        onError: {
            type:    Function,
            default: (error) => {}
        },

        // Кастомный метод загрузки файла
        customRequest: {
            type:    Function,
            default: null
        },
    },

    data: () => ({
        dropzoneOver: false,
        bodyOver:     false,

        formData: null,
        // data:         null,
    }),

    computed: {
        fieldName() {
            return this.name + (this.multiple ? '[]' : '');
        },
        inputId() {
            return 'dropfile' + this._uid;
        },
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

            if (!this.formData) {
                this.formData = new FormData();
            }

            for (var i = 0, file; file = files[i]; i++) {
                this.formData.append(this.fieldName, file, file.name);

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    this.$emit('select-file-ready', reader.result);
                }
            }

            this.$emit('select-file', this.formData);

            if (this.autoUpload) {
                this.upload();
            }

            this.$refs.fileInput.value = null;
        },

        upload() {
            if (!this.url && !this.customRequest) {
                return console.error('[uikit:ui-dropfile]: Missing required prop: "url" or "customRequest"');
            }

            if (this.customRequest) {
                this.customRequest(this.formData);
            } else {
                this.$http.post(this.url, this.formData).then(response => {

                    this.onResponse(response);
                    this.$emit('upload-success', response);

                    response.json().then(response => {
                        var value = [].concat(this.value);
                        value = this.multiple ? this.value.concat(response[this.name]) : response[this.name];
                        this.$emit('input', value);
                        this.$emit('change', value);
                    }),
                    error => {
                        this.onError(error);
                        this.$emit('upload-error', error);
                    }
                });
            }

            this.formData = null;
        }
    },

    mounted() {
        // this.data = this.value;
        document.body.addEventListener('dragover',  this.dragOver);
        document.body.addEventListener('dragleave', this.dragLeave);
    },

    beforeDestroy() {
        document.body.removeEventListener('dragover',  this.dragOver);
        document.body.removeEventListener('dragleave', this.dragLeave);
    }

}
</script>
