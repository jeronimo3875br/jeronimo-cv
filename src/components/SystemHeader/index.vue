<template>
    <header>
        <div class="activities-container">
            <p>Atividades</p>
        </div>
        <p class="datetime">{{ currentHour }}</p>
        <div class="system-status">
            <wifi-signal 
                :size="17"
            />
            <battery-level 
                :size="17"
            />
        </div>
    </header>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: "SystemHeader"
    });
</script>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import WifiSignal from "@/components/WifiSignal";
    import BatteryLevel from "@/components/BatteryLevel";

    const currentHour = ref<string>("00:00");

    function updateCurrentHour(){
        setInterval(() => {
            const time = new Date();

            time.toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo"
            });

            var minutes = String(time.getMinutes());

            if (minutes.length < 2)
                minutes =`0${minutes}`;

            currentHour.value = `${time.getHours()}:${minutes}`;
        });
    }

    onMounted(() => {
        updateCurrentHour();
    });
</script>

<style scoped>
    header {
        width: 100%;
        height: 30px;
        background-color: rgba(29, 29, 29, .7);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .datetime {
        color: #cccccc;
        font-size: 14px;
        text-align: center;
        margin-right: 20px;
    }

    .activities-container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 70px;
        border-bottom: 2px solid deepskyblue;
    }

    .activities-container p {
        font-size: 12px;
        color: #cccccc;
    }

    .system-status {
        display: flex;
        gap: 7px;
        padding-right: 5px;
    }
</style>