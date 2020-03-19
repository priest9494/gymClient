<template>
    <div class="sub-types-frame">
        <div class="user-input">
            <div class="search-container">
                <input class="search-input" type="text" placeholder="Наименование" v-model="userInput" @input="search">
            </div>
        </div>

        <div class="sub-list">
            <div class="search-result">
                <div v-for="k in 3" :key="k">
                    {{ gridColumns[k - 1] }}
                </div>
            </div>
            <div class="search-result" v-for="(item, idx) in subTypesList" :key="idx" @click="onRowClicked(idx)">
                <div v-for="k in 3" :key="k">
                    {{ Object.values(item)[k - 1] }}
                </div>
            </div>
        </div>

        <div class="button-wrapper">
            <button class="add-sub-type">Добавить вид абонемента</button>
        </div>

        <subTypesModal
        v-bind:gridRows="gridColumns"
        v-bind:gridNodes="modalInfo"
        v-show="modalShow"
        @modalClose="modalClose"
        />
    </div>
</template>

<script>
import subTypesModal from './modals/subTypesModal'

export default {
    components: {
        subTypesModal
    },
    created: function() {
        this.search()
    },
    data() {
        return {
            gridColumns: [
                'Наименование',
                'Цена',
                'Количество занятий'
            ],
            subTypesList: [],
            userInput: '',
            modalShow: false,
            modalInfo: []
        }
    },
    methods: {
        modalClose() {
            this.modalShow = false;
        },
        async search() {
            let res
        
            res = await this.$axios.post('http://localhost:3000/v1/types/findByTitle', {
                title: this.userInput
            })

            console.log(res);
            this.subTypesList = [];

            res.data.forEach(element => {
                this.subTypesList.push({
                    title: element.title,
                    cost: element.cost,
                    training: element.training,
                })
            });
        },
        onRowClicked(idx) {
            this.modalShow = true;
            this.modalInfo = this.subTypesList[idx];
        }
    }
}
</script>

<style lang="scss" scoped>
.sub-types-frame {
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

    .sub-list {
        background: #27282c;
        width: 95%;
        max-height: 55%;
        margin: auto;
        overflow-y: auto;
        overflow-x: auto;

        .search-result {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
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

        .add-sub-type {
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