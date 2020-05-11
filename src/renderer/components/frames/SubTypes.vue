<template>
    <div class="main-frame">
        <search-panel
            v-bind:options="searchOptions"
            @search="setUserInput"
        />

        <div class="search-result-frame">
            <div class="search-result-header">
                <div v-for="node in gridColumnsToShow" :key="node">
                    {{ node }}
                </div>
            </div>
            <div 
                class="search-result"
                v-for="(node, idx) in subTypesToShow"
                :key="idx"
                @click="onRowClicked(idx)"
            >
                <div v-for="value in node" :key="value">
                    {{ value }}
                </div>
            </div>
        </div>

        <div class="add-type-wrapper">
            <button class="add-type-button" @click="addSubType">Добавить вид абонемента</button>
        </div>

        <subTypesModal
        v-bind:gridRows="gridColumns"
        v-bind:gridNodes="modalInfo"
        v-bind:isAddOperation="isAddOperation"
        v-show="modalShow"
        @modalClose="modalClose"
        @modalCloseX="modalShow = false"
        />
    </div>
</template>

<script>
import subTypesModal from '../modals/subTypesModal'
import searchPanel from '../other/searchPanel'

export default {
    components: {
        subTypesModal,
        'search-panel': searchPanel
    },
    created: function() {
        this.search()
    },
    data() {
        return {
            gridColumns: [
                'id',
                'Наименование',
                'Цена',
                'Количество занятий'
            ],
            subTypesList: [],
            userInput: '',
            searchCriterion: '',
            modalShow: false,
            modalInfo: {},
            isAddOperation: false,
            searchOptions: [
                'Наименование'
            ]
        }
    },
    methods: {
        setUserInput(searchCriterion, userInput) {
            this.userInput = userInput
            this.searchCriterion = searchCriterion
            this.search()
        },
        modalClose() {
            this.modalShow = false;
            this.search()
        },
        async search() {
            let res
            this.subTypesList = [];

            if(this.userInput) {
                res = await this.$axios.post('https://localhost:3000/v1/types/findByTitle', {
                    title: this.userInput
                })
            } else {
                res = await this.$axios.get('https://localhost:3000/v1/types/getLatest')
            }
            
            res.data.forEach(element => {
                this.subTypesList.push({
                    id: element.id,
                    title: element.title,
                    cost: element.cost,
                    training: element.training,
                })
            });

            this.subTypesList = this.subTypesList.reverse();
        },
        onRowClicked(idx) {
            this.isAddOperation = false
            this.modalShow = true;
            this.modalInfo = this.subTypesList[idx];
        },
        addSubType() {
            this.modalShow = true
            this.isAddOperation = true
            this.modalInfo = {
                id: '',
                title: '',
                cost: '',
                training: ''
            }
        }
    },
    computed: {
        gridColumnsToShow: function() {
            return this.gridColumns.filter(function(item) {
                return item !== 'id'
            })
        },
        subTypesToShow: function() {
            var newList = []
            this.subTypesList.forEach(node => {
                newList.push({
                    title: node.title,
                    cost: node.cost,
                    training: node.training
                })
            });

            return newList
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/frameStyles/subTypes.scss';
</style>