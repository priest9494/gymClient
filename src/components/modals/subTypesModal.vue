<template>
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
                        >
                </div>
            </div>
            
            <div class="edit-button-wrapper" v-if="!isAddOperation">
                <button class="edit-type-button" @click="editSubType">{{ isEditable ? 'Применить' : 'Изменить' }}</button>
                <button class="remove-type-button" @click="removeSubType">Удалить</button>
            </div>

            <div class="add-button-wrapper" v-if="isAddOperation">
                <button class="add-type-button" @click="addSubType">Добавить</button>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'get-full-info-modal',
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
            return this.gridRows.filter(function(item) {
                return item !== 'id'
            })
        },
        gridNodesToShow: function() {
            return {
                title: this.gridNodes.title,
                cost: this.gridNodes.cost,
                training: this.gridNodes.training
            }
        }
    },
    methods: {
        close() {
            this.$emit('modalClose')
        },
        async editSubType() {
            if (this.isEditable) {
                if(!this.validate()) {
                    return
                }

                await this.$axios.post('http://localhost:3000/v1/types/edit', {
                    id: this.gridNodes.id,
                    title: this.gridNodes.title,
                    cost: this.gridNodes.cost,
                    training: this.gridNodes.training
                })
                
                this.$emit('modalClose')
            }
            this.isEditable = !this.isEditable

        },
        async addSubType() {
            if(!this.validate()) {
                return
            }

            await this.$axios.post('http://localhost:3000/v1/types/add', {
                title: this.gridNodes.title,
                cost: this.gridNodes.cost,
                training: this.gridNodes.training
            })

            this.$emit('modalClose')
        },
        async removeSubType() {
            await this.$axios.get('http://localhost:3000/v1/types/remove/' + this.gridNodes.id)
            this.$emit('modalClose')
        },
        validate() {
            var isCorrect = true
            var costInt = parseInt(this.gridNodes.cost)
            var trainingInt = parseInt(this.gridNodes.training)

            if(this.gridNodes.title.length === 0) {
                alert('Введите наименование')
                isCorrect = false
            }

            if(this.gridNodes.title.length > 50) {
                alert('Слишком длинное наименование')
                isCorrect = false
            }

            if(this.gridNodes.cost.length === 0) {
                alert('Введите стоимость')
                isCorrect = false
            } else if(isNaN(costInt) || costInt < 0 || costInt > 2000000000) {
                alert('Некорректная стоимость')
                isCorrect = false
            }

            if(this.gridNodes.training.length === 0) {
                alert('Введите количество занятий')
                isCorrect = false
            } else if(isNaN(trainingInt) || trainingInt < 0 || trainingInt > 30000) {
                alert('Некорректное количество занятий')
                isCorrect = false
            }

            return isCorrect
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/modalStyles/subTypesModal.scss';
</style>