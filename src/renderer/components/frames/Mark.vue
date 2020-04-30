<template>
    <div class="main-frame">
        <div class="user-input">
            <div class="search-container">
                <input class="search-input" type="text" placeholder="Номер абонемента" @input="getSub" v-model="subNumber">
            </div>
        </div>
        <div class="user-output-wrapper">
            <div class="user-output">
                <div class="static-info">
                    <div v-for="item in gridColumns" :key="item">{{ item }}</div>
                </div>
                <div class="dynamic-info">
                    <div v-for="(node, idx) in gridNodes" :key="idx" v-if="idx != 'note'">{{ gridNodes[idx] }}</div>
                    <div class="note-linebreaker">{{ gridNodes['note'] }}</div>
                </div>
                <canvas class="user-photo" v-show="clientPhotoShowed"></canvas>
            </div>
        </div>
        <div class="user-buttons-wrapper">
            <button class ="accept-type-button" @click="showModal" :disabled="!markBtnEnable">Отметить</button>
            <button class ="cancel-type-button" @click="clearInput" :disabled="!markBtnEnable">Не отмечать</button>
        </div>
        
        <confirm-modal
            v-show="isModalVisible"
            @agreeClose="agreeCloseModal"
            @disagreeClose="disagreeCloseModal"
            v-bind:questionString="'Отметить посещение?'"
        />
    </div>
</template>

<script>
import confirmModal from '../modals/confirmModal'
import trainCase from '../../util/trainingCase'
import convert from '../../util/dateConvert'

export default {
    components: {
        'confirm-modal': confirmModal,  
    },
    data() {
        return {
            gridColumns: [
                'ФИО',
                'Тип',
                'Дата начала',
                'Дата окончания',
                'Время начала',
                'Осталось занятий',
                'Осталось оплатить',
                'Примечание'
            ],
            gridNodes: {},
            subNumber: '',
            isModalVisible: false,
            markBtnEnable: false,
            clientPhotoShowed: false,
            subId: ''
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
            this.gridNodes = {}
            this.clientPhotoShowed = false
            
            const res = await this.$axios.post('http://localhost:3000/v1/mark/getInfo', {
                sub_number: this.subNumber
            })

            if(!res.data.dbAnswer) {
                return
            }
            var timeToShow = res.data.dbAnswer.start_time.split(':');
            this.markBtnEnable = true

            this.gridNodes.fullName = res.data.dbAnswer.fio
            this.gridNodes.type = res.data.dbAnswer.title + ' ' + res.data.dbAnswer.training + ' ' + trainCase(res.data.dbAnswer.training) + ' ' + res.data.dbAnswer.cost + ' рублей'
            this.gridNodes.beginDate = convert(new Date(res.data.dbAnswer.begin_date))
            this.gridNodes.endDate = convert(new Date(res.data.dbAnswer.end_date))
            this.gridNodes.beginTime = timeToShow[0] + ':' + timeToShow[1]
            this.gridNodes.trainingLeft = res.data.dbAnswer.training_left
            this.gridNodes.paymentLeft = res.data.dbAnswer.left_to_pay
            this.gridNodes.note = res.data.dbAnswer.note
            this.subId = res.data.dbAnswer.sub_id

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
                id: this.subId
            })
        },
        clearInput() {
            this.clientPhotoShowed = false
            this.markBtnEnable = false
            this.gridNodes = {}
            this.subId = ''
            this.subNumber = ''
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/frameStyles/mark.scss';
</style>