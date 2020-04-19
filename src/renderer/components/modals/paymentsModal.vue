<template>
    <div class="main-shadow">
        <div class="main-form">
            <div class="main-modal">
                <div class="close-button" @click="close">x</div>
                <div class="info-wrapper">
                    <div class="static-info-rows">
                        <div v-for="item in gridRowsToShow" :key="item">
                            {{ item }}
                        </div>
                    </div>
                    <div class="dynamic-info-rows">
                        <input
                            class="user-input"
                            v-for="(value, key) in gridNodesToShow"
                            :key="key"
                            type="text"
                            :class="{ 'bordered': isEditable || isAddOperation }"
                            :disabled="!(isEditable || isAddOperation)"
                            v-model="gridNodes[key]"
                            @click="clientInputClicked(key)"
                        >
                        <select class="method-select" v-model="selectedMethod" v-if="isAddOperation">
                            <option>нал</option>
                            <option>б/н</option>
                        </select>
                    </div>
                </div>
                
                <div class="edit-button-wrapper" v-if="!isAddOperation">
                    <button class="remove-type-button" @click="confirmVisible = true">Удалить</button>
                </div>

                <div class="add-button-wrapper" v-if="isAddOperation">
                    <button class="confirm-add-type-button" @click="addPayment">Добавить</button>
                </div>

                <sub-choose-helper
                    v-show="helperVisible"
                    @rowChoosed="subChoosed"
                    @heplerCloseX="helperVisible = false"
                />

                <confirm-modal
                    v-show="confirmVisible"
                    @agreeClose="removePayment"
                    @disagreeClose="confirmVisible = false"
                    v-bind:questionString="'Удалить оплату?'"
                />
            </div>
        </div>
    </div>
</template>


<script>
import validate from '../../validation/paymentsValidation'
import subChooseHelper from './subChooseHelper'
import confirmModal from './confirmModal'

export default {
    components: {
        'sub-choose-helper': subChooseHelper,
        'confirm-modal': confirmModal
    },
    props: {
        gridRows: Array,
        gridNodes: Object,
        isAddOperation: Boolean
    },
    data() {
        return {
            isEditable: false,
            helperVisible: false,
            choosedSub: {},
            selectedMethod: 'нал',
            confirmVisible: false
        }
    },
    computed: {
        gridRowsToShow: function() {
            return this.gridRows.filter(function(item) {
                return item !== 'id' && item !== 'ФИО' && item !== 'Номер абонемента'
            })
        },
        gridNodesToShow: function() {
            var showObj = {}
            showObj.sub = this.gridNodes.sub
            showObj.paymentDate = this.gridNodes.paymentDate
            showObj.paymentAmount = this.gridNodes.paymentAmount

            if(!this.isAddOperation) {
                showObj.paymentMethod = this.gridNodes.paymentMethod
            }
            
            return showObj
        }
    },
    methods: {
        subChoosed(sub) {
            this.choosedSub = sub
            this.helperVisible = false
            this.gridNodes.sub = sub.subNumber + ' ' + sub.fio
        },
        clientInputClicked(key) {
            if(key === 'sub') {
                this.helperVisible = true
            }
        },
        close() {
            this.isEditable = false
            this.$emit('modalCloseX')
        },
        async addPayment() {
            var { isCorrect, alertMessage } = validate(this.gridNodes)

            console.log(this.selectedMethod)
            if(!isCorrect) {
                alert(alertMessage)
                return
            }

            let isExists = await this.$axios.post('http://localhost:3000/v1/payments/isExists', {
                sub_number: this.choosedSub.subNumber
            })
            if(!isExists.data) {
                alert('Номер абонемента не существует')
                return
            }

            await this.$axios.post('http://localhost:3000/v1/payments/add', {
                sub_number: this.choosedSub.subNumber,
                payment_date: this.gridNodes.paymentDate,
                payment_amount: this.gridNodes.paymentAmount,
                payment_method: this.selectedMethod
            })

            this.$emit('modalClose')
        },
        async removePayment() {
            this.confirmVisible = false
            
            await this.$axios.post('http://localhost:3000/v1/payments/remove', {
                id: this.gridNodes.id
            })
            this.$emit('modalClose')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/modalStyles/paymentsModal.scss';
</style>