<template>
    <div class="main-frame">
        <search-panel
        v-bind:options="searchOptions"
        @search="setSearchInput"
        />
        <div class="date-pick-wrapper">
            <div class="date-pick-header">
                <div>Выберите диапазон дат</div>
            </div>
            <div class="date-pick-body">
                <div>От</div>
                <input :value="begSearchDate" :disabled="dateRange !== 'Ручной ввод'" @input="begDateInputChanged">
                <div>До</div>
                <input :value="endSearchDate" :disabled="dateRange !== 'Ручной ввод'" @input="endDateInputChanged">
                <select v-model="dateRange" @change="dateRangeChanged">
                    <option>За все время</option>
                    <option>За месяц</option>
                    <option>За год</option>
                    <option>Ручной ввод</option>
                </select>
            </div>
        </div>
        <div class="search-result-frame">
            <div class="search-result">
                <div
                    class="search-result-header"
                    v-for="item in gridColumns"
                    :key="item"
                >
                    {{ item }}
                </div>
            </div>

            <div 
                class="search-result"
                v-for="(node, idx) in visitListToShow"
                :key="idx"
            >
                <div v-for="value in node" :key="value">
                    {{ value }}
                </div>
            </div>
        </div>
        <div class="report-button-wrapper">
            <button>Отчет "Начисления при продаже"</button>
        </div>

    </div>
</template>

<script>
import searchPanel from '../other/searchPanel'
import convert from '../../util/dateConvert'
import validate from '../../validation/reportValidation'

export default {
    components: {
        'search-panel': searchPanel
    },
    data() {
        return {
            searchOptions: [
                'Номер абонемента',
                'ФИО'
            ],
            gridColumns: [
                'Номер абонемента',
                'ФИО',
                'Дата визита',
                'Время визита'
            ],
            visitList: [],
            dateRange: 'За все время',
            userInput: '',
            searchCriterion: '',
            begSearchDate: '',
            endSearchDate: ''
        }
    },
    methods: {
        dateRangeChanged() {
            var now = new Date()
            
            if(this.dateRange === 'За все время') {
                now = ''
            }
            if(this.dateRange === 'За год') {
                now.setFullYear(now.getFullYear() - 1)
            }
            if(this.dateRange === 'За месяц') {
                now.setMonth(now.getMonth() - 1)
            }

            this.begSearchDate =  now ? convert(now) : ''

            now = new Date()
            this.endSearchDate =  convert(now)

            this.search()
        },
        begDateInputChanged(event) {
            this.begSearchDate = event.target.value
            this.search()
        },
        endDateInputChanged(event) {
            this.endSearchDate = event.target.value
            this.search()
        },
        setSearchInput(searchCriterion, userInput) {
            this.userInput = userInput
            this.searchCriterion = searchCriterion
            this.search()
        },
        async search() {
            var res
            this.visitList = []
            if(!validate(this.begSearchDate, this.endSearchDate)) {
                return
            }
            
            if(!this.userInput) {
               res = await this.$axios.post('http://localhost:3000/v1/visits/getLatest', {
                   beg_range: this.begSearchDate,
                   end_range: this.endSearchDate
               })
            } else if (this.searchCriterion === 'Номер абонемента'){
                res = await this.$axios.post('http://localhost:3000/v1/visits/getBySubNumber', {
                    sub_number: this.userInput,
                    beg_range: this.begSearchDate,
                    end_range: this.endSearchDate
                })
            } else {
                res = await this.$axios.post('http://localhost:3000/v1/visits/getByFio', {
                    fio: this.userInput,
                    beg_range: this.begSearchDate,
                    end_range: this.endSearchDate
                })
            }
            
            res.data.forEach(element => {
                this.visitList.push({
                    id: element.id,
                    fio: element.fio,
                    subNumber: element.sub_number,
                    visitDate: convert(element.visit_date),
                    visitTime: element.visit_time
                })
            });

            this.visitList = this.visitList.reverse()
        }
    },
    created() {
        this.dateRangeChanged()
        this.search()
    },
    computed: {
        visitListToShow: function() {
            var newList = []
            this.visitList.forEach(node => {
                newList.push({
                    subNumber: node.subNumber,
                    fio: node.fio,
                    visitDate: node.visitDate,
                    visitTime: node.visitTime
                })
            });

            return newList
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/frameStyles/report.scss';
</style>