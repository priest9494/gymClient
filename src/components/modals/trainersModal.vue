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
                <button class="edit-type-button" @click="editTrainer">{{ isEditable ? 'Применить' : 'Изменить' }}</button>
                <button class="remove-type-button" @click="removeTrainerClicked">Удалить</button>
            </div>
            <div class="add-button-wrapper" v-if="isAddOperation">
                <button class="add-type-button" @click="addTrainer">Добавить</button>
            </div>
        </div>
        <confirm-modal
            v-show="confirmVisible"
            @agreeClose="removeTrainer"
            @disagreeClose="confirmVisible = false"
            v-bind:questionString="'Удалить тренера?'"
        />
    </div>
</template>


<script>
import validate from '../../validation/trainerValidation'
import confirmModal from './confirmModal'

export default {
    components: {
        'confirm-modal': confirmModal
    },
    name: 'get-full-info-modal',
    props: {
        gridRows: Array,
        gridNodes: Object,
        isAddOperation: Boolean
    },
    data() {
        return {
            isEditable: false,
            confirmVisible: false
        }
    },
    computed: {
        gridRowsToShow: function() {
            return this.gridRows.filter(function(item) {
                return item !== 'id'
            })
        },
        gridNodesToShow: function() {
            return {
                fio: this.gridNodes.fio,
                dateBirth: this.gridNodes.dateBirth,
            }
        }
    },
    methods: {
        async editTrainer() {
            if (this.isEditable) {
                var { isCorrect, alertMessage } = validate(this.gridNodes)

                if(!isCorrect) {
                    alert(alertMessage)
                    return
                }

                var parms = this.gridNodes.dateBirth.split(/[./-]/);
                var postDate = new Date(parms[2], parms[1] - 1, parseInt(parms[0]) + 1);

                await this.$axios.post('http://localhost:3000/v1/trainers/edit', {
                    id: this.gridNodes.id,
                    fio: this.gridNodes.fio,
                    bdate: postDate
                })

                this.$emit('modalClose')
            }
            this.isEditable = !this.isEditable
        },
        removeTrainerClicked() {
            this.confirmVisible = true
        },
        async removeTrainer() {
            await this.$axios.get('http://localhost:3000/v1/trainers/remove/' + this.gridNodes.id)
            this.$emit('modalClose')
        },
        async addTrainer() {
            var { isCorrect, alertMessage } = validate(this.gridNodes)

            if(!isCorrect) {
                alert(alertMessage)
                return
            }

            var parms = this.gridNodes.dateBirth.split(/[./-]/);
            var postDate = new Date(parms[2], parms[1] - 1, parseInt(parms[0]) + 1);

            await this.$axios.post('http://localhost:3000/v1/trainers/add', {
                fio: this.gridNodes.fio,
                bdate: postDate
            })

            this.$emit('modalClose')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/modalStyles/trainersModal.scss';
</style>