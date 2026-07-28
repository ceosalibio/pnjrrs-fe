<template>
    <div>
        <v-table class="data-table">
            <thead>
                <tr class="header-row">
                    <th>{{unit ? "Sub Unit" : "Unit"}}</th>
                    <th>TO</th>
                    <th>Actual</th>
                    <th>Personnel Fill-up <br> (Actual/TO x 100)</th>
                    <th>Rank <br> (Total Points)</th>
                    <th>RR <br> (Total Points / Actual  x 100)</th>
                    <th>FOS/Rating <br> (Aligned)</th>
                    <th>PSR<br> (Aligned FOS/Actual x 100)</th>
                    <th>PRR</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,i) in displayData" :key="i">
                    <td>{{ !item.is_total ?item?.name ?? item.sub_unit?.name : "TOTAL"}}</td>
                    <td class="text-center">{{ item?.required}}</td>
                    <td class="text-center">{{ item?.actual}}</td>
                    <td class="text-center">{{ item?.fillUpRating ?? 0}}%</td>
                    <td class="text-center">{{ item?.grade_points}}</td>
                    <td class="text-center">{{ item?.gradeRating ?? 0}}%</td>
                    <td class="text-center">{{ item?.afpos_points}}</td>
                    <td class="text-center">{{ item?.afposRating ?? 0}}%</td>
                    <td class="text-center">{{ item?.readiness ?? 0}}%</td>

                </tr>
            </tbody>
        </v-table>
    </div>
</template>
<script setup>

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