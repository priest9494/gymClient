<template>
    <div class="extend-frame">
        <div class="close" @click="$emit('extendClose')">x</div>
        <div class="lines-wrapper">
            <div class="labels-wrapper">
                <div>Дата начала</div>
                <div>Дата окончания</div>
            </div>
            <div class="user-input-wrapper">
                <input type="text" :value="begDateUpdated" @input="bDate = $event.target.value">
                <input type="text" :value="endDateUpdated" @input="eDate = $event.target.value">
            </div>
        </div>
        <div class="button-wrapper">
            <button class=".accept-type-button" @click="acceptClicked">
                Применить
            </button>
        </div>
        <confirm-modal
            v-show="confirmVisible"
            @agreeClose="accept"
            @disagreeClose="confirmVisible = false"
            v-bind:questionString="'Продлить абонемент?'"
        />
    </div>
</template>

<script>
import confirmModal from './confirmModal'
import validate from '../../validation/extendSubValidation'

export default {
    components: {
        'confirm-modal': confirmModal
    },
    props: {
        begDate: String,
        endDate: String
    },
    data() {
        return {
            bDate: '',
            eDate: '',
            confirmVisible: false,
            begValidated: '',
            endValidated: ''
        }
        
    },
    computed: {
        begDateUpdated() {
            return this.endDate
        },
        endDateUpdated() {
            if(this.begDate) {
                var begSplit = this.begDate.split('.')
                var endSplit = this.endDate.split('.')

                var bd = new Date(begSplit[2], begSplit[1] - 1, begSplit[0]).getTime()
                var ed = new Date(endSplit[2], endSplit[1] - 1, endSplit[0]).getTime()

                var newDate = new Date(ed + ed - bd)

                var mnth = ("0" + (newDate.getMonth() + 1)).slice(-2)
                var day = ("0" + newDate.getDate()).slice(-2)
                return [day, mnth, newDate.getFullYear()].join(".")
            }
            return ''
        }
    },
    methods: {
        acceptClicked() {
            var validationResult = validate(this.bDate, this.eDate, this.begDateUpdated, this.endDateUpdated)
            
            if(!validationResult.isCorrect) {
                alert(validationResult.alertMessage)
                return
            }
            this.begValidated = validationResult.begDateToValidate
            this.endValidated = validationResult.endDateToValidate
            this.confirmVisible = true
        },
        accept() {
            this.$emit('extendConfirmed', this.begValidated, this.endValidated)
            console.log('extend___________________')
            console.log(this.begValidated)
            console.log(this.endValidated)
            console.log('_________________________')
            this.confirmVisible = false
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/modalStyles/extendSubModal.scss';
</style>