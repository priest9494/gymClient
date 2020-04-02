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
            modalShow: false,
            modalInfo: {},
            isAddOperation: false,
            searchOptions: [
                'Наименование'
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
            this.subTypesList = [];

            if(userInput) {
                res = await this.$axios.post('http://localhost:3000/v1/types/findByTitle', {
                    title: userInput
                })
            } else {
                res = await this.$axios.get('http://localhost:3000/v1/types/getLatest')
            }
            
            res.data.forEach(element => {
                this.subTypesList.push({
                    id: element.id,
                    title: element.title,
                    cost: element.cost,
                    training: element.training,
                })
            });
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