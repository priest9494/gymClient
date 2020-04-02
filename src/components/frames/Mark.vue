<template>
    <div class="main-frame">
        <div class="user-input">
            <div class="search-container">
                <input class="search-input" type="text" placeholder="Номер абонемента" @input="getSub" v-model="subNumber">
            </div>

        </div>
        <div class="user-output-wrapper">
            <div class="user-output">
                <div>
                    <div>ФИО</div>
                    <div>Тип</div>
                    <div>Дата начала</div>
                    <div>Дата окончания</div>
                    <div>Время начала</div>
                    <div>Осталось занятий</div>
                    <div>Осталось оплатить</div>
                </div>
                <div class="nodes">
                    <div>{{ fullName }}</div>
                    <div>{{ type }}</div>
                    <div>{{ beginDate }}</div>
                    <div>{{ endDate }}</div>
                    <div>{{ beginTime }}</div>
                    <div>{{ traintngLeft }}</div>
                    <div>{{ paymentLeft }}</div>
                </div>
                <canvas class="user-photo" v-show="clientPhotoShowed"></canvas>
            </div>
        </div>
        
        <div class="user-buttons-wrapper">
            <button class = "accept-type-button" @click="showModal" :disabled="!markBtnEnable">Отметить</button>
            <button class = "cancel-type-button" @click="clearInput" :disabled="!markBtnEnable">Не отмечать</button>
        </div>
        
        <modal
            v-show="isModalVisible"
            @agreeClose="agreeCloseModal"
            @disagreeClose="disagreeCloseModal"
            v-bind:questionString="'Отметить посещение?'"
        />
    </div>
</template>

<script>
import modal from '../modals/confirmModal'

export default {
    components: {
        modal,  
    },
    data() {
        return { 
            subNumber: '',
            fullName: '',
            beginDate: '',
            endDate: '',
            type: '',
            traintngLeft: '', 
            paymentLeft: '',
            beginTime: '',
            isModalVisible: false,
            markBtnEnable: false,
            clientPhotoShowed: false
        }
    },
    methods: {
        showModal() {
            this.isModalVisible = true
        },
        agreeCloseModal() {
            this.isModalVisible = false
            this.markVisit()
            this.clearInput()
        },
        disagreeCloseModal() {
            this.isModalVisible = false
        },
        async getSub() {
            const res = await this.$axios.post('http://localhost:3000/v1/mark/getInfo', {
                sub_number: this.subNumber
            })

            if(!res.data.dbAnswer) {
                return
            }

            this.markBtnEnable = true

            this.fullName = res.data.dbAnswer.fio
            this.beginDate = this.convert(new Date(res.data.dbAnswer.begin_date))
            this.endDate = this.convert(new Date(res.data.dbAnswer.end_date))
            this.type = res.data.dbAnswer.title + ' ' + res.data.dbAnswer.training + ' занятий ' + res.data.dbAnswer.cost + ' рублей'
            this.paymentLeft = res.data.dbAnswer.left_to_pay
            this.traintngLeft = res.data.dbAnswer.training_left
            this.beginTime = res.data.dbAnswer.start_time

            let ratio = (window.innerHeight < window.innerWidth) ? 16/9 : 9/16
            const canvas = document.querySelector('canvas')

            canvas.width = (window.innerHeight < 1280) ? window.innerWidth : 1280
            canvas.height = window.innerWidth / ratio

            var ctx = canvas.getContext("2d");
            var data =  "data:image/png;base64," + res.data.photo

            var image = new Image();
            image.onload = function() {
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            };
            image.src = data
            this.clientPhotoShowed = true
        },
        async markVisit() { 
            await this.$axios.post('http://localhost:3000/v1/mark/markVisit', {
                sub_number: this.subNumber
            })
        },
        clearInput() {
            this.clientPhotoShowed = false
            this.markBtnEnable = false
            this.fullName = ''
            this.beginDate = ''
            this.endDate = ''
            this.type = ''
            this.paymentLeft = ''
            this.traintngLeft = ''
            this.subNumber = ''
            this.beginTime = ''
        },
        convert(str) {
            var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
            return [day, mnth, date.getFullYear()].join(".");
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/frameStyles/mark.scss';
</style>