<template>
    <div class="info-frame">
        <div class="info-borderer">
            <div class="static-info-rows">
                <div v-for="k in 6" :key="k">{{ gridRows[k] }}</div>
            </div>
            <div class="dynamic-info-rows">
                <input class="user-input" :class="{ 'bordered': isEditable || isAddOperation }" type="text" v-model="gridNodes.fio" :disabled="!(isEditable || isAddOperation)">
                <input class="user-input" :class="{ 'bordered': isEditable || isAddOperation }" type="text" v-model="gridNodes.phoneNum" :disabled="!(isEditable || isAddOperation)">
                <input class="user-input" :class="{ 'bordered': isEditable || isAddOperation }" type="text" v-model="gridNodes.firstVisitDate" :disabled="!(isEditable || isAddOperation)">
                <input class="user-input" :class="{ 'bordered': isEditable || isAddOperation }" type="text" v-model="gridNodes.howToFind" :disabled="!(isEditable || isAddOperation)">
                <input class="user-input" :class="{ 'bordered': isEditable || isAddOperation }" type="text" v-model="gridNodes.inviterPhone" :disabled="!(isEditable || isAddOperation)">
                <input class="user-input" :class="{ 'bordered': isEditable || isAddOperation }" type="text" v-model="gridNodes.note" :disabled="!(isEditable || isAddOperation)">
            </div>
            <img src="../../assets/clientPictureTemplate.jpg" alt="template" v-if="!isAddOperation">
            <div class="edit-buttons-wrapper" v-if="!isAddOperation">
                <button class="extend-button">Продлить</button>
                <button class="change-button" @click="editClient">{{ isEditable ? 'Применить' : 'Изменить' }}</button>
                <button class="remove-button">Удалить</button>
            </div>
            <div class="add-button-wrapper" v-if="isAddOperation">
                <button class="add-button" @click="addClient">Добавить</button>
            </div>
            <div class="close-button" @click="close">x</div>
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
            isEditable: false
        }
    },
    methods: {
        editClient() {
            if (this.isEditable) {
                console.log('Сохранено')
            }
            this.isEditable = !this.isEditable
        },
        close() {
            this.$emit('modalClose');
        },
        addClient() {

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

    .info-borderer {
        position: relative;
        height: 100%;
        width: 100%;
        background: #202225;
        border: 4px solid rgb(234, 230, 236);
        
        display: flex;
        justify-content: center;
        align-items: flex-start;

        .static-info-rows {
            margin: 10px 0px 0px 15px;

            div {
                display: flex;
                align-items: center;
                margin-top: 10px;
                height: 30px;
                font-size: 18px;
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
                font-size: 16px;
                width: 200px;
            }
        }

        .edit-buttons-wraper {

        }

        .add-button-wrapper {

        }

        .close-button {
            margin-top: 10px;
            margin-left: auto;
            margin-right: 20px;
            font-size: 25px;
            cursor: pointer;
        }
    }
}

</style>