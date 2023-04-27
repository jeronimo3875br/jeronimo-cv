<template>
    <div 
        class="app-shortcut"
        @click="onClick"
        @mouseenter="setAppShortcutDescriptionVisible(true)"
        @mouseleave="setAppShortcutDescriptionVisible(false)">
        <img 
            :src="require(`@/assets/images/${icon}`)"
            alt="app-shortcut-icon"
        />
        <div 
            class="app-shortcut-description"
            :class="{ 
                'app-shortcut-description-active': appShortcutDescriptionVisible || appGrid,
                'app-shortcut-grid': appGrid
            }">
            <p>{{ name }}</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: "AppShortcut"
    });
</script>

<script setup lang="ts">
    import { defineProps, ref, withDefaults } from 'vue';

    interface IAppShortcutProps {
        name: string;
        icon: string;
        appGrid: boolean;
        onClick: () => void;
    }

    withDefaults(defineProps<IAppShortcutProps>(), {
        appGrid: false
    });

    const appShortcutDescriptionVisible = ref<boolean>(false);

    function setAppShortcutDescriptionVisible(status: boolean){
        appShortcutDescriptionVisible.value = status;
    }
</script>

<style scoped>
    .app-shortcut {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        z-index: 1;
        cursor: pointer;
    }

    .app-shortcut img {
        width: 60px;
        height: 60px;
        box-shadow: 0px 0px 10px rgb(0 0 0  / 3%);
    }

    .app-shortcut-description {
        position: absolute;
        backdrop-filter: blur(4px);
        width: 60px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transform: translateY(40px);
        background-color: rgba(33, 33, 33, .4);
        opacity: 0;
        transition: .1s;
    }

    .app-shortcut-description p {
        color: #cccccc;
        font-size: 12px;
        font-weight: bold;
    }

    .app-shortcut-description-active {
        opacity: 1;
    }

    .app-shortcut-grid {
        background-color: transparent !important;
    }
</style>