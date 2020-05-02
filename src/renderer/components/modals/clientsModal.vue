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
                            v-show="!((key === 'firstVisitDate') && (isAddOperation || isEditOperation))"
                        >
                        </input>
                        <div v-show="(isEditOperation || isAddOperation)" class="date-pick-wrapper">
                            <date-picker
                                v-model="pickedDate"
                                type="date"
                                @input="datePicked"
                            />
                        </div>
                    </div>

                    <camera class="camera" v-bind:videoContent="gridNodes.photo"/>
                </div>

                <div class="add-button-wrapper" v-if="isAddOperation">
                    <button class="confirm-add-type-button" @click="addClient">Добавить</button>
                </div>

                <div class="edit-button-wrapper" v-if="!isAddOperation">
                    <button class="edit-type-button" @click="editClient">{{ isEditOperation ? 'Применить' : 'Изменить' }}</button>
                    <button class="remove-type-button" @click="removeClientClicked">Удалить</button>
                </div>

                <confirm-modal
                    v-show="confirmVisible"
                    @agreeClose="removeClient"
                    @disagreeClose="confirmVisible = false"
                    v-bind:questionString="'Удалить клиента?'"
                />
            </div>
        </div>
    </div>
    
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

import camera from '../frames/Webcam'
import confirmModal from './confirmModal'
import { mapGetters } from 'vuex'

import validate from '../../validation/clientValidation'

export default {
    components: {
        camera,
        'confirm-modal': confirmModal,
        'date-picker': DatePicker
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
        pickedDate: {
            set(value) {
                return value
            },
            get() {
                var parms = String(this.gridNodes.firstVisitDate).split('.')
                var postDate = new Date(parms[2], parms[1] - 1, parseInt(parms[0]));
                console.log(postDate)
                return postDate
            }
        },
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
                howToFind: this.gridNodes.howToFind,
                inviterPhone: this.gridNodes.inviterPhone,
                note: this.gridNodes.note,
                firstVisitDate: this.gridNodes.firstVisitDate
            }
        }
    },
    methods: {
        datePicked(date) {
            var mnth = ("0" + (date.getMonth() + 1)).slice(-2)
            var day = ("0" + date.getDate()).slice(-2)
            this.gridNodes.firstVisitDate =  [day, mnth, date.getFullYear()].join(".")
        },
        async editClient() {
            if (this.isEditOperation) {
                var { isCorrect, alertMessage } = validate(this.gridNodes)

                if(!isCorrect) {
                    alert(alertMessage)
                    return
                }

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

            this.$emit('modalCloseX');
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
@import '../../styles/modalStyles/clientsModal.scss';
</style>