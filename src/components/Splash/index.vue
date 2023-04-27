<template>
    <div 
        v-show="store.state.splash.active" 
        ref="splashScreen"
        class="splash-container" 
        :class="{ 'close-splash-animation': closeSplashAnimation }"
        @click="closeSplash">
        <p class="datetime">{{ currentHour }}</p>
        <img src="@/assets/images/profile.jpg" alt="profile-image" />
        <p>Gabriel Jeronimo</p>
        <div class="system-status">
            <wifi-signal 
                :size="20"
            />
            <battery-level 
                :size="20"
            />
        </div>
    </div>    
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: "SplashComponent"
    })
</script>

<script setup lang="ts">
    import { useStore } from "vuex";
    import { RootState } from "@/store";
    import { ref, onMounted } from "vue";
    import WifiSignal from "@/components/WifiSignal";
    import BatteryLevel from "@/components/BatteryLevel";

    const store = useStore<RootState>();
    const splashScreen = ref<HTMLElement>();
    const currentHour = ref<string>("00:00");
    const closeSplashAnimation = ref<boolean>(false);

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

    function closeSplash(){
        closeSplashAnimation.value = true;
        setTimeout(() => store.commit("TOGGLE_SPLASH_STATUS"), 100);
    }

    function keydownCloseSplashScreen(){
        window.addEventListener("keydown", () => {
            if (store.state.splash.active){
                closeSplash();
            }
        });
    }

    onMounted(() => {
        updateCurrentHour();
        keydownCloseSplashScreen();
    });
</script>

<style scoped>
    .splash-container {
        width: 100vw;
        height: 100vh;
        position: absolute;
        z-index: 999;
        backdrop-filter: blur(30px);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 20px;
        cursor: pointer;
    }

    .splash-container img {
        width: 170px;
        height: 170px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    .splash-container p {
        color: #cccccc;
        font-weight: bold;
        font-size: 25px;
    }

    .close-splash-animation {
        animation: closeSplashAnimation .2s linear;
    }

    .splash-container .datetime {
        position: absolute;
        left: 0;
        top: 0;
        margin: 20px;
        font-size: 30px;
        color: #dddddd;
    }

    @keyframes closeSplashAnimation {
        from {
            opacity: 1;
            transform: translateY(0);
        }

        to {
            opacity: 0;
            transform: translateY(-100%);
        }
    }

    .system-status {
        position: absolute;
        right: 0;
        bottom: 0;
        margin: 10px;
        display: flex;
        gap: 10px;
    }
</style>