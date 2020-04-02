<template>
    <div class="menu">
    <ul class="menu-main">
        <router-link to="/mark">
            <li>Отметить</li>
        </router-link>

        <router-link to="/subs">
            <li>Абонементы</li>
        </router-link>

        <router-link to="/clients">
            <li>Клиенты</li>
        </router-link>

        <router-link to="/trainers">
            <li>Тренеры</li>
        </router-link>

        <router-link to="/payments">
            <li>Оплаты</li>
        </router-link>

        <router-link to="/report">
            <li>Отчет</li>
        </router-link>
    </ul>
    </div>
</template>


<style scoped>
@import '../../styles/menu.scss';
</style>