<template>
    <div class="extend-frame">
        <div class="close" @click="$emit('extendClose')">x</div>
        <div class="lines-wrapper">
            <div class="labels-wrapper">
                <div>Дата начала</div>
                <div>Дата окончания</div>
            </div>
            <div class="user-input-wrapper">
                <input type="text" v-model="begDate">
                <input type="text" v-model="endDate">
            </div>
        </div>
        <div class="button-wrapper">
            <button class=".accept-type-button">
                Применить
            </button>
        </div>
        
    </div>
</template>

<script>
export default {
    props: {
        begDate: String,
        endDate: String
    },

}
</script>

<style lang="scss" scoped>
@import '../../styles/modalStyles/extendSubModal.scss';
</style>