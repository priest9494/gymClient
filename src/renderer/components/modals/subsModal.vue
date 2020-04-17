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
                            :class="{ 'bordered': isEditOperation || isAddOperation }"
                            :disabled="!(isEditOperation || isAddOperation)"
                            v-model="gridNodes[key]"
                            @click="inputClicked(key)"
                        >
                    </div>
                </div>

                <div class="add-button-wrapper" v-if="isAddOperation">
                    <button class="confirm-add-type-button" @click="addSub">Добавить</button>
                </div>

                <div class="edit-button-wrapper" v-if="!isAddOperation">
                    <button class="edit-type-button" @click="editSub">{{ isEditOperation ? 'Применить' : 'Изменить' }}</button>
                    <button class="extend-type-button" @click="extendSub">Продлить</button>
                    <button class="remove-type-button" @click="removeSubClicked">Удалить</button>
                </div>

                <confirmModal
                    v-show="confirmVisible"
                    @agreeClose="removeSub"
                    @disagreeClose="confirmVisible = false"
                    v-bind:questionString="'Удалить абонемент?'"
                />

                <helperModal
                    v-show="helperVisible"
                    v-bind:helperTitle="helperTitle"
                    v-bind:currentOptionKey="currentOptionKey"
                    :key="searchPanelKey"
                    @modalClose="helperVisible = false"
                    @rowChoosed="rowChoosed"
                />

                <extend-modal
                    v-show="extendVisible"
                    v-bind:begDate="gridNodes.begDate"
                    v-bind:endDate="gridNodes.endDate"
                    @extendClose="extendClose"
                    @extendConfirmed="extendConfirmed"
                />
            </div>
        </div>
    </div>
</template>

<script>
import confirmModal from './confirmModal'
import helperModal from './addSubHelperModal'
import extendModal from './extendSubModal'

import { mapGetters } from 'vuex'
import validate from '../../validation/subValidation'
import trainCase from '../../util/trainingCase'

