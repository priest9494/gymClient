<template>
    <div class="main-frame">
        <search-panel
            v-bind:options="gridColumnsToShow"
            @search="search"
        />
        <div class="search-result-frame">
            <div class="search-result">
                <div
                    class="search-result-header"
                    v-for="item in gridColumnsToShow"
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
                <div 
                    v-for="value in node"
                    :key="value"
                >
                    {{ value }}
                </div>
            </div>
        </div>
        <div class="add-sub-wrapper">
            <button class="add-type-button" @click="addSub">Добавить абонемент</button>
        </div>
        <div class="goto-sub-types-wrapper">
            <router-link to="/subTypes">
                <button class="goto-sub-types">
                    В раздел "Виды абонементов"
                </button>
            </router-link>
        </div>
        <subModal
            v-bind:gridRows="gridColumns"
            v-bind:gridNodes="modalInfo"
            v-bind:receivedSubNumber="receivedSubNumber"
            v-show="modalShow"
            @modalClose="modalClose"
            @modalCloseX="modalShow = false"
        />
    </div>
</template>

<script>
import searchPanel from '../other/searchPanel'
import subModal from '../modals/subsModal'
import { mapGetters } from 'vuex'

import convert from '../../util/dateConvert'

export default {
    components: {
        subModal,
        'search-panel': searchPanel
    },
    data() {
        return {
            searchCriterion: 'Номер абонемента',
            gridColumns: [
                "id",
                "Номер абонемента",
                "Клиент",
                "Вид абонемента",
                "Тренер",
                "Дата начала",
                "Дата окончания",
                "Время начала",
                "Осталось занятий",
                "Осталось оплатить",
                "Примечание"
            ],
            gridColumnsToShow: [
                "Номер абонемента",
                "ФИО",
                "Номер телефона",
            ],
            subList: [],
            modalShow: false,
            modalInfo: {},
            receivedSubNumber: ''
        }
    },
    created() {
        this.search()
    },
    computed: {
        ...mapGetters({
            isAddOperation: 'subsFrame/isAddOperation'
        }),
        subListToShow: function() {
            var newList = []
            this.subList.forEach(node => {
                newList.push({
                    subNumber: node.subNumber,
                    fio: node.fio,
                    phoneNum: node.phoneNum
                })
            });

            return newList
        }
    },
    methods: {
        addSub() {
            this.$store.commit('subsFrame/setIsAddOperation', true)
            this.modalShow = true

            var eDate = new Date();
            eDate.setMonth(eDate.getMonth() + 1);

            this.modalInfo = {
                id: '',
                subNumber: '',
                fio: '',
                phoneNum: '',
                type: '',
                trainer: '',
                begDate: convert(new Date()),
                endDate: convert(eDate),
                begTime: '',
                trainLeft: '',
                payLeft: '',
                note: ''
            }
        },
        onRowClicked(idx) {
            this.modalInfo = this.subList[idx];
            this.receivedSubNumber = this.subList[idx].subNumber
            this.modalShow = true
        },
        async search(searchCriterion, userInput) {
            let res

            this.subList = [];

            if(!userInput) {
                res = await this.$axios.get('http://localhost:3000/v1/subs/getLatest')
            } else if(searchCriterion === 'Номер абонемента') {
                res = await this.$axios.post('http://localhost:3000/v1/subs/getSubBySubNumber', {
                    sub_number: userInput
                })
            } else if(searchCriterion === 'ФИО') {
                res = await this.$axios.post('http://localhost:3000/v1/subs/getSubByFio', {
                    fio: userInput
                })
            } else {
                res = await this.$axios.post('http://localhost:3000/v1/subs/getSubByPhoneNumber', {
                    phone_number: userInput
                })
            }
            console.log(res)
            res.data.forEach(element => {
                this.subList.push({
                    subId: element.sub_id,
                    clientId: element.client_id,
                    trainerId: element.trainer_id,
                    typeId: element.type_id,
                    subNumber: element.sub_number,
                    fio: element.client_fio,
                    phoneNum: element.phone_number,
                    type: element.title + ' ' + element.training + ' занятий ' + element.cost + ' рублей',
                    trainer: element.trainer_fio,
                    begDate: convert(element.begin_date),
                    endDate: convert(element.end_date),
                    begTime: element.start_time,
                    trainLeft: element.training_left,
                    payLeft: element.left_to_pay,
                    note: element.note,
                    client: element.client_fio + ' ' + element.phone_number
                })
            });

            this.subList = this.subList.reverse()
        },
        modalClose() {
            this.modalShow = false
            this.search()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/frameStyles/subs.scss';
</style>