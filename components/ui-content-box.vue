<template>
    <div class="ui-content-box">
        <div class="ui-content-box-wrapper">
            <slot></slot>
        </div>

        <div v-if="$slots.actions" class="ui-content-box-actions">
            <slot name="actions"></slot>
        </div>
    </div>
</template>