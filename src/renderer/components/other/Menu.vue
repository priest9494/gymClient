<template>
    <ul class="menu-main">
        <li v-for="(route, idx) in routes" :key="route"  @click="currentRoute=route">
            <router-link :to="'/' + route" :class="{ 'current': currentRoute === route }">
                {{ routeNames[idx] }}
            </router-link>
        </li>
    </ul>
</template>

<script>
export default {
    data() {
        return {
            currentRoute: 'mark',
            routes: [
                'mark',
                'subs',
                'clients',
                'trainers',
                'payments',
                'report'
            ],
            routeNames: [
                'Отметить',
                'Абонементы',
                'Клиенты',
                'Тренеры',
                'Оплаты',
                'Отчет'
            ]
        }
    }
}
</script>

<style scoped>
@import '../../styles/menu.scss';
</style>