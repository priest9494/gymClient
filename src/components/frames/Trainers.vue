<template>
    <div class="trainers-frame">
        <div class="user-input">
            <div class="search-container">
                <input class="search-input" type="text" placeholder="ФИО" v-model="userInput" @input="search">
            </div>
        </div>

        <div class="trainer-list">
            <div class="search-result">
                <div v-for="k in 2" :key="k">
                    {{ gridColumns[k] }}
                </div>
            </div>
            <div class="search-result" v-for="(item, idx) in trainersList" :key="idx" @click="onRowClicked(idx)">
                <div v-for="k in 2" :key="k">
                    {{ Object.values(item)[k] }}
                </div>
            </div>
        </div>

        <div class="button-wrapper">
            <button class="add-trainer" @click="addTrainer">Добавить тренера</button>
        </div>

        <trainersModal
        v-bind:gridRows="gridColumns"
        v-bind:gridNodes="modalInfo"
        v-bind:isAddOperation="isAddOperation"
        v-show="modalShow"
        @modalClose="modalClose"
        />
    </div>
</template>

<script>
import trainersModal from '../modals/trainersModal'

export default {
    components: {
        trainersModal
    },
    created: function() {
        this.search()
    },
    data() {
        return {
            gridColumns: [
                'id',
                'ФИО',
                'Дата рождения'
            ],
            trainersList: [],
            userInput: '',
            modalShow: false,
            modalInfo: [],
            isAddOperation: false
        }
    },
    methods: {
        modalClose() {
            this.modalShow = false;
            this.search()
        },
        async search() {
            let res
            this.trainersList = [];

            res = await this.$axios.post('http://localhost:3000/v1/trainers/findByFio', {
                fio: this.userInput
            })

            res.data.forEach(element => {
                this.trainersList.push({
                    id: element.id,
                    fio: element.fio,
                    dateBirth: this.convert(element.date_birth)
                })
            });
        },
        async addTrainer() {
            this.modalShow = true
            this.isAddOperation = true
            this.modalInfo = {
                id: '',
                fio: '',
                dateBirth: ''
            }
        },
        onRowClicked(idx) {
            this.isAddOperation = false
            this.modalShow = true
            this.modalInfo = this.trainersList[idx]
        },
        convert(str) {
            var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
            return [day, mnth, date.getFullYear()].join(".");
        }
    }
}
</script>

<style lang="scss" scoped>
.trainers-frame {
    width: 100%;
    height: calc(100vh - 74px);
    background: #2f3136;
    position: relative;
    color: #adbbbe;

    .user-input {
        display: flex;
        justify-content: center;
        padding: 10px 0px 10px 0px;

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

    .trainer-list {
        background: #27282c;
        width: 95%;
        max-height: 55%;
        margin: auto;
        overflow-y: auto;
        overflow-x: auto;

        .search-result {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
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

    .button-wrapper {
        text-align: center;
        margin-top: 10px;

        .add-trainer {
            padding: 20px;
            background: #575756;
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
            font-size: 1.1em;
        }
    }
}
</style>