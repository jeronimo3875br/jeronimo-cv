<template>
    <WifiSignalLevel4Strength 
        :size="size"
        :fillColor="color"
        v-if="currentWifiStrength > 8"
    />
    <WifiSignalLevel3Strength 
        :size="size"
        :fillColor="color"
        v-else-if="currentWifiStrength < 8 && currentWifiStrength > 5"
    />
    <WifiSignalLevel2Strength 
        :size="size"
        :fillColor="color"
        v-else-if="currentWifiStrength < 5 && currentWifiStrength > 3"
    />
    <WifiSignalLevel1Strength 
        :size="size"
        :fillColor="color"
        v-else-if="currentWifiStrength < 3"
    />
    <WifiSignalAlert 
        v-else
        :size="size"
        :fillColor="color"
    />
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: "WifiSignal"
    });
</script>

<script setup lang="ts">
    import { ref, onMounted, defineProps, withDefaults } from 'vue';
    import WifiSignalLevel1Strength from "vue-material-design-icons/WifiStrength1.vue";
    import WifiSignalLevel2Strength from "vue-material-design-icons/WifiStrength2.vue";
    import WifiSignalLevel3Strength from "vue-material-design-icons/WifiStrength3.vue";
    import WifiSignalLevel4Strength from "vue-material-design-icons/WifiStrength4.vue";
    import WifiSignalAlert from "vue-material-design-icons/WifiStrengthAlertOutline.vue";

    interface IWifiSignalProps {
        size: number;
        color: string;
    }

    withDefaults(defineProps<IWifiSignalProps>(), {
        size: 30,
        color: "#cccccc"
    });

    const currentWifiStrength = ref<number>(-1);

    function getWifiSignalStrength(){
        setInterval(() => {
            if (!navigator.connection)
                return currentWifiStrength.value = -1;

            var connection = navigator.connection;
            var signalStrength = connection.downlink;

            return currentWifiStrength.value = signalStrength;
        }, 1000);
    }
    
    onMounted(() => getWifiSignalStrength());
</script>