<template>
    <div class="info-frame">
        <div class="close-button" @click="close">x</div>
        <div class="info-wrapper">
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
            <camera 
            class="camera"
            v-if="isAddOperation"
            @changePictureState="changePictureState"
            v-bind:isPictureTaken="isPictureTaken"
            @takePictureClicked="takePictureClicked"
            />
            
        </div>
        <div class="add-button-wrapper" v-if="isAddOperation">
            <button class="add-button" @click="addClient">Добавить</button>
        </div>
        <div class="edit-buttons-wrapper" v-if="!isAddOperation">
            <button class="change-button" @click="editClient">{{ isEditable ? 'Применить' : 'Изменить' }}</button>
            <button class="remove-button">Удалить</button>
        </div>
    </div>
</template>

<script>
import camera from '../Webcam'

export default {
    components: {
        camera
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
            clientPhoto: [],
            isPictureTaken: false
        }
    },
    methods: {
        changePictureState() {
            this.isPictureTaken = !this.isPictureTaken
        },
        editClient() {
            if (this.isEditable) {
                console.log('saved')
            }
            this.isEditable = !this.isEditable
        },
        close() {
            this.isPictureTaken = false
            this.$emit('modalClose');
        },
        async addClient() {
            if(!this.validate()) {
                return
            }

            if(this.gridNodes.howToFind.length === 0) {
                this.gridNodes.howToFind = '-'
            }

            if(this.gridNodes.inviterPhone.length === 0) {
                this.gridNodes.inviterPhone = '-'
            }

            if(this.gridNodes.note.length === 0) {
                this.gridNodes.note = '-'
            }

            var parms = this.gridNodes.firstVisitDate.split(/[./-]/);
            var postDate = new Date(parms[2], parms[1] - 1, parseInt(parms[0]) + 1);

            await this.$axios.post('http://localhost:3000/v1/clients/add', {
                fio: this.gridNodes.fio,
                phone: this.gridNodes.phoneNum,
                first_visit_date: postDate,
                how_find: this.gridNodes.howToFind,
                inv_phone: this.gridNodes.inviterPhone,
                note: this.gridNodes.note,
                photo: this.clientPhoto
            })
            this.isPictureTaken = false

            this.$emit('modalClose');
        },
        validate() {
            var isCorrect = true
            var alertString = ''

            if(this.gridNodes.fio.length === 0) {
                alertString += '• Введите ФИО\n'
                isCorrect = false
            } else if(this.gridNodes.fio.length > 100) {
                alertString += '• Слишком длинное ФИО\n'
                isCorrect = false
            }

            if(this.gridNodes.phoneNum.length === 0) {
                alertString += '• Введите номер телефона\n'
                isCorrect = false
            } else if(this.gridNodes.phoneNum.length > 18) {
                alertString += '• Слишком длинный номер телефона\n'
                isCorrect = false
            }

            if(this.clientPhoto.length === 0) {
                alertString += '• Сделаейте снимок\n'
                isCorrect = false
            }

            if(this.gridNodes.inviterPhone.length > 18) {
                alertString += '• Слишком длинный номер телефона пригласившего\n'
                isCorrect = false
            }

            if(this.gridNodes.howToFind.length > 16) {
                alertString += "• Слишком длинный пункт 'Откуда узнали' \n"
                isCorrect = false
            }

            if(this.gridNodes.note.length > 200) {
                alertString += "• Слишком длинное примечание \n"
                isCorrect = false
            }

            var dateReg = /^\d{2}[./-]\d{2}[./-]\d{4}$/
            if(this.gridNodes.firstVisitDate.match(dateReg) === null) {
                alertString += '• Дата не соответствует формату (дд.мм.гггг)'
                isCorrect = false
            }

            if(!isCorrect) {
                alert(alertString)
            }
            return isCorrect
        },
        takePictureClicked(clientPhoto) {
            this.clientPhoto = clientPhoto
            console.log(this.clientPhoto)
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
                
                &.bordered {
                    border: 1px solid white;
                    margin-top: 8px;
                }
            }

            input {
                padding: 0px;
                padding-left: 5px;
                background: rgba(178, 34, 34, 0);
                border: none;
                color:white;
                font-size: 16px;
                width: 300px;
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

@media (max-width: 1300px) {
    .info-frame {
        left: 5%;
        right: 5%;

        .info-wrapper {
            .dynamic-info-rows {
                input {
                    width: 150px;
                }
            }
        }
    }
}


</style>