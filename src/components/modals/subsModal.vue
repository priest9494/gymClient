<template>
    <div class="info-frame">
        <div class="close-button" @click="close">x</div>

        <div class="info-wrapper">
            <div class="static-info-rows">
                <div v-for="item in gridRowsToShow" :key="item">
                    {{ item }}
                </div>
            </div>

            <div class="dynamic-info-rows">
                <input
                    v-for="(value, key) in gridNodesToShow"
                    :key="key"
                    type="text"
                    class="user-input"
                    :class="{ 'bordered': isEditOperation || isAddOperation }"
                    :disabled="!(isEditOperation || isAddOperation)"
                    v-model="gridNodes[key]"
                    @click="inputClicked(key)"
                >
            </div>
        </div>

        <div class="add-button-wrapper" v-if="isAddOperation">
            <button class="add-button" @click="addSub">Добавить</button>
        </div>

        <div class="edit-buttons-wrapper" v-if="!isAddOperation">
            <button class="change-button" @click="editSub">{{ isEditOperation ? 'Применить' : 'Изменить' }}</button>
            <button class="remove-button" @click="removeSubClicked">Удалить</button>
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
    </div>
</template>

<script>
import confirmModal from './confirmModal'
import helperModal from './addSubHelperModal'
import { mapGetters } from 'vuex'
import validate from '../../validation/subValidation'

export default {
    name: 'get-full-info-modal',
    components: {
        confirmModal,
        helperModal
    },
    props: {
        gridRows: Array,
        gridNodes: Object
    },
    data() {
        return {
            isEditable: false,
            confirmVisible: false,
            helperVisible: false,
            helperTitle: '',
            currentOptionKey: 'clients',
            searchPanelKey: 0,
            choosedId: {
                clientId: '',
                trainerId: '',
                typeId: ''
            }
        }
    },
    methods: {
        rowChoosed(choosedNode) {
            this.helperVisible = false
            if(this.currentOptionKey === 'clients') {
                this.gridNodes.client = choosedNode.fio + '  ' + choosedNode.phoneNum
                this.choosedId.clientId = choosedNode.id
                console.log(this.choosedId.clientId)
            }

            if(this.currentOptionKey === 'trainers') {
                this.gridNodes.trainer = choosedNode.fio
                this.choosedId.trainerId = choosedNode.id
                console.log(this.choosedId.trainerId)
            }

            if(this.currentOptionKey === 'types') {
                this.gridNodes.type = choosedNode.title + ' ' + choosedNode.training + ' занятий ' + choosedNode.cost + ' руб'
                this.choosedId.typeId = choosedNode.id
                console.log(this.choosedId.typeId)
            }
        },
        inputClicked(key) {
            console.log(key)
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
        editSub() {
            if (this.isEditable) {
                console.log('Сохранено')
            }
            this.$store.commit('subsFrame/setIsEditOperation', !this.isEditOperation)
        },
        removeSubClicked() {
            this.confirmVisible = true
        },
        removeSub() {

        },
        addSub() {
            var { isCorrect, alertMessage } = validate(this.gridNodes)
            if(!isCorrect) {
                alert(alertMessage)
                return
            }
            /* if(!this.validate()) {
                return
            }
            this.fillSpaces() */
        },
        /* validate() {
            //Номер абонемента:
                // Длина
                // введен ли
                // проверить уникальность
            // Клиент
                // Выбран ли
            // Вид абонемента
                // Выбран ли
            // Тренер
                // Выбран ли
            // Дата начала
                // Выбрана ли
                // Формат
                // Меньше даты окончания
            // Дата окончания
                //  Выбрана ли
                // Формат
            // Время начала
                // Формат
            // Примечание
                // Длина
        }, */
        fillSpaces() {

        },
        close() {
            this.$store.commit('subsFrame/setIsAddOperation', false)
            this.$store.commit('subsFrame/setIsEditOperation', false)

            this.$emit('modalClose');
        }
    },
    computed: {
        ...mapGetters({
            isAddOperation: 'subsFrame/isAddOperation',
            isEditOperation: 'subsFrame/isEditOperation',
        }),
        gridRowsToShow: function() {
            return this.gridRows.filter(function(item) {
                return item !== 'id' && item !== 'Осталось занятий' && item !== 'Осталось оплатить'
            })
        },
        gridNodesToShow: function() {
            return {
                subNumber: this.gridNodes.subNumber,
                client: this.gridNodes.client,
                type: this.gridNodes.type,
                trainer: this.gridNodes.trainer,
                begDate: this.gridNodes.begDate,
                endDate: this.gridNodes.endDate,
                begTime: this.gridNodes.begTime,
                note: this.gridNodes.note
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.info-frame {
    position: fixed;
    top: 5%;
    bottom: 5%;
    left: 15%;
    right: 15%;
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.884);
    background: #202225;
    border: 4px solid rgb(234, 230, 236);
    
    .info-wrapper {
        position: relative;
        display: flex;
        align-items: flex-start;
        justify-content: center;

        .static-info-rows {
            margin: 0px 0px 0px 15px;
            
            div {
                display: flex;
                align-items: center;
                margin-top: 10px;
                height: 30px;
                font-size: 18px;
            }
        }

        .dynamic-info-rows {
            margin: 0px 0px 0px 15px;
            display: flex;
            flex-direction: column;
            .user-input {
                color:white;
                background: rgba(178, 34, 34, 0);
                height: 30px;
                margin-top: 10px;
                padding: 0px;
                padding-left: 5px;
                background: rgba(178, 34, 34, 0);
                border: none;
                color:white;
                font-size: 16px;
                width: 300px;

                &.bordered {
                    border: 1px solid white;
                    margin-top: 8px;
                }
            }
        }

        .camera {
            margin-left: 30px;
        }
    }

    .close-button {
        display: flex;
        padding-right: 30px;
        padding-top: 5px;
        justify-content: flex-end;
        font-size: 35px;
        cursor: pointer;
    }

    .edit-buttons-wrapper {
        display: flex;
        justify-content: space-around;
        margin: 40px 150px 0px 150px;

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
    .add-button-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 40px;

        .add-button {
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
    }
}

@media (min-width: 1300px) {
    .info-frame {

        .info-wrapper {
            .dynamic-info-rows {
                .user-input {
                    width: 400px;
                }
            }
        }
    }
}
</style>