<template>
    <div>
        <v-table class="data-table">
            <thead>
                <tr class="header-row">
                    <th>{{unit ? "Sub Unit" : "Unit"}}</th>
                    <th>Equipment Readiness</th>
                    <th>REDCON</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,i) in displayData" :key="i">
                    <td>{{ !item.is_total ?item?.name ?? item.sub_unit?.name : "TOTAL"}}</td>
                    <td class="text-center">{{ item?.rating?.toFixed(2) ?? 0}}%</td>
                    <td class="text-center" :class="red.redStyle(item?.redcon)">{{ item?.redcon}}</td>

                </tr>
            </tbody>
        </v-table>
    </div>
</template>
<script setup>
import { red } from '@/utils/redcon.js'
const props = defineProps({
    displayData : {
        type: Array,
        default: () => []
    },
    unit : {
        type: [String, Number],
        default: null
    }
})
</script>