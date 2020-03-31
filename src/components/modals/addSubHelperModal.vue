<template>
    <div class="helper-shadow">
        <div class="helper-frame">
            <div class="helper-header">
                <div class="close-button" @click="$emit('modalClose')">x</div>

                <div class="helper-title">
                    {{ helperTitle }}
                </div>
            </div>
            <div class="user-input">
                <div class="search-container">
                    <input
                        class="search-input"
                        type="text"
                        :placeholder="searchCriterion"
                        v-model="userInput"
                        @input="search"
                    >
                </div>

                <select class="criterion-select" v-model="searchCriterion">
                    <option :selected="true">ФИО</option>
                    <option>Номер телефона</option>
                </select>
            </div>

            <div class="sub-list">
                <div class="search-result">
                    <div
                        class="search-result-header"
                        v-for="item in gridColumnsToShow"
                        :key="item"
                    >
                        {{ item }}
                    </div>
                </div>

                <div 
                    class="search-result"
                    v-for="(node, idx) in subListToShow"
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
export default {
    props: {
        helperTitle: String
    },
    data() {
        return {
            searchCriterion: 'ФИО'
        }
    }
}
</script>

<style lang="scss" scoped>
.helper-shadow {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.733);


    .helper-frame {
        position: fixed;
        top: 15%;
        bottom: 15%;
        left: 5%;
        right: 5%;
        background: #202225;
        border: 4px solid rgb(234, 230, 236);

        .helper-header {
            position: relative;

            .helper-title {
                text-align: center;
                margin: 20px 0 0 0;
                font-size: 20px;
            }

            .close-button {
                position: absolute;
                cursor: pointer;
                top: -15px;
                right: 20px;
                font-size: 30px;
            }

            
        }

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

            .criterion-select {
                outline:none;

                background: #27282c;
                color: #adbbbe;

                border-radius: 50px;
                border: 1px solid #26272b;
                padding: 10px;
                transition: all 0.3s;

                &:hover,
                &:focus {
                    padding: 10px 25px;
                    color: #c1cbce;
                }
            }
        }
    }
}

</style>