export default {
    name: 'get-full-info-modal',
    components: {
        confirmModal,
        helperModal,
        'extend-modal': extendModal
    },
    props: {
        gridRows: Array,
        gridNodes: Object,
        receivedSubNumber: String
    },
    data() {
        return {
            confirmVisible: false,
            helperVisible: false,
            helperTitle: '',
            currentOptionKey: 'clients',
            searchPanelKey: 0,
            choosedId: {
                clientId: '',
                trainerId: '',
                typeId: ''
            },
            extendVisible: false
        }
    },
    methods: {
        rowChoosed(choosedNode) {
            this.helperVisible = false
            if(this.currentOptionKey === 'clients') {
                this.gridNodes.client = choosedNode.fio + '  ' + choosedNode.phoneNum
                this.choosedId.clientId = choosedNode.id
            }

            if(this.currentOptionKey === 'trainers') {
                this.gridNodes.trainer = choosedNode.fio
                this.choosedId.trainerId = choosedNode.id
            }

            if(this.currentOptionKey === 'types') {
                this.gridNodes.type = choosedNode.title + ' ' + choosedNode.training + ' ' + trainCase(choosedNode.training) + ' ' + choosedNode.cost + ' руб'
                this.choosedId.typeId = choosedNode.id
            }
        },
        inputClicked(key) {
            this.searchPanelKey += 1

            if(key === 'client') {
                this.currentOptionKey = 'clients'
                this.helperTitle = 'Выберите клиента'
                this.helperVisible = true
            }
            if(key === 'type') {
                this.currentOptionKey = 'types'
                this.helperTitle = 'Выберите вид абонемента'
                this.helperVisible = true
            }
            if(key === 'trainer') {
                this.currentOptionKey = 'trainers'
                this.helperTitle = 'Выберите тренера'
                this.helperVisible = true
            }
        },
        async editSub() {
            if (this.isEditOperation) {
                var { isCorrect, alertMessage } = await validate(this.gridNodes, this.isEditOperation)

                // Если при изменении абонемента номер абонемента не был изменен, проверять уникальность не требуется
                if(this.gridNodes.subNumber != this.receivedSubNumber) {
                    let res = await this.$axios.post('http://localhost:3000/v1/subs/checkUniq', {
                        sub_number: this.gridNodes.subNumber
                    })

                    if(!res.data) {
                        alertMessage = '• Такой номер абонемента уже существует\n' + alertMessage
                        isCorrect = false
                    }
                }
            
                if(!isCorrect) {
                    alert(alertMessage)
                    return
                }

                var begSplit = this.gridNodes.begDate.split(/[./-]/);
                var endSplit = this.gridNodes.endDate.split(/[./-]/);

                var begDateToSend = new Date(begSplit[2], begSplit[1] - 1, parseInt(begSplit[0]) + 1);
                var endDateToSend = new Date(endSplit[2], endSplit[1] - 1, parseInt(endSplit[0]) + 1);

                var clientIdToSend = this.choosedId.clientId ? this.choosedId.clientId : this.gridNodes.clientId
                var trainerIdToSend = this.choosedId.trainerId ? this.choosedId.trainerId : this.gridNodes.trainerId
                var typeIdToSend = this.choosedId.typeId ? this.choosedId.typeId : this.gridNodes.typeId
                
                await this.$axios.post('http://localhost:3000/v1/subs/edit', {
                    id: this.gridNodes.subId,
                    sub_number: this.gridNodes.subNumber,
                    type_id: typeIdToSend,
                    client_id: clientIdToSend,
                    trainer_id: trainerIdToSend,
                    begin_date: begDateToSend,
                    end_date: endDateToSend,
                    start_time: this.gridNodes.begTime + ':00',
                    training_left: this.gridNodes.trainLeft,
                    left_to_pay: this.gridNodes.payLeft,
                    note: this.gridNodes.note,
                    old_type: this.gridNodes.oldTypeId
                })

                this.$emit('modalClose');
            }
            this.$store.commit('subsFrame/setIsEditOperation', !this.isEditOperation)
        },
        removeSubClicked() {
            this.confirmVisible = true
        },
        async removeSub() {
            await this.$axios.get('http://localhost:3000/v1/subs/remove/' + this.gridNodes.subId)
            this.confirmVisible = false
            this.$emit('modalClose')
        },
        extendSub() {
            this.extendVisible = true
        },
        async extendConfirmed(begDateReplacement, endDateReplacement) {
            await this.$axios.post('http://localhost:3000/v1/subs/extend', {
                id: this.gridNodes.subId,
                beg_date: begDateReplacement,
                end_date: endDateReplacement
            })

            this.extendVisible = false
            this.$emit('modalClose') 
        },
        extendClose() {
            this.extendVisible = false
        },
        async addSub() {
            var { isCorrect, alertMessage } = await validate(this.gridNodes, this.isEditOperation)
            
            let res = await this.$axios.post('http://localhost:3000/v1/subs/checkUniq', {
                sub_number: this.gridNodes.subNumber
            })

            if(!res.data) {
                alertMessage = '• Такой номер абонемента уже существует\n' + alertMessage
                isCorrect = false
            }

            if(!isCorrect) {
                alert(alertMessage)
                return
            }

            var begSplit = this.gridNodes.begDate.split(/[./-]/);
            var endSplit = this.gridNodes.endDate.split(/[./-]/);

            var begDateToSend = new Date(begSplit[2], begSplit[1] - 1, parseInt(begSplit[0]) + 1);
            var endDateToSend = new Date(endSplit[2], endSplit[1] - 1, parseInt(endSplit[0]) + 1);

            await this.$axios.post('http://localhost:3000/v1/subs/add', {
                sub_number: this.gridNodes.subNumber,
                type_id: this.choosedId.typeId,
                client_id: this.choosedId.clientId,
                trainer_id: this.choosedId.trainerId,
                begin_date: begDateToSend,
                end_date: endDateToSend,
                start_time: this.gridNodes.begTime + ':00',
                note: this.gridNodes.note
            })

            this.$store.commit('subsFrame/setIsAddOperation', false)
            this.$emit('modalClose');
        },
        close() {
            this.$store.commit('subsFrame/setIsAddOperation', false)
            this.$store.commit('subsFrame/setIsEditOperation', false)

            this.$emit('modalCloseX');
        }
    },
    computed: {
        ...mapGetters({
            isAddOperation: 'subsFrame/isAddOperation',
            isEditOperation: 'subsFrame/isEditOperation',
        }),
        gridRowsToShow: function() {
            if(this.isAddOperation) {
                return this.gridRows.filter(function(item) {
                    return item !== 'id' && item !== 'Осталось занятий' && item !== 'Осталось оплатить'
                })
            } else {
                return this.gridRows.filter(function(item) {
                    return item !== 'id'
                })
            }
        },
        gridNodesToShow: function() {
            var node = {}

            node.subNumber = this.gridNodes.subNumber
            node.client = this.gridNodes.client
            node.type = this.gridNodes.type
            node.trainer = this.gridNodes.trainer
            node.begDate = this.gridNodes.begDate
            node.endDate = this.gridNodes.endDate
            node.begTime = this.gridNodes.begTime
            
            if(!this.isAddOperation) {
                node.trainLeft = this.gridNodes.trainLeft
                node.payLeft = this.gridNodes.payLeft
            }

            node.note = this.gridNodes.note

            return node
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/modalStyles/subsModal.scss';
</style>