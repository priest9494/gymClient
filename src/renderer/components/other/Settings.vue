<template>
    <div class="main-shadow">
        <div class="main-frame">
            <div class="close-button" @click="$emit('settingsClose')">x</div>
            <div class="option-title">Изменение ставки тренера</div>

            <div class="info-wrapper">
                <div class="static-info-rows">
                    <div>Ставка тренера</div>
                </div>
                <div class="dynamic-info-rows">
                    <input v-model="rate">
                </div>
            </div>

            <div class="option-title">Изменение пароля управляющего</div>
            <div class="info-wrapper">
                <div class="static-info-rows">
                    <div>Старый пароль</div>
                    <div>Новый пароль</div>
                    <div>Повторите пароль</div>
                </div>
                <div class="dynamic-info-rows">
                    <input v-model="oldPass" type="password">
                    <input v-model="pass" type="password">
                    <input v-model="passRepeat" type="password">
                </div>
            </div>
            <div class="button-wrapper">
                <button class="edit-type-button">Применить</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rate: '40',
            pass: '',
            passRepeat: '',
            oldPass: ''
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/settings.scss';
</style>