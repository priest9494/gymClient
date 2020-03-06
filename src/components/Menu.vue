<template>
    <div class="menu">
        <router-link to="/mark">
            <div class="mark">
                <h4>Отметить</h4>
                <img src="../assets/menuIcon/mark_icon.svg" alt="mark">
            </div>
        </router-link>
        <router-link to="subs">
            <div class="subs">
                <h4>Абонементы</h4>
                <img src="../assets/menuIcon/sub_icon.png" alt="sub">
            </div>
        </router-link>
        <router-link to="clients">
            <div class="clients">
                <h4>Клиенты</h4>
                <img src="../assets/menuIcon/client_icon.png" alt="client">
            </div>
        </router-link>
        <router-link to="trainers">
            <div class="trainers">
                <h4>Тренеры</h4>
                <img src="../assets/menuIcon/trainer_icon.png" alt="trainer">
            </div>
        </router-link>
        <router-link to="payments">
            <div class="payments">
                <h4>Оплаты</h4>
                <img src="../assets/menuIcon/payment_icon.png" alt="payment">
            </div>
        </router-link>
        <router-link to="report">
            <div class="report">
                <h4>Отчет</h4>
                <img src="../assets/menuIcon/report_icon.png" alt="report">
            </div>
        </router-link>
    </div>
</template>


<style scoped>

.menu {
    width: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #e0c3d0;
}

.menu > div {
    border: 2px solid black; /* Белая рамка */
    display: flex;
    flex-grow: 1;
    flex-direction: column;
}

.menu h4 {
    color: black;
    margin: auto;
    display: flex;
    margin-block-start: 0em;
    margin-block-end: 0em;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.menu img {
    height: 70px;
    width: 70px;
    margin: auto;
}
</style>