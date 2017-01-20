<template>
    <div class="ui-dropfile">
        <div ref="dropzone" class="ui-dropfile-dropzone" :class="{'ui--over':dropzoneOver}">
            <div class="ui-dropfile-overtext"
                @dragover.stop.prevent="dragOver"
                @dragleave.stop.prevent="dragLeave"
                @drop.stop.prevent="fileSelect"
            >
                <slot name="on-drop">Перетяните изображение сюда</slot>
            </div>

            <slot>
                <img v-for="file in files" :src="file" width="50" height="50">
            </slot>
        </div>

        <label :for="inputId" class="ui-btn ui-btn--sm">
            {{buttonLabel}}
        </label>
        <input class="ui-dropfile-input" :id="inputId" @change="fileSelect" ref="fileInput" type="file" :multiple="multiple" />
    </div>
</template>

<script>
import throttle from 'lodash.throttle';

export default {
    props: {
        value: {},
        multiple: {
            type:    Boolean,
            default: false
        },
        url: {
            type:     String,
            required: true,
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
        }
    },

    methods: {
        dragOver(e) {
            console.log('asd');
            // e.stopPropagation();
            // e.preventDefault();
            throttle(function(){
                this.dropzoneOver = true;
            }.bind(this), 10)();

            if (this._timeout) {
                clearTimeout(this._timeout);
            }
        },
        dragLeave(e) {
            if (this._timeout) {
                clearTimeout(this._timeout);
            }
            this._timeout = setTimeout(() => {
                this.dropzoneOver = false;
            }, 50);
        },
        fileSelect(e) {
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

    mounted () {
        this.data = this.value;
        // if (window.File && window.FileList && window.FileReader) {
        //     this.init();
        // }
        document.body.addEventListener('dragover', this.dragOver.bind(this));
        document.body.addEventListener('dragleave', this.dragLeave.bind(this));
    }
}
</script>

<style lang="sass">
.ui-dropfile-dropzone {
    width:      100%;
    min-height: 100px;
    position: relative;
    z-index: 1;
    // background: #F9F9F9;

    .ui-dropfile-overtext {
        display:         none;
        position:        absolute;
        top:             0;
        bottom:          0;
        right:           0;
        left:            0;
        background:      rgba(255,255,255,.7);
        border:          2px dashed rgba(0,0,0,.1);
        flex-direction:  row;
        justify-content: center;
        align-items:     center;
        color:           #999;
    }

    &.ui--over {
        .ui-dropfile-overtext {
            display: flex;
            &:hover {
                box-shadow: 0 0 50px #F00;
            }
        }
    }
}
.ui-dropfile-input {
    display:    none;
    visibility: hidden;
    position:   absolute;
    left:       -9999px;
}
</style>