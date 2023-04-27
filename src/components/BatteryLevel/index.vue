<template>
    <Battery-10
        v-if="batteryLevel === 10 && !batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <Battery-20
        v-else-if="batteryLevel === 20 && !batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <Battery-30
        v-else-if="batteryLevel === 30 && !batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <Battery-40
        v-else-if="batteryLevel === 40 && !batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <Battery-50
        v-else-if="batteryLevel === 50 && !batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <Battery-60
        v-else-if="batteryLevel === 60 && !batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <Battery-70
        v-else-if="batteryLevel === 70 && !batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <Battery-80
        v-else-if="batteryLevel === 80 && !batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <Battery-90
        v-else-if="batteryLevel === 90 && !batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <battery 
        v-else-if="batteryLevel === 100 && !batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <battery-charging 
        v-else-if="batteryLevel === 100 && batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <battery-charging-10
        v-else-if="batteryLevel === 10 && batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <battery-charging-20
        v-else-if="batteryLevel === 20 && batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <battery-charging-30
        v-else-if="batteryLevel === 30 && batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <battery-charging-40
        v-else-if="batteryLevel === 40 && batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <battery-charging-50
        v-else-if="batteryLevel === 50 && batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <battery-charging-60
        v-else-if="batteryLevel === 60 && batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <battery-charging-70
        v-else-if="batteryLevel === 70 && batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <battery-charging-80
        v-else-if="batteryLevel === 80 && batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <battery-charging-90
        v-else-if="batteryLevel === 90 && batteryCharging"
        :size="size"
        :fillColor="color"
    />
    <BatteryAlert
        v-else
        :size="size"
        :fillColor="color"
    />
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: "BatteryLevel"
    });
</script>

<script setup lang="ts">
    import { ref, defineProps, withDefaults, onMounted } from "vue";

    import Battery from "vue-material-design-icons/Battery.vue";
    import Battery10 from "vue-material-design-icons/Battery10.vue";
    import Battery20 from "vue-material-design-icons/Battery20.vue";
    import Battery30 from "vue-material-design-icons/Battery30.vue";
    import Battery40 from "vue-material-design-icons/Battery40.vue";
    import Battery50 from "vue-material-design-icons/Battery50.vue";
    import Battery60 from "vue-material-design-icons/Battery60.vue";
    import Battery70 from "vue-material-design-icons/Battery70.vue";
    import Battery80 from "vue-material-design-icons/Battery80.vue";
    import Battery90 from "vue-material-design-icons/Battery90.vue";

    import BatteryCharging from "vue-material-design-icons/BatteryCharging100.vue";
    import BatteryCharging10 from "vue-material-design-icons/BatteryCharging10.vue";
    import BatteryCharging20 from "vue-material-design-icons/BatteryCharging20.vue";
    import BatteryCharging30 from "vue-material-design-icons/BatteryCharging30.vue";
    import BatteryCharging40 from "vue-material-design-icons/BatteryCharging40.vue";
    import BatteryCharging50 from "vue-material-design-icons/BatteryCharging50.vue";
    import BatteryCharging60 from "vue-material-design-icons/BatteryCharging60.vue";
    import BatteryCharging70 from "vue-material-design-icons/BatteryCharging70.vue";
    import BatteryCharging80 from "vue-material-design-icons/BatteryCharging80.vue";
    import BatteryCharging90 from "vue-material-design-icons/BatteryCharging90.vue";

    import BatteryAlert from "vue-material-design-icons/BatteryAlertVariantOutline.vue";

    interface IBatteryLevelProps {
        size: number;
        color: string;
    }

    withDefaults(defineProps<IBatteryLevelProps>(), {
        size: 30,
        color: "#cccccc"
    });

    const batteryLevel = ref<number>(0);
    const batteryCharging = ref<boolean>(false);

    function getBatteryLevel(){
        setInterval(async () => {
            const battery = await navigator
                .getBattery();

            batteryCharging.value = battery.charging;
            batteryLevel.value = Math.round((battery.level * 100) / 10) * 10;
        }, 1000);
    }

    onMounted(() => getBatteryLevel());
</script>