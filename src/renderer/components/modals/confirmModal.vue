<template>
    <div class="confirm-shadow">
        <div class="confirm-main">
            <div class="confrim-title">
                <div>
                    {{ questionString }}
                </div>
            </div>
            <div class="confirm-body">
                <div class="accept"  @click="closeWithAgree">Да</div>
                <div class="cancel" @click="closeWithoutAgree">Нет</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
    props: {
        questionString: String
    },
    methods: {
        closeWithoutAgree() {
          this.$emit('disagreeClose')

        },
        closeWithAgree() {
          this.$emit('agreeClose')
        },
    },
};
/* @click="closeWithAgree"
@click="closeWithoutAgree" */
</script>

<style lang="scss" scoped>
@import '../../styles/modalStyles/confirmModal.scss';
</style>

