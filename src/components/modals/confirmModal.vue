<script>
  export default {
    name: 'modal',
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
      <div class="modal"
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
  .modal-backdrop {
    z-index: 3;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.418);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: rgb(224, 223, 223);
    display: flex;
    flex-direction: column;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    color: rgb(2, 2, 2);
    justify-content: space-between;
    margin: auto;
    font-size: 20px;
  }

  .modal-footer {
    border-top: 1px solid #bbadad;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-agree {
    border: none;
    font-size: 20px;
    padding-left: 50px;
    padding-right: 50px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }
   
  .btn-disagree {
  border: none;
  font-size: 20px;
  padding-left: 50px;
  padding-right: 50px;
  cursor: pointer;
  font-weight: bold;
  color: rgb(211, 116, 116);
  background: transparent;
  }

  .modal-fade-enter,
  .modal-fade-leave-active {
      opacity: 0;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
      transition: opacity .5s ease
  }

</style>