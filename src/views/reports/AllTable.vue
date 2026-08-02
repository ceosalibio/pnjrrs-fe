<template>
    <div>
        <v-table class="data-table">
            <thead>
                <tr class="header-row">
                    <th>Report</th>
                    <th>Readiness<br> Rating</th>
                    <th>REDCON</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,i) in displayData" :key="i">
                    <td class="text-center">{{ item?.report}}</td>
                    <td class="text-center font-weight-bold">{{ item?.rating?.toFixed(2) ?? 0}}%</td>
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