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
            @change="$emit('search', searchCriterion, userInput)"
        >
            <option v-for="item in options" :key="item">
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
@import '../../styles/searchPanel.scss';
.search-frame {
    display: flex;
    justify-content: center;
    padding: 10px 0px 10px 0px;
}
</style>