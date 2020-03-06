<template>
    <div class="markFrame">
        <span>Номер абонемента: </span>
        <input type="text" v-model="subNumber">
        <button @click="getSub">Найти</button>
        <hr>
        <br>
        <span>ФИО: </span> 
        <span>{{ fullName }}</span>
        <br>
        <span>Тип: </span>
        <span>{{ type }}</span>
        <br>
        <span>Дата начала: </span> 
        <span>{{ beginDate }}</span>
        <br>
        <span>Дата окончания: </span> 
        <span>{{ endDate }}</span>
        <br>
        <span>Осталось занятий: </span> 
        <span>{{ traintngLeft }}</span>
        <br>
        <span>Осталось оплатить: </span> 
        <span>{{ paymentLeft }}</span>
        <br>
        <button @click="markVisit">Отметить</button>
        <button @click="cancelMark">Не отмечать</button>
    </div>
</template>

<script>
export default {
    data() {
        return { 
            subNumber: '',
            fullName: '',
            beginDate: '',
            endDate: '',
            type: '',
            traintngLeft: '', 
            paymentLeft: ''
        }
    },
    methods: {
        async getSub() {
            const res = await this.$axios.post('http://localhost:3000/v1/register/getInfo', {
                sub_number: this.subNumber
            });

            // Заменить на нормальную проверку
            if(res.data.fio === undefined) {
                return;
            }

            this.fullName = res.data.fio;
            this.beginDate = this.convert(new Date(res.data.begin_date));
            this.endDate = this.convert(new Date(res.data.end_date));
            this.type = res.data.title + ' ' + res.data.training + ' занятий ' + res.data.cost + ' рублей';
            this.paymentLeft = res.data.left_to_pay;
            this.traintngLeft = res.data.training_left;

            console.log(res.data);
        },
        async markVisit() { // Добавить диалоговое окно с подтверждением
            const res = await this.$axios.post('http://localhost:3000/v1/register/markVisit', {
                sub_number: this.subNumber
            });

            console.log(res);
        },
        cancelMark() {
            this.fullName = '';
            this.beginDate = '';
            this.endDate = '';
            this.type = '';
            this.paymentLeft = '';
            this.traintngLeft = '';
            this.subNumber = '';
        },
        convert(str) {
            var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
            return [date.getFullYear(), mnth, day].join("-");
        }
    }
}
</script>

<style scoped>
.markFrame {
    background: #e0c3e0;
    width: 700px;
    text-align: left;
}

</style>