<template>
    <div v-if="hasError">
        <div>
            <span class="text-red-500 text-sm">
                {{ errorMessage }}
            </span>
        </div>
    </div>
</template>
  
<script>
export default {
    props: {
        validationErrors: Object,
        name: String,
    },
    computed: {
        hasError() {
            return this.validationErrors && this.validationErrors[this.name] && this.validationErrors[this.name].length > 0;
        },
        errorMessage() {
            return this.hasError ? this.validationErrors[this.name][0] : '';
        },
    },
};
</script>  