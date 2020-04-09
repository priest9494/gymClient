<template>
    <div class="main-frame">
        <search-panel
        v-bind:options="searchOptions"
        @search="search"
        />
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
                @click="onRowClicked(idx)"
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
        }
    },
    methods: {
        async search(searchCriterion, userInput) {
            var res
            this.visitList = []

            if(!userInput) {
               res = await this.$axios.get('http://localhost:3000/v1/visits/getLatest')
            } else if (searchCriterion === 'Номер абонемента'){
                res = await this.$axios.post('http://localhost:3000/v1/visits/getBySubNumber', {
                    sub_number: userInput
                })
            } else {
                res = await this.$axios.post('http://localhost:3000/v1/visits/getByFio', {
                    fio: userInput
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
        },
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/frameStyles/report.scss';
</style>