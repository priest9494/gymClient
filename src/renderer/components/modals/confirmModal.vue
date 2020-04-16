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

</script>
<template>
    <transition name="modal-fade">
        <div class="modal-backdrop">
            <div
                class="modal"
                role="dialog"
                aria-labelledby="modalTitle"
                aria-describedby="modalDescription"
            >
            <header
                class="modal-header"
                id="modalTitle"
            >
                <slot name="header">
                    {{ questionString }}
                </slot>
            </header>
            <section
                class="modal-body"
                id="modalDescription"
            >
                <slot name="body">
                    <button
                        type="button"
                        class="btn-agree"
                        @click="closeWithAgree"
                        aria-label="Close modal"
                    >
                        Да
                    </button>
                    <button
                        type="button"
                        class="btn-disagree"
                        @click="closeWithoutAgree"
                        aria-label="Close modal"
                    >
                        Нет
                    </button>
                </slot>
            </section>
            </div>
        </div>
    </transition>
</template>

<style>
@import '../../styles/modalStyles/confirmModal.scss';
</style>