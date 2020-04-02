<template>
    <div class="search-frame">
        <div class="search-container">
            <input
                class="search-input"
                type="text"
                :placeholder="searchCriterion"
                v-model="userInput"
                @input="$emit('search', searchCriterion, userInput)"
            >
        </div>

        <select
            class="criterion-select"
            v-model="searchCriterion"
        >
            <option
                v-for="item in options"
                :key="item"
            >
                {{ item }}
            </option>
        </select>
    </div>
</template>

<script>
export default {
    props: {
        options: Array
    },
    data() {
        return {
            searchCriterion: this.options[0],
            userInput: ''
        }
    }    
}
</script>

<style lang="scss" scoped>
.search-frame {
    display: flex;
    justify-content: center;
    padding: 10px 0px 10px 0px;

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
}
</style>