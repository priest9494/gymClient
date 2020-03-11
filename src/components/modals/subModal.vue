<template>
    <div class="info-frame">
        <div class="info-borderer">
            <div class="static-info-rows">
                <div v-for="row in gridRows" :key="row"> {{ row }}</div>
            </div>
            <div class="dynamic-info-rows">
                <input type="text" v-for="row in gridNodes" :key="row" :value="row"> 
            </div>
            <div class="img-wrapper">
                <img src="../../assets/clientPictureTemplate.jpg" alt="template">
            </div> 
            <div class="buttons">
                <button class="change-button">Изменить</button>
                <button class="remove-button">Удалить</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'get-full-info-modal',
    props: {
        gridRows: Array,
        gridNodes: Array
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.info-frame {
    position: fixed;
    top: 15%;
    bottom: 15%;
    left: 10%;
    right: 10%;

    .info-borderer {
        height: 100%;
        width: 100%;
        background: rgb(27, 14, 14);
        display: flex;
        justify-content: center;
        align-items: flex-start;

        .static-info-rows {
            margin: 10px 0px 0px 15px;

            div {
                margin-top: 10px;
            }
        }

        .dynamic-info-rows {
            margin: 10px 0px 0px 15px;
            display: flex;
            flex-direction: column;
            input {
                color:white;
                font-weight: 300;
                background: rgba(178, 34, 34, 0);
                border: none;
                margin-top: 12px;
            }
        }

        .img-wrapper {
            margin-top: 5%;
            margin-left: 5%;
        }

        .buttons {
            display: flex;
            align-self: flex-end;
            justify-content: center;
        }
    }
    
}

</style>