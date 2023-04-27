<template>
  <div 
    class="container"
    @dragover.prevent
    @drop="dropTerminal"
    @mouseup="systemMouseUp">
    <splash />
    <apps-container>
      <app-shortcut
        name="Terminal"
        icon="terminal-icon.png"
        appGrid
        :onClick="runTerminalApp"
      />
    </apps-container>
    <system-header />
    <div class="content">
      <app-shortcut-container>
        <app-shortcut
          v-show="store.state.terminalApp.isRunning"
          name="Terminal"
          icon="terminal-icon.png"
          :onClick="toggleTerminalApp"
        />
      </app-shortcut-container>
      <terminal-app  
        :positionX="positionX"
        :positionY="positionY"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useStore } from "vuex";
  import { RootState } from "./store";
  import { ref, onMounted } from "vue";
  import TerminalApp from "@/components/Terminal";
  import AppShortcut from "@/components/AppShortcut";
  import SystemHeader from "@/components/SystemHeader";
  import AppsContainer from "@/components/AppsContainer";
  import AppShortcutContainer from "@/components/AppShortcutContainer";

  import Splash from "@/components/Splash";

  const store = useStore<RootState>();

  const positionX = ref<number>();
  const positionY = ref<number>();

  const screenSaverTimer = ref<number>(0);

  function toggleTerminalApp(){
    store.commit("TOGGLE_TERMINAL_APP");
  }

  function dropTerminal(event: DragEvent){
    positionX.value = event.clientX;
    positionY.value = event.clientY;
  }

  function systemMouseUp(){
    clearTimeout(store.state.longPressTemporizerId);
    clearInterval(store.state.terminalApp.terminalResizeMode);
  }

  function runTerminalApp(){
    store.commit("TOGGLE_APPS_GRID");
    store.commit("SET_APP_RUNNING_STATUS", true);

    if (!store.state.terminalApp.active)
      toggleTerminalApp();
  }

  function screenSaver(){
    setInterval(() => {
      screenSaverTimer.value++;

      if (screenSaverTimer.value >= 5)
        if (!store.state.splash.active)
          return store.commit("TOGGLE_SPLASH_STATUS");
    }, 60000);

    window.addEventListener("click", () => screenSaverTimer.value = 0);
    window.addEventListener("keydown", () => screenSaverTimer.value = 0);
  }

  onMounted(() => screenSaver());
</script>

<style lang="scss">
  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-image: url("@/assets/images/background.jpg");
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
