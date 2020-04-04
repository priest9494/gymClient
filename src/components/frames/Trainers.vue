<template>
    <div class="main-frame">
        <search-panel
            v-bind:options="searchOptions"
            @search="search"
        />
        <div class="search-result-frame">
            <div class="search-result">
                <div v-for="node in gridColumnsToShow" :key="node" class="search-result-header">
                    {{ node }}
                </div>
            </div>
            <div 
                class="search-result"
                v-for="(node, idx) in trainersToShow"
                :key="idx"
                @click="onRowClicked(idx)"
            >
                <div v-for="value in node" :key="value">
                    {{ value }}
                </div>
            </div>
        </div>
        <div class="add-trainer-wrapper">
            <button class="add-type-button" @click="addTrainer">Добавить тренера</button>
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
import searchPanel from '../other/searchPanel'

import convert from '../../util/dateConvert'

export default {
    components: {
        trainersModal,
        'search-panel': searchPanel
    },
    created: function() {
        this.search()
    },
    computed: {
        gridColumnsToShow: function() {
            return this.gridColumns.filter(function(item) {
                return item !== 'id'
            })
        },
        trainersToShow: function() {
            var newList = []
            this.trainersList.forEach(node => {
                newList.push({
                    fio: node.fio,
                    dateBirth: node.dateBirth
                })
            });

            return newList
        }
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
            modalInfo: {},
            isAddOperation: false,
            searchOptions: [
                'ФИО'
            ]
        }
    },
    methods: {
        modalClose() {
            this.modalShow = false;
            this.search()
        },
        async search(searchCriterion, userInput) {
            let res
            this.trainersList = [];
            if(!userInput) {
                res = await this.$axios.get('http://localhost:3000/v1/trainers/getLatest')
            } else {
                res = await this.$axios.post('http://localhost:3000/v1/trainers/findByFio', {
                    fio: userInput
                })
            }

            res.data.forEach(element => {
                this.trainersList.push({
                    id: element.id,
                    fio: element.fio,
                    dateBirth: convert(element.date_birth)
                })
            });

            this.trainersList = this.trainersList.reverse()
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
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/frameStyles/trainers.scss';
</style>