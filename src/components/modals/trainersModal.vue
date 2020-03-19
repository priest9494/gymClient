<template>
    <div class="info-frame">
        <div class="info-wrapper">
            <div class="static-info-rows">
                <div v-for="row in gridRows" :key="row"> {{ row }}</div>
            </div>
            <div class="dynamic-info-rows">
                <div class="input-wrapper" :class="{'bordered': isEditable}" v-for="row in gridNodes" :key="row">
                    <input type="text" :value="row" :disabled="!isEditable">
                </div>
            </div>
            <div class="close-button" @click="close">x</div>
        </div>
        
        <div class="button-wrapper">
                <button class="change-button" @click="editSubType">{{ isEditable ? 'Применить' : 'Изменить' }}</button>
                <button class="remove-button">Удалить</button>
        </div>
    </div>
</template>


<script>
export default {
    name: 'get-full-info-modal',
    props: {
        gridRows: Array,
        gridNodes: Object
    },
    data() {
        return {
            isEditable: false
        }
    },
    methods: {
        close() {
            this.$emit('modalClose')
        },
        editSubType() {
            if (this.isEditable) {
                console.log('Сохранено')
            }
            this.isEditable = !this.isEditable
        }
    }
}
</script>

<style lang="scss" scoped>
.info-frame {
    position: fixed;
    top: 30%;
    bottom: 30%;
    left: 30%;
    right: 30%;
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.884);
    background: #202225;
    border: 4px solid rgb(234, 230, 236);

    .info-wrapper {
        position: relative;
        height: 80%;
        width: 100%;

        display: flex;
        align-items: flex-start;

        .static-info-rows {
            margin: 10px 0px 0px 50px;

            div {
                margin-top: 10px;
                height: 30px;
                font-size: 12px;
            }
        }

        .dynamic-info-rows {
            margin: 10px 0px 0px 15px;
            display: flex;
            flex-direction: column;
            .input-wrapper {
                color:white;
                background: rgba(178, 34, 34, 0);
                height: 30px;
                margin-top: 8px;

                &.bordered {
                    border: 1px solid white;
                    margin-top: 8px;
                }
            }

            input {
                padding: 0px;
                background: rgba(178, 34, 34, 0);
                border: none;
                color:white;
                font-size: 12px;
                width: 200px;
            }
        }

        .close-button {
            margin-top: 10px;
            margin-left: auto;
            margin-right: 20px;
            font-size: 25px;
            cursor: pointer;
        }
    }
    .button-wrapper {
        display: flex;
        justify-content: space-around;
        margin-bottom: 10px;

        button {
            background: #adbbbe;
            padding: 5px 10px 5px 10px;
            outline: none;
            font-family: 'Ubuntu Condensed', sans-serif;
            border: 2px solid rgb(0, 0, 0);
            cursor: pointer;
            font-size: 1.2rem;
            line-height: 1;
            text-transform: uppercase;
            font-weight: 400;
            transition: all 0.3s;

            &:hover,
            &:focus {
                background: rgb(200, 248, 188);
                font-size: 1.25rem;
            }
        }
        .change-button {
            background: rgb(166, 250, 144);
            &:hover,
            &:focus {
                background: rgb(200, 248, 188);
            }
        }

        .remove-button {
            background: rgb(248, 128, 128);
            &:hover,
            &:focus {
                background: rgb(252, 169, 169);
            }
        }
    }
    
}

</style>