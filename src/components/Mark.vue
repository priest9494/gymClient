<template>
    <div class="mark-frame">
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
                <canvas class="user-photo"></canvas>
            </div>
        </div>
        
        <div class="user-buttons">
            <button class = "accept-button" @click="showModal" :disabled="!markBtnEnable">Отметить</button>
            <button class = "cancel-button" @click="clearInput" :disabled="!markBtnEnable">Не отмечать</button>
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
import modal from './modals/confirmModal'

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
            markBtnEnable: false
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
        },
        async markVisit() { 
            const res = await this.$axios.post('http://localhost:3000/v1/mark/markVisit', {
                sub_number: this.subNumber
            })
            console.log(res)
        },
        clearInput() {
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
@import url('https://fonts.googleapis.com/css?family=Raleway:400,700,900');
@import url('https://fonts.googleapis.com/css?family=Ubuntu+Condensed');

.mark-frame {
    background: #2f3136;
    width: 100%;
    height: calc(100vh - 74px);
    color: #f3f1f1;
    font-family: 'Ubuntu Condensed', sans-serif;

    .user-input {
        text-align: center;
        padding: 10px;
        font-size: 25px;

        input {
            height: 25px;
        }

        
        .search-container {
            margin-top: 15px;

            .search-input {
                width: 20%;
                padding: 12px 24px;

                transition: transform 250ms ease-in-out;
                font-size: 10px;
                line-height: 18px;
                
                color: #ffffff;
                background-color: transparent;
        
                background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-size: 18px 18px;
                background-position: 95% center;
                border-radius: 50px;
                border: 1px solid #575756;
                transition: all 250ms ease-in-out;
                backface-visibility: hidden;
                transform-style: preserve-3d;

                &::placeholder {
                    color: color(#575756 a(0.8));
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                }
                
                &:hover,
                &:focus {
                    outline: 0;
                    border: 1px solid transparent;
                    border-bottom: 1px solid #575756;
                    border-radius: 0;
                    background-position: 100% center;
                }
            }
        }
    }

    .user-output-wrapper {
        display: flex;
        justify-content: center;

        .user-output {
            margin-top: 25px;
            font-size: 19px;
            display: flex;
            
            canvas {
                box-shadow: 4px 4px 12px 0px black;
                max-width: 300px;
            }

            div {
                margin-bottom: 10px;
            }

            .nodes {
                margin-left: 50px;
                margin-right: 20px;
                min-width: 300px;
            }
        }
    }

    .user-buttons {
        text-align: center;
        margin-top: 10px;
        button {
            outline: none;
            font-family: 'Ubuntu Condensed', sans-serif;
            width: 200px;
            height: 35px;
            margin: 10px;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            line-height: 1;
            text-transform: uppercase;
            font-weight: 400;
            transition: all 0.1s;

            &:disabled {
                color: black;
            }

            &:hover,
            &:focus {
                font-size: 1.25rem;
            }
        }
        
        .accept-button {
            background: rgb(166, 250, 144);
            &:hover,
            &:focus {
                background: rgb(200, 248, 188);
            }
        }

        .cancel-button {
            background: rgb(248, 128, 128);
            &:hover,
            &:focus {
                background: rgb(252, 169, 169);
            }
        }  
    }
}

</style>