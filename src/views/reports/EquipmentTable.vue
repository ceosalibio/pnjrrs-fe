<template>
    <div>
        <v-row>
            <v-col>
                <h2>Equipment</h2>
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
                            <td class="text-center">{{ item?.rating_equipment?.toFixed(2) ?? 0}}%</td>
                            <td class="text-center" :class="red.redStyle(item?.redcon_equipment)">{{ item?.redcon_equipment}}</td>

                        </tr>
                    </tbody>
                </v-table>
            </v-col>
            <v-col>
                <h2>Maintenance</h2>
                <v-table class="data-table">
                    <thead>
                        <tr class="header-row">
                            <th>{{unit ? "Sub Unit" : "Unit"}}</th>
                            <th>Maintenance Readiness</th>
                            <th>REDCON</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,i) in displayData" :key="i">
                            <td>{{ !item.is_total ?item?.name ?? item.sub_unit?.name : "TOTAL"}}</td>
                            <td class="text-center">{{ item?.rating_maintenance?.toFixed(2) ?? 0}}%</td>
                            <td class="text-center" :class="red.redStyle(item?.redcon_maintenance)">{{ item?.redcon_maintenance}}</td>

                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
        
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