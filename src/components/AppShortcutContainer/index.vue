<template>
    <div class="app-shortcut-container">
        <div>
            <slot />
        </div>
        <button 
            @click="toggleAppsGrid"
            class="apps-button">
            <apps-icon 
                :size="50"
                fillColor="#cccccc"
            />
        </button>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "AppShortcutContainer"
    });
</script>

<script setup lang="ts">
    import { useStore } from "vuex";
    import { RootState } from "@/store";
    import AppsIcon from "vue-material-design-icons/Apps.vue";

    const store = useStore<RootState>();

    function toggleAppsGrid(){
        store.commit("TOGGLE_APPS_GRID");
    }
</script>

<style scoped>
    .app-shortcut-container {
        width: 80px;
        height: 50%;
        position: absolute;
        left: 0;
        backdrop-filter: blur(10px);
        border-radius: 0px 10px 10px 0px;
        background-color: rgba(29, 29, 29, .7);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        z-index: 2;
    }

    .apps-button {
        width: 60px;
        height: 60px;
        background: transparent;
        cursor: pointer;
        margin-bottom: 10px;
        border-radius: 4px;
    }

    .apps-button:hover {
        transition: .1s;
        background-color: #1d1d1d;
    }
</style>