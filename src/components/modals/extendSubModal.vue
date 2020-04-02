<template>
    <div class="extend-frame">
        <div class="close" @click="$emit('extendClose')">x</div>
        <div class="lines-wrapper">
            <div class="labels-wrapper">
                <div>Дата начала</div>
                <div>Дата окончания</div>
            </div>
            <div class="user-input-wrapper">
                <input type="text" v-model="begDate">
                <input type="text" v-model="endDate">
            </div>
        </div>
        <div class="button-wrapper">
            <button class="apply-button">
                Применить
            </button>
        </div>
        
    </div>
</template>

<script>
export default {
    props: {
        begDate: String,
        endDate: String
    },

}
</script>

<style lang="scss" scoped>
.extend-frame {
    background: #202225;
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.884);
    border: 4px solid rgb(234, 230, 236);
    bottom: 30%;
    left: 30%;
    position: fixed;
    right: 30%;
    top: 30%;

    .close {
        cursor: pointer;
        font-size: 25px;
        position: absolute;
        right: 5%;
        top: 5%;
    }

    .lines-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;

        .labels-wrapper {
            display: flex;
            flex-direction: column;
            margin-top: 50px;

            div {
                align-items: center;
                font-size: 20px;
                height: 30px;
                margin-top: 20px;
            }
        }

        .user-input-wrapper {
            display: flex;
            flex-direction: column;
            margin: 50px 0 0 20px;

            input {
                background: #202225;
                border: 1px solid white;
                color:white;
                font-size: 20px;
                height: 28px;
                margin-top: 19px;
                padding: 0;
            }
        }
    }
    .button-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        .apply-button {
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
    }
    
}
</style>