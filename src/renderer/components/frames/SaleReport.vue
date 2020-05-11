<template>
    <div class="main-frame">
        <div class="options-wrapper">
            <div class="option-title">Тренер</div>
            <select v-model="choosedId" @change="search" class="trainer-selector">
                <option v-for="trainer in trainerList" :value="trainer.id">
                    {{ trainer.fio }}
                </option>
            </select>

            <div class="option-title">Диапазон дат</div>
            <date-picker
                v-model="pickedDate"
                range
                @input="search"
            />

            <div class="option-title">Время начала</div>
            <time-picker v-model="pickedTime" @change="search"></time-picker>
        </div>
        
        <div class="search-result-frame">
            <div class="search-result-header">
                <div v-for="item in gridColumns" :key="item">
                    {{ item }}
                </div>
            </div>
            <div class="search-result" v-for="(node, idx) in resultList" :key="idx">
                <div v-for="value in node" :key="value">
                    {{ value }}
                </div>
            </div>
        </div>

        <div class="bottom-wrapper">
            <div class="button-wrapper">
                <button class="accept-type-button" @click="toCsv">Экспорт в Excel</button>
            </div>
            <div class="total-wrapper">
                <div class="total">Сумма по оплатам: {{ totalPayment }}</div>
                <div class="total">Сумма по начислениям тренеру: {{ totalSalary }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

import TimePicker from 'vue2-timepicker';
import 'vue2-timepicker/dist/VueTimepicker.css'

import validate from '../../validation/saleReportValidation'
import trainCase from '../../util/trainingCase'
import convert from '../../util/dateConvert'

export default {
    components: {
        'date-picker': DatePicker,
        'time-picker': TimePicker
    },
    data() {
        return {
            totalPayment: 0,
            totalSalary: 0,
            trainerList: [],
            choosedId: '-1',
            pickedDate: [],
            pickedTime: '',
            gridColumns: [
                'Тренер',
                'Номер абонемента',
                'Вид абонемента',
                'Дата оплаты',
                'Сумма оплаты',
                'Ставка тренера',
                'Начисление тренеру',
                'Время начала'
            ],
            resultList: []
        }
    },
    methods: {
        toCsv() {
            var csvString = 'Тренер;Номер абонемента;Вид абонемента;Дата оплаты;Сумма оплаты;Ставка тренера;Начисление тренеру;Время начала\n'

            this.resultList.forEach(element => {
                let line =
                    element.fio + ';' +
                    element.subNumber + ';' +
                    element.subType + ';' +
                    element.paymentDate + ';' +
                    element.paymentAmount + ';' +
                    element.interestRate + ';' +
                    element.trainerSalary + ';' +
                    element.begTime + '\n'

                csvString += line
            });
            
            var textEncoder = new TextEncoder('windows-1252');
            var csvContentEncoded = textEncoder.encode([csvString]);
            var blob = new Blob([csvContentEncoded], {type: 'text/csv;charset=windows-1252;'});
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            document.body.appendChild(a);

            a.style = "display: none";
            a.href = url;
            a.download = 'report.csv'
            a.click();

            document.body.removeChild(a);
        },
        async search() {
            this.resultList = []
            this.totalPayment = 0
            this.totalSalary = 0

            let sendObj = {
                time: this.pickedTime,
                beg: this.pickedDate[0],
                end: this.pickedDate[1],
                id: this.choosedId // -1, если нужны все тренеры
            }

            if(!validate(sendObj)) {
                return
            }

            let res = await this.$axios.post('https://localhost:3000/v1/report/getReport', sendObj)
            res.data.forEach(element => {
                let timeSplit = element.start_time.split(':')
                this.totalPayment += parseFloat(element.payment_amount)
                this.totalSalary += parseFloat(element.payment_amount * element.interest_rate / 100)

                this.resultList.push({
                    fio: element.fio,
                    subNumber: element.sub_number,
                    subType: element.title ? (element.title + ' ' + element.training + ' ' + trainCase(element.training) + ' ' + element.cost + ' рублей') : '',
                    paymentDate: convert(element.payment_date),
                    paymentAmount: element.payment_amount,
                    interestRate: element.interest_rate,
                    trainerSalary: element.payment_amount * element.interest_rate / 100,
                    begTime: timeSplit[0] + ':' + timeSplit[1]
                })
            });
        }
    },
    async created() {
        let res = await this.$axios.get('https://localhost:3000/v1/report/getTrainerList')

        this.trainerList = res.data
        this.trainerList.unshift({
            fio: 'Все',
            id: '-1'
        })
        this.choosedTrainer = this.trainerList[0]
        
        this.search()
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/frameStyles/saleReport.scss';
</style>