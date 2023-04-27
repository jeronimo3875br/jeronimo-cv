<template>
    <div 
        v-if="store.state.appsGrid.active" 
        class="apps-container">
            <form class="search-app" @submit.prevent.stop>
                <search-icon
                    :size="18"
                    fillColor="#cccccc"
                />
                <input 
                    type="text" 
                    placeholder="Pesquisar..."
                />
            </form>
            <div class="content">
                <slot />
            </div>
        </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: "AppsContainer"
    });
</script>

<script setup lang="ts">
    import { useStore } from 'vuex';
    import { RootState } from '@/store';
    import SearchIcon from "vue-material-design-icons/Magnify.vue";

    const store = useStore<RootState>();
</script>

<style scoped>
    .apps-container {
        width: 100vw;
        height: 100vh;
        position: absolute;
        background-color: rgba(29, 29, 29, .5);
        backdrop-filter: blur(10px);
        animation: initialAppsGridAnimation .1s linear;

        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 100px;

        gap: 30px;

        z-index: 2;
    }

    .apps-container .content {
        width: 50%;
        height: 30%;
        display: block;
    }

    @keyframes initialAppsGridAnimation {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    .search-app {
        display: flex;
        width: 200px;
        height: 40px;
        align-items: center;
        background-color: rgba(29, 29, 29, .1);
        backdrop-filter: blur(10px);
        border-radius: 50px;
        padding-left: 12px;
        padding-right: 12px;
        gap: 5px;
    }

    .search-app input {
        background: transparent;
        font-size: 13px;
        color: #cccccc;
    }

    .search-app input::-webkit-input-placeholder {
        color: #cccccc;
    }
</style>