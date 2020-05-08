<template>
    <div>
        <ul class="menu-main">
            <li v-for="(route, idx) in routes" :key="route"  @click="currentRoute=route">
                <router-link :to="'/' + route" :class="{ 'current': currentRoute === route }">
                    {{ routeNames[idx] }}
                </router-link>
            </li>
        </ul>
        <div class="settings" @click="settingsVisible = true">
            <img src="../../assets/settings.png" alt="">
        </div>
        <settings 
            v-show="settingsVisible"
            @settingsClose="settingsVisible = false"
        />
    </div>
</template>

<script>
import settings from './Settings'

export default {
    components: {
        settings
    },
    data() {
        return {
            settingsVisible: false,
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