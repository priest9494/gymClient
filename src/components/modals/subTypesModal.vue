<template>
    <div class="info-frame">
        <div class="info-wrapper">
            <div class="static-info-rows">
                <div v-for="k in 3" :key="k"> {{ gridRows[k] }} </div>
            </div>
            <div class="dynamic-info-rows">
                <input :class="{ 'bordered': isEditable || isAddOperation }" type="text" v-model="gridNodes.title" :disabled="!(isEditable || isAddOperation)">
                <input :class="{ 'bordered': isEditable || isAddOperation }" type="text" v-model="gridNodes.cost" :disabled="!(isEditable || isAddOperation)">
                <input :class="{ 'bordered': isEditable || isAddOperation }" type="text" v-model="gridNodes.training" :disabled="!(isEditable || isAddOperation)">
            </div>
            <div class="close-button" @click="close">x</div>
        </div>
        
        <div class="edit-button-wrapper" v-if="!isAddOperation">
            <button class="change-button" @click="editSubType">{{ isEditable ? 'Применить' : 'Изменить' }}</button>
            <button class="remove-button" @click="removeSubType">Удалить</button>
        </div>

        <div class="add-button-wrapper" v-if="isAddOperation">
            <button class="add-button" @click="addSubType">Добавить</button>
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
.info-frame {
    position: fixed;
    top: 30%;
    bottom: 30%;
    left: 30%;
    right: 30%;
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.884);
    background: #202225;
    border: 4px solid rgb(234, 230, 236);

    .info-wrapper {
        position: relative;
        height: 80%;
        width: 100%;

        display: flex;
        align-items: flex-start;

        .static-info-rows {
            margin: 10px 0px 0px 50px;

            div {
                display: flex;
                align-items: center;
                margin-top: 10px;
                height: 30px;
                font-size: 12px;
            }
        }

        .dynamic-info-rows {
            margin: 10px 0px 0px 15px;
            display: flex;
            flex-direction: column;
            input {
                color:white;
                background: rgba(178, 34, 34, 0);
                height: 30px;
                width: 250px;
                margin-top: 10px;
                padding: 0px;
                border: none;
                font-size: 12px;

                &.bordered {
                    border: 1px solid white;
                    margin-top: 8px;
                }
            }

        }

        .close-button {
            margin-top: 10px;
            margin-left: auto;
            margin-right: 20px;
            font-size: 25px;
            cursor: pointer;
        }
    }
    .edit-button-wrapper, 
    .add-button-wrapper {
        display: flex;
        justify-content: space-around;
        margin-bottom: 10px;

        button {
            background: #adbbbe;
            padding: 5px 10px 5px 10px;
            outline: none;
            font-family: 'Ubuntu Condensed', sans-serif;
            border: 2px solid rgb(0, 0, 0);
            cursor: pointer;
            font-size: 1.2rem;
            line-height: 1;
            text-transform: uppercase;
            font-weight: 400;
            transition: all 0.3s;

            &:hover,
            &:focus {
                background: rgb(200, 248, 188);
                font-size: 1.25rem;
            }
        }
        .change-button {
            background: rgb(166, 250, 144);
            &:hover,
            &:focus {
                background: rgb(200, 248, 188);
            }
        }

        .remove-button {
            background: rgb(248, 128, 128);
            &:hover,
            &:focus {
                background: rgb(252, 169, 169);
            }
        }
    }
    
}

</style>