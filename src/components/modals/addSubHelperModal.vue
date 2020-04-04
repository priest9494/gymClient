<template>
    <div class="helper-shadow">
        <div class="helper-frame">
            <div class="helper-header">
                <div class="close-button" @click="$emit('modalClose')">x</div>
                <div class="helper-title">
                    {{ helperTitle }}
                </div>
            </div>
            <search-panel
                v-bind:options="currentOption"
                @search="search"
            />
            <div class="helper-body">
                <div class="search-result-header" :class="{ 'types': currentOptionKey === 'types'}">
                    <div
                        v-for="item in gridColumns"
                        :key="item"
                    >
                        {{ item }}
                    </div>
                </div>

                <div 
                    class="search-result"
                    :class="{ 'types': currentOptionKey == 'types' }"
                    v-for="(node, idx) in gridNodesToShow"
                    :key="idx"
                    @click="onRowClicked(idx)"
                >
                    <div v-for="value in node" :key="value">
                        {{ value }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import searchPanel from '../other/searchPanel'

import convert from '../../util/dateConvert'

export default {
    components: {
        'search-panel': searchPanel
    },
    props: {
        helperTitle: String,
        currentOptionKey: String
    },
    created() {
        this.search()
    },
    data() {
        return {
            searchOptions: {
                clients: [
                    'ФИО',
                    'Номер телефона'
                ],
                types: [
                    'Наименование'
                ],
                trainers: [
                    'ФИО'
                ]
            },
            gridNodes: []
        }
    },
    computed: {
        gridNodesToShow: function() {
            var newList = []
            if(this.currentOptionKey === 'clients') {
                this.gridNodes.forEach(node => {
                    newList.push({
                        fio: node.fio,
                        phoneNum: node.phoneNum
                    })
                });
            }

            if(this.currentOptionKey === 'types') {
                this.gridNodes.forEach(node => {
                    newList.push({
                        title: node.title,
                        cost: node.cost,
                        training: node.training,
                    })
                });
            }

            if(this.currentOptionKey === 'trainers') {
                this.gridNodes.forEach(node => {
                    newList.push({
                        fio: node.fio,
                        dateBirth: node.dateBirth
                    })
                });
            }
            
            return newList
        },
        currentOption() {
            return this.searchOptions[this.currentOptionKey]
        },
        gridColumns() {
            if(this.currentOptionKey === 'clients') {
                return [
                    'ФИО',
                    'Номер телефона'
                ]
            } else if(this.currentOptionKey === 'types') {
                return [
                    'Наименование',
                    'Цена',
                    'Количество занятий'
                ]
            } else {
                return [
                    'ФИО',
                    'Дата рождения'
                ]
            }
        }
    },
    methods: {
        onRowClicked(idx) {
            this.$emit('rowChoosed', this.gridNodes[idx])
        },
        search(searchCriterion, userInput) {
            if(this.currentOptionKey === 'clients') {
                console.log('search client!!')
                this.searchClient(searchCriterion, userInput)
            } else if(this.currentOptionKey === 'types') {
                this.searchType(userInput)
            } else {
                this.searchTrainer(searchCriterion, userInput)
            }
            //console.log(this.currentOptionKey + ' ' + searchCriterion + ' ' + userInput)
        },
        async searchClient(searchCriterion, userInput) {
            let res
            this.gridNodes = []

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
                this.gridNodes.push({
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
            
            this.gridNodes = this.gridNodes.reverse()
        },
        async searchType(userInput) {
            let res
            this.gridNodes = [];
            
            if(userInput) {
                res = await this.$axios.post('http://localhost:3000/v1/types/findByTitle', {
                    title: userInput
                })
            } else {
                res = await this.$axios.get('http://localhost:3000/v1/types/getLatest')
            }
            
            res.data.forEach(element => {
                this.gridNodes.push({
                    id: element.id,
                    title: element.title,
                    cost: element.cost,
                    training: element.training,
                })
            });
            
            this.gridNodes = this.gridNodes.reverse()
        },
        async searchTrainer(searchCriterion, userInput) {
            let res
            this.gridNodes = [];

            if(userInput) {
                res = await this.$axios.post('http://localhost:3000/v1/trainers/findByFio', {
                    fio: userInput
                })
            } else {
                res = await this.$axios.get('http://localhost:3000/v1/trainers/getLatest')
            }
            
            res.data.forEach(element => {
                this.gridNodes.push({
                    id: element.id,
                    fio: element.fio,
                    dateBirth: convert(element.date_birth)
                })
            });
            console.log(res)
            this.gridNodes = this.gridNodes.reverse()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/modalStyles/addSubHelperModal.scss'
</style>
