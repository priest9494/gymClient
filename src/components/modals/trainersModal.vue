<template>
    <div class="info-frame">
        <div class="info-wrapper">
            <div class="static-info-rows">
                <div v-for="k in 2" :key="k">{{ gridRows[k] }}</div>
            </div>
            <div class="dynamic-info-rows">
                <input class="user-input" :class="{ 'bordered': isEditable || isAddOperation }" type="text" v-model="gridNodes.fio" :disabled="!(isEditable || isAddOperation)">
                <input class="user-input" :class="{ 'bordered': isEditable || isAddOperation }" type="text" v-model="gridNodes.dateBirth" :disabled="!(isEditable || isAddOperation)">
            </div>
            <div class="close-button" @click="close">x</div>
        </div>
        
        <div class="edit-button-wrapper" v-if="!isAddOperation">
            <button class="change-button" @click="editTrainer">{{ isEditable ? 'Применить' : 'Изменить' }}</button>
            <button class="remove-button" @click="removeTrainer">Удалить</button>
        </div>

        <div class="add-button-wrapper" v-if="isAddOperation">
            <button class="add-button" @click="addTrainer"> Добавить </button>
        </div>
    </div>
</template>


<script>
export default {
    name: 'get-full-info-modal',
    props: {
        gridRows: Array,
        gridNodes: Array,
        isAddOperation: Boolean
    },
    data() {
        return {
            isEditable: false,
        }
    },
    methods: {
        close() {
            this.$emit('modalClose')
        },
        async editTrainer() {
            if (this.isEditable) {
                if(!this.validate()) {
                    return;
                }

                var parms = this.gridNodes.dateBirth.split(/[./-]/);
                var postDate = new Date(parms[2], parms[1] - 1, parseInt(parms[0]) + 1);

                await this.$axios.post('http://localhost:3000/v1/trainers/edit', {
                    id: this.gridNodes.id,
                    fio: this.gridNodes.fio,
                    bdate: postDate
                })

            }
            this.isEditable = !this.isEditable
        },
        async removeTrainer() {
            await this.$axios.get('http://localhost:3000/v1/trainers/remove/' + this.gridNodes.id)
            this.$emit('modalClose')
        },
        async addTrainer() {
            if(!this.validate()) {
                return;
            }
            var parms = this.gridNodes.dateBirth.split(/[./-]/);
            var postDate = new Date(parms[2], parms[1] - 1, parseInt(parms[0]) + 1);

            await this.$axios.post('http://localhost:3000/v1/trainers/add', {
                fio: this.gridNodes.fio,
                bdate: postDate
            })

            this.$emit('modalClose')
        },
        validate() {
            var isCorrect = true

            if(this.gridNodes.fio.length === 0) {
                alert('Введите ФИО')
                isCorrect = false
            }

            if(this.gridNodes.fio.length > 100) {
                alert('Слишком длинное ФИО')
                isCorrect = false
            }   

            var dateReg = /^\d{2}[./-]\d{2}[./-]\d{4}$/
            if(this.gridNodes.dateBirth.match(dateReg) === null) {
                alert('Дата не соответствует формату (дд.мм.гггг)')
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
            .user-input {
                color:white;
                background: rgba(178, 34, 34, 0);
                height: 30px;
                margin-top: 10px;
                
                &.bordered {
                    border: 1px solid white;
                    margin-top: 8px;
                }
            }

            input {
                padding: 0px;
                background: rgba(178, 34, 34, 0);
                border: none;
                color:white;
                font-size: 12px;
                width: 200px;
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