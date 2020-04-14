<template>
    <div class="main-frame">
        <search-panel
            v-bind:options="searchOptions"
            @search="setUserInput"
        />
        
        <div class="search-result-frame">
            <div class="search-result-header">
                <div
                    v-for="item in gridColumnsToShow"
                    :key="item"
                >
                    {{ item }}
                </div>
            </div>

            <div 
                class="search-result"
                v-for="(node, idx) in clientListToShow"
                :key="idx"
                @click="onRowClicked(idx)"
            >
                <div v-for="value in node" :key="value">
                    {{ value }}
                </div>
            </div>
        </div>

        <div class="add-client-wrapper">
            <button class="add-type-button" @click="addClient">Добавить клиента</button>
        </div>

        <client-modal
            v-bind:gridRows="gridColumns"
            v-bind:gridNodes="modalInfo"
            v-show="modalShow"
            @modalClose="modalClose"
            @modalCloseX="modalShow = false"
        />
    </div>
</template>

<script>
import searchPanel from '../other/searchPanel'
import clientModal from '../modals/clientsModal'
import { mapGetters } from 'vuex'

import convert from '../../util/dateConvert'

export default {
    components: {
        'client-modal': clientModal,
        'search-panel': searchPanel
    },
    data() {
        return {
            searchOptions: [
                'ФИО',
                'Номер телефона'
            ],
            gridColumns: [
                "id",
                "ФИО",
                "Номер телефона",
                "Дата первого визита",
                "Откуда узнали",
                "Телефон пригласившего",
                "Примечание"
            ],
            clientList: [],
            modalShow: false,
            modalInfo: {},
            userInput: '',
            searchCriterion: ''
        }
    },
    computed: {
        ...mapGetters({
            pictureFromDatabase: 'clientsFrame/pictureFromDatabase'
        }),
        gridColumnsToShow: function() {
            return this.gridColumns.filter(function(item) {
                return item === 'ФИО' || item === 'Номер телефона'
            })
        },
        clientListToShow: function() {
            var newList = []
            this.clientList.forEach(node => {
                newList.push({
                    fio: node.fio,
                    phoneNum: node.phoneNum
                })
            });

            return newList
        }
    },
    created() {
        this.search()
    },
    methods: {
        setUserInput(searchCriterion, userInput) {
            this.userInput = userInput
            this.searchCriterion = searchCriterion
            this.search()
        },
        addClient() {
            this.$store.commit('clientsFrame/setIsAddOperation', true)
            this.$store.commit('clientsFrame/setIsPictureTaken', false)

            this.modalShow = true
            this.modalInfo = {
                id: '',
                fio: '',
                phoneNum: '',
                firstVisitDate: convert(new Date()),
                howToFind: '',
                inviterPhone: '',
                note: ''
            }
        },
        onRowClicked(idx) {
            this.$store.commit('clientsFrame/setIsPictureTaken', true)
            this.$store.commit('clientsFrame/setIsAddOperation', false)
            this.$store.commit('clientsFrame/setIsEditOperation', false)
            this.$store.commit('clientsFrame/setPictureFromDatabase', "data:image/png;base64," + this.clientList[idx].photo)
            
            let ratio = (window.innerHeight < window.innerWidth) ? 16/9 : 9/16
            const picture = document.querySelector('canvas')

            picture.width = (window.innerHeight < 1280) ? window.innerWidth : 1280
            picture.height = window.innerWidth / ratio

            const ctx = picture.getContext('2d')
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'

            var image = new Image();
            image.onload = function() {
                ctx.drawImage(image, 0, 0, picture.width, picture.height);
            };
            image.src = this.pictureFromDatabase
        
            this.modalShow = true
            this.modalInfo = this.clientList[idx]
        },
        async search() {
            let res
            this.clientList = []

            if(this.searchCriterion === 'ФИО' && this.userInput) {
                res = await this.$axios.post('http://localhost:3000/v1/clients/getClientByFio', {
                    fio: this.userInput
                })
            } else if(this.userInput){
                res = await this.$axios.post('http://localhost:3000/v1/clients/getClientByPhoneNumber', {
                    phone_number: this.userInput
                })
            } else {
                res = await this.$axios.get('http://localhost:3000/v1/clients/getLatest')
            }

            res.data.forEach(element => {
                this.clientList.push({
                    id: element.id,
                    fio: element.fio,
                    phoneNum: element.phone_number,
                    firstVisitDate: convert(element.first_visit_date),
                    howToFind: element.how_to_find,
                    inviterPhone: element.inviter_phone,
                    note: element.note,
                    photo: element.photo
                })
            });
            
            this.clientList = this.clientList.reverse()
            this.clientList.forEach(element => {
                if(element.inviterPhone == null) {
                    element.inviterPhone = 'не указано'
                }
                if(element.note == null) {
                    element.note = 'не указано'
                }
                if(element.howToFind  == null) {
                    element.howToFind  = 'не указано'
                }
            });
        },
        modalClose() {
            this.modalShow = false
            this.search()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/frameStyles/clients.scss';
</style>