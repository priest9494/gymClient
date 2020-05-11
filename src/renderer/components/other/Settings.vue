<template>
    <div class="main-shadow">
        <div class="main-frame">
            <div class="close-button" @click="$emit('settingsClose')">x</div>
            <div class="option-title">Изменение ставки тренера</div>

            <div class="info-wrapper">
                <div class="static-info-rows">
                    <div>Стандартная ставка тренера</div>
                </div>
                <div class="dynamic-info-rows">
                    <input v-model="rate" class="rate-input">
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
                    <input v-model="oldPass" type="password" class="password-input">
                    <input v-model="pass" type="password" class="password-input">
                    <input v-model="passRepeat" type="password" class="password-input">
                </div>
            </div>
            <div class="button-wrapper">
                <button class="edit-type-button" @click="acceptClicked">Применить</button>
            </div>
        </div>
    </div>
</template>

<script>
import logFileAccess from '../../util/logFileAccess'
import validate from '../../validation/settingsValidation'

export default {
    data() {
        return {
            rate: '',
            pass: '',
            passRepeat: '',
            oldPass: '',
            adminPass: ''
        }
    },
    methods: {
        acceptClicked() {
            let { isCorrect, alertMessage } = validate({
                rate: this.rate,
                adminPass: this.adminPass,
                oldPass: this.oldPass,
                pass: this.pass,
                passRepeat: this.passRepeat
            })
            console.log(isCorrect);
            
            if(!isCorrect) {
                alert(alertMessage)
                return
            }

            logFileAccess('write', {
                rate: this.rate,
                pass: this.pass
            })

            this.$emit('settingsClose')
        },
        readSettingsConfig() {
            let data = logFileAccess('read')
            this.adminPass = data.pass
            this.rate = data.rate
        }
    },
    created() {
        this.readSettingsConfig()
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/settings.scss';
</style>