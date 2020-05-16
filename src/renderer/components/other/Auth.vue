<template>
    <div class="auth-frame">
        <div class="auth-wrapper">
            <div class="auth-title">Авторизуйтесь, чтобы начать работу</div>
            <div class="auth-body">
                <div class="auth-block">
                    <div class="input-label">Имя пользователя</div>
                    <div class="input-label">Пароль</div>
                </div>
                <div class="auth-block">
                    <input class="user-input" v-model="username">
                    <input type="password" class="user-input" v-model="password">
                </div>
            </div>
            <div class="button-wrapper" @click="accept">
                <button class="edit-type-button">Войти</button>
            </div>
        </div>
    </div>
</template>

<script>
import validate from '../../validation/authValidation'

export default {
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        async accept() {
            let sendObj = {
                username: this.username,
                password: this.password
            }

            let { isCorrect, alertMessage } = validate(sendObj)
            if(!isCorrect) {
                alert(alertMessage)
            }

            let res = await this.$axios.post('https://localhost:3000/v1/auth/login', sendObj)
            
            if(res.data === 'not exists') {
                alert('Неверное имя пользователя или пароль')
                return
            }
            this.$store.commit('setToken', res.data)

            this.$emit('authDone')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/auth.scss';
</style>