<template>
    <div class="helper-shadow">
        <div class="helper-frame">
            <div class="helper-header">
                <div class="close-button" @click="$emit('heplerCloseX')">x</div>
                <div class="helper-title">
                    Выберите абонемент
                </div>
            </div>
             <search-panel
                v-bind:options="searchOptions"
                @search="searchSub"
            />
            <div class="helper-body">
                <div class="search-result-header">
                    <div
                        v-for="item in gridColumns"
                        :key="item"
                    >
                        {{ item }}
                    </div>
                </div>
                <div 
                    class="search-result"
                    v-for="(node, idx) in subListToShow"
                    :key="idx"
                    @click="onRowClicked(idx)"
                >
                    <div v-for="value in node" :key="value">
                        {{ value }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import searchPanel from '../other/searchPanel'
import convert from '../../util/dateConvert'
import trainCase from '../../util/trainingCase'

export default {
    components: {
        'search-panel': searchPanel
    },
    created() {
        this.searchSub()
    },
    data() {
        return {
            searchOptions: [
                'Номер абонемента',
                'ФИО',
                'Номер телефона'
            ],
            subList: [],
            gridColumns: [
                'Номер абонемента',
                'ФИО',
                'Номер телефона',
                'Осталось оплатить'
            ],
        }
    },
    computed: {
        subListToShow: function() {
            var newList = []
            this.subList.forEach(node => {
                newList.push({
                    subNumber: node.subNumber,
                    fio: node.fio,
                    phoneNum: node.phoneNum,
                    payLeft: node.payLeft
                })
            });

            return newList
        }
    },
    methods: {
        onRowClicked(idx) {
            this.$emit('rowChoosed', this.subList[idx])
        },
        async searchSub(searchCriterion, userInput) {
            let res
            this.subList = [];

            if(!userInput) {
                res = await this.$axios.get('https://localhost:3000/v1/subs/getLatest')
            } else if(searchCriterion === 'Номер абонемента') {
                res = await this.$axios.post('https://localhost:3000/v1/subs/getSubBySubNumber', {
                    sub_number: userInput
                })
            } else if(searchCriterion === 'ФИО') {
                res = await this.$axios.post('https://localhost:3000/v1/subs/getSubByFio', {
                    fio: userInput
                })
            } else {
                res = await this.$axios.post('https://localhost:3000/v1/subs/getSubByPhoneNumber', {
                    phone_number: userInput
                })
            }

            console.log('search executed!')
            console.log(res.data)
            res.data.forEach(element => {
                this.subList.push({
                    subId: element.sub_id,
                    clientId: element.client_id,
                    trainerId: element.trainer_id,
                    typeId: element.type_id,
                    subNumber: element.sub_number,
                    fio: element.client_fio,
                    phoneNum: element.phone_number,
                    type: element.title + ' ' + element.training + ' ' + trainCase(element.training) + ' ' + element.cost + ' рублей',
                    trainer: element.trainer_fio,
                    begDate: convert(element.begin_date),
                    endDate: convert(element.end_date),
                    begTime: element.start_time,    
                    trainLeft: element.training_left,
                    payLeft: element.left_to_pay,
                    note: element.note,
                    client: element.client_fio + ' ' + element.phone_number,
                    oldTypeId: element.type_id,
                })
            });

            this.subList = this.subList.reverse()
        },
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/modalStyles/subChooseHepler.scss'
</style>