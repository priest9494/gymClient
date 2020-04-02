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
                v-model="gridNodes[key]">
            </div>

            <camera class="camera" v-bind:videoContent="gridNodes.photo"/>
        </div>

        <div class="add-button-wrapper" v-if="isAddOperation">
            <button class="add-button" @click="addClient">Добавить</button>
        </div>

        <div class="edit-buttons-wrapper" v-if="!isAddOperation">
            <button class="change-button" @click="editClient">{{ isEditOperation ? 'Применить' : 'Изменить' }}</button>
            <button class="remove-button" @click="removeClientClicked">Удалить</button>
        </div>

        <confirmModal
            v-show="confirmVisible"
            @agreeClose="removeClient"
            @disagreeClose="confirmVisible = false"
            v-bind:questionString="'Удалить клиента?'"
        />
    </div>
</template>

<script>
import camera from '../frames/Webcam'
import confirmModal from './confirmModal'
import { mapGetters } from 'vuex'

import validate from '../../validation/clientValidation'

export default {
    components: {
        camera,
        confirmModal
    },
    name: 'get-full-info-modal',
    props: {
        gridRows: Array,
        gridNodes: Object
    },
    data() {
        return {
            confirmVisible: false
        }
    },
    computed: {
        ...mapGetters({
            isAddOperation: 'clientsFrame/isAddOperation',
            isEditOperation: 'clientsFrame/isEditOperation',
            pictureFromDatabase: 'clientsFrame/pictureFromDatabase',
            clientPhoto: 'clientsFrame/clientPhoto'
        }),
        gridRowsToShow: function() {
            return this.gridRows.filter(function(item) {
                return item !== 'id'
            })
        },
        gridNodesToShow: function() {
            return {
                fio: this.gridNodes.fio,
                phoneNum: this.gridNodes.phoneNum,
                firstVisitDate: this.gridNodes.firstVisitDate,
                howToFind: this.gridNodes.howToFind,
                inviterPhone: this.gridNodes.inviterPhone,
                note: this.gridNodes.note
            }
        }
    },
    methods: {
        async editClient() {
            if (this.isEditOperation) {
                if(!this.validate()) {
                    return
                }
                this.fillSpaces()

                var parms = this.gridNodes.firstVisitDate.split(/[./-]/);
                var postDate = new Date(parms[2], parms[1] - 1, parseInt(parms[0]) + 1);
                
                // Отправляем пустую строку заместо фото, чтобы повторно не пересылать полученное фото
                var photoSender = this.clientPhoto ? this.clientPhoto : ''

                await this.$axios.post('http://localhost:3000/v1/clients/edit', {
                    id: this.gridNodes.id,
                    fio: this.gridNodes.fio,
                    phone: this.gridNodes.phoneNum,
                    first_visit_date: postDate,
                    how_find: this.gridNodes.howToFind,
                    inv_phone: this.gridNodes.inviterPhone,
                    note: this.gridNodes.note,
                    photo: photoSender
                })

                this.$store.commit('clientsFrame/setIsPictureTaken', false)
                this.$emit('modalClose');
            } else {
                this.$store.commit('clientsFrame/setIsPictureTaken', true)
            }
            this.$store.commit('clientsFrame/setIsEditOperation', !this.isEditOperation)
        },
        close() {
            this.$store.commit('clientsFrame/setIsAddOperation', false)
            this.$store.commit('clientsFrame/setIsEditOperation', false)
            this.$store.commit('clientsFrame/setIsPictureTaken', false)
            this.$store.commit('clientsFrame/setClientPhoto', '')

            this.$emit('modalClose');
        },
        async addClient() {
            var { isCorrect, alertMessage } = validate(this.gridNodes)

            if(!isCorrect) {
                alert(alertMessage)
                return
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
            this.$store.commit('clientsFrame/setIsPictureTaken', false)

            this.$emit('modalClose');
        },
        removeClientClicked() {
            this.confirmVisible = true
        },
        async removeClient() {
            this.confirmVisible = false
            await this.$axios.get('http://localhost:3000/v1/clients/remove/' + this.gridNodes.id)
            this.$emit('modalClose')
        },
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

@media (max-width: 1300px) {
    .info-frame {
        left: 5%;
        right: 5%;

        .info-wrapper {
            .dynamic-info-rows {
                .user-input {
                    width: 150px;
                }
            }
        }
    }
}
</style>