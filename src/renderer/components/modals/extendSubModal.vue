<template>
    <div class="main-shadow">
        <div class="extend-frame">
            <div class="close" @click="$emit('extendClose')">x</div>
            <div class="lines-wrapper">
                <div>Выберите диапазон дат</div>
                <div class="user-input-wrapper">
                    <date-picker
                        v-model="pickedDate"
                        range
                        @input="datePicked"
                    />
                </div>
            </div>
            <div class="button-wrapper">
                <button class="extend-type-button" @click="acceptClicked">
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
    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

import confirmModal from './confirmModal'

export default {
    components: {
        'confirm-modal': confirmModal,
        'date-picker': DatePicker
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
            pickedDate: ''
        }
    },
    methods: {
        datePicked() {
            var mnth = ("0" + (this.pickedDate[0].getMonth() + 1)).slice(-2)
            var day = ("0" + this.pickedDate[0].getDate()).slice(-2)
            this.bDate = [day, mnth, this.pickedDate[0].getFullYear()].join(".")

            var mnth = ("0" + (this.pickedDate[1].getMonth() + 1)).slice(-2)
            var day = ("0" + this.pickedDate[1].getDate()).slice(-2)
            this.eDate = [day, mnth, this.pickedDate[1].getFullYear()].join(".")

            console.log(this.bDate, this.eDate)
        },
        acceptClicked() {
            this.confirmVisible = true
        },
        accept() {
            this.$emit('extendConfirmed', this.bDate, this.eDate)
            this.confirmVisible = false
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/modalStyles/extendSubModal.scss';
</style>