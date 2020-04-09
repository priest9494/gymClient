<template>
    <div class="main-form">
        <div class="main-modal">
            <div class="close-button" @click="$emit('modalCloseX')">x</div>
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
                        >
                </div>
            </div>
            
            <div class="edit-button-wrapper" v-if="!isAddOperation">
                <button class="edit-type-button" @click="editPayment">{{ isEditable ? 'Применить' : 'Изменить' }}</button>
                <button class="remove-type-button" @click="removeSubType">Удалить</button>
            </div>

            <div class="add-button-wrapper" v-if="isAddOperation">
                <button class="add-type-button" @click="addPayment">Добавить</button>
            </div>
        </div>
    </div>
</template>


<script>
import validate from '../../validation/paymentsValidation'

export default {
    props: {
        gridRows: Array,
        gridNodes: Object,
        isAddOperation: Boolean
    },
    data() {
        return {
            isEditable: false
        }
    },
    computed: {
        gridRowsToShow: function() {
            if(this.isAddOperation) {
                return this.gridRows.filter(function(item) {
                    return item !== 'id' && item !== 'ФИО'
                })
            } else {
                return this.gridRows.filter(function(item) {
                    return item !== 'id'
                })
            }
            
        },
        gridNodesToShow: function() {
            var showObj = {}

            showObj.subNumber = this.gridNodes.subNumber
            if(!this.isAddOperation) {
                showObj.fio = this.gridNodes.fio
            }
            showObj.paymentDate = this.gridNodes.paymentDate
            showObj.paymentAmount = this.gridNodes.paymentAmount
            showObj.paymentMethod = this.gridNodes.paymentMethod
            
            return showObj
        }
    },
    methods: {
        async editPayment() {
            if (this.isEditable) {
                var { isCorrect, alertMessage } = validate(this.gridNodes)

                if(!isCorrect) {
                    alert(alertMessage)
                    return
                }

                await this.$axios.post('http://localhost:3000/v1/types/edit', {
                    sub_number: this.gridNodes.subNumber,
                    title: this.gridNodes.title,
                    cost: this.gridNodes.cost,
                    training: this.gridNodes.training
                })
                
                this.$emit('modalClose')
            }
            this.isEditable = !this.isEditable

        },
        async addPayment() {
            var { isCorrect, alertMessage } = validate(this.gridNodes)

            if(!isCorrect) {
                alert(alertMessage)
                return
            }

            let isExists = await this.$axios.post('http://localhost:3000/v1/payments/isExists', {
                sub_number: this.gridNodes.subNumber
            })
            console.log(isExists)
            if(!isExists.data) {
                alert('Номер абонемента не существует')
                return
            }

            await this.$axios.post('http://localhost:3000/v1/payments/add', {
                sub_number: this.gridNodes.subNumber,
                payment_date: this.gridNodes.paymentDate,
                payment_amount: this.gridNodes.paymentAmount,
                payment_method: this.gridNodes.paymentMethod
            })

            this.$emit('modalClose')
        },
        async removeSubType() {
            await this.$axios.get('http://localhost:3000/v1/types/remove/' + this.gridNodes.id)
            this.$emit('modalClose')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/modalStyles/subTypesModal.scss';
</style>