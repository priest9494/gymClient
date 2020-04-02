<template>
    <div class="clients-frame">
        <search-panel
            v-bind:options="searchOptions"
            @search="search"
        />
        
        <div class="client-list">
            <div class="search-result">
                <div
                    class="search-result-header"
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
            <button class="add-client" @click="addClient">Добавить клиента</button>
        </div>

        <client-modal
            v-bind:gridRows="gridColumns"
            v-bind:gridNodes="modalInfo"
            v-show="modalShow"
            @modalClose="modalClose"
        />
    </div>
</template>

<script>
import searchPanel from '../other/searchPanel'
import clientModal from '../modals/clientsModal'
import { mapGetters } from 'vuex'

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
            modalInfo: {}
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
        addClient() {
            this.$store.commit('clientsFrame/setIsAddOperation', true)
            this.$store.commit('clientsFrame/setIsPictureTaken', false)

            this.modalShow = true
            this.modalInfo = {
                id: '',
                fio: '',
                phoneNum: '',
                firstVisitDate: this.convert(new Date()),
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
        async search(searchCriterion, userInput) {
            let res
            this.clientList = []
            console.log(searchCriterion + '   ' + userInput)

            if(searchCriterion === 'ФИО' && userInput) {
                res = await this.$axios.post('http://localhost:3000/v1/clients/getClientByFio', {
                    fio: userInput
                })
            } else if(userInput){
                res = await this.$axios.post('http://localhost:3000/v1/clients/getClientByPhoneNumber', {
                    phone_number: userInput
                })
            } else {
                res = await this.$axios.get('http://localhost:3000/v1/clients/getLatest')
            }

            res.data.forEach(element => {
                this.clientList.push({
                    id: element.id,
                    fio: element.fio,
                    phoneNum: element.phone_number,
                    firstVisitDate: this.convert(element.first_visit_date),
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
        },
        convert(str) {
            var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
            return [day, mnth, date.getFullYear()].join(".")
        }
    }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Raleway:400,700,900');
@import url('https://fonts.googleapis.com/css?family=Ubuntu+Condensed');

.clients-frame {
    width: 100%;
    height: calc(100vh - 74px);
    background: #2f3136;
    position: relative;
    color: #adbbbe;

    .user-input {
        display: flex;
        justify-content: center;
        padding: 10px 0px 10px 0px;

        .criterion-select {
            outline:none;
            background: #27282c;
            color: #adbbbe;
            border-radius: 50px;
            border: 1px solid #26272b;
            padding: 10px;
            transition: all 0.3s;

            &:hover,
            &:focus {
                padding: 10px 25px;
                color: #c1cbce;
            }
        }

        .search-container {
            width: 22%;
            margin: 0px 70px 0px 70px;
            .search-input {
                padding: 12px 24px;
                width: 100%;
                transition: transform 250ms ease-in-out;
                font-size: 10px;
                line-height: 18px;
                color: #adbbbe;
                background-color: transparent;
                background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-size: 18px 18px;
                background-position: 95% center;
                border-radius: 50px;
                border: 1px solid #575756;
                transition: all 250ms ease-in-out;
                backface-visibility: hidden;
                transform-style: preserve-3d;

                &::placeholder {
                    color: color(#575756 a(0.8));
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                }
            
                &:hover,
                &:focus {
                    outline: 0;
                    border: 1px solid transparent;
                    border-bottom: 1px solid #575756;
                    border-radius: 0;
                    background-position: 100% center;
                }
            }   
        }
    }
    .client-list {
        background: #27282c;
        width: 95%;
        max-height: 55%;
        margin: auto;
        overflow-y: auto;
        overflow-x: auto;

        .search-result {
            display: grid;
            grid-template-columns: repeat(2, 1fr);

            .search-result-header {
                text-align: center;
            }

            &>div {
                padding: 5px 10px;
                border: 1px solid black;
            }

            *::selection {
                background: rgb(255, 1, 1);
                color: black;
            }
        }
    }

    button {
        outline: none;
        font-family: 'Ubuntu Condensed', sans-serif;
        border: 2px solid rgb(0, 0, 0);
        border-radius: 0.6em;
        cursor: pointer;
        font-size: 1.6rem;
        line-height: 1;
        text-transform: uppercase;
        font-weight: 400;
        transition: all 0.3s;
    }

    .add-client-wrapper {
        text-align: center;
        margin: 20px;

        .add-client {
            padding: 20px;
            background: #575756;
            font-size: 1.1em;
        }
    }
}
</style>