<template>
    <div class="main-frame">
        <search-panel
            v-bind:options="searchOptions"
            @search="setUserInput"
        />

        <div class="search-result-frame">
            <div class="search-result-header">
                <div v-for="node in gridColumnsToShow" :key="node">
                    {{ node }}
                </div>
            </div>
            <div 
                class="search-result"
                v-for="(node, idx) in paymentsToShow"
                :key="idx"
                @click="onRowClicked(idx)"
            >
                <div v-for="value in node" :key="value">
                    {{ value }}
                </div>
            </div>
        </div>

        <div class="add-type-wrapper">
            <button class="add-type-button" @click="addPayment">Добавить оплату</button>
        </div>

        <payments-modal
        v-bind:gridRows="gridColumns"
        v-bind:gridNodes="modalInfo"
        v-bind:isAddOperation="isAddOperation"
        v-show="modalShow"
        @modalClose="modalClose"
        @modalCloseX="modalShow = false"
        />
    </div>
</template>

<script>
import paymentsModal from '../modals/paymentsModal'
import searchPanel from '../other/searchPanel'
import convert from '../../util/dateConvert'

import logFileAccess from '../../util/logFileAccess'

export default {
    components: {
        'payments-modal': paymentsModal,
        'search-panel': searchPanel
    },
    created: function() {
        this.search()
    },
    data() {
        return {
            gridColumns: [
                'id',
                'ФИО',
                'Абонемент',
                'Номер абонемента',
                'Сумма',
                'Ставка тренера',
                'Дата оплаты',
                'Метод'
            ],
            paymentsList: [],
            modalShow: false,
            modalInfo: {},
            isAddOperation: false,
            searchOptions: [
                'Номер абонемента',
                'ФИО'
            ],
            userInput: '',
            searchCriterion: ''
        }
    },
    methods: {
        setUserInput(searchCriterion, userInput) {
            this.userInput = userInput
            this.searchCriterion = searchCriterion
            this.search()
        },
        modalClose() {
            this.modalShow = false;
            this.search()
        },
        async search() {
            let res
            this.paymentsList = [];
            if(!this.userInput) {
                res = await this.$axios.get('https://localhost:3000/v1/payments/getLatest', {
                    headers: {
                        Authorization: "Bearer " + this.$store.getters.getToken
                    }
                })
            } else if(this.userInput && this.searchCriterion === 'Номер абонемента') {
                res = await this.$axios.post('https://localhost:3000/v1/payments/findBySubNumber', {
                    sub_number: this.userInput
                }, {
                headers: {
                    Authorization: "Bearer " + this.$store.getters.getToken
                }
            })
            } else {
                res = await this.$axios.post('https://localhost:3000/v1/payments/findByFio', {
                    fio: this.userInput
                }, {
                headers: {
                    Authorization: "Bearer " + this.$store.getters.getToken
                }
            })
            }

            res.data.forEach(element => {
                this.paymentsList.push({
                    id: element.payment_id,
                    subNumber: element.sub_number,
                    fio: element.fio,
                    paymentDate: convert(element.payment_date),
                    paymentAmount: element.payment_amount,
                    interestRate: element.interest_rate,
                    paymentMethod: element.payment_method,
                    sub: element.sub_number + ' ' + element.fio,
                })
            });

            this.paymentsList = this.paymentsList.reverse();
        },
        onRowClicked(idx) {
            this.isAddOperation = false
            this.modalShow = true;
            this.modalInfo = this.paymentsList[idx];
        },
        addPayment() {
            this.modalShow = true
            this.isAddOperation = true
            let logRate = logFileAccess('read').rate

            this.modalInfo = {
                id: '',
                sub: '',
                subNumber: '',
                fio: '',
                paymentDate: convert(new Date()),
                paymentAmount: '',
                interestRate: logRate,
                paymentMethod: ''
            }
        }
    },
    computed: {
        gridColumnsToShow: function() {
            return this.gridColumns.filter(function(item) {
                return item !== 'id' && item !=='Дата оплаты' && item !== 'Метод' && item !== 'Абонемент' && item !== 'Ставка тренера'
            })
        },
        paymentsToShow: function() {
            var newList = []
            this.paymentsList.forEach(node => {
                newList.push({
                    fio: node.fio,
                    subNumber: node.subNumber,
                    paymentAmount: node.paymentAmount
                })
            });

            return newList
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/frameStyles/payments.scss';
</style>