<!-- components/ReadinessTable.vue -->
<template>
  <v-card>
    <v-card-title class="text-center">{{ title }}</v-card-title>
    <v-card-text class="pa-0">
      <v-table class="elevation-1 custom-table" fixed-header height="70vh">
        <thead>
          <tr>
            <th class="text-center">Equipment Category</th>
            <th class="text-center">Table of <br> Equipment <br> 2019</th>
            <th class="text-center">{{ actualColumnLabel }}</th>
            <th class="text-center">Rating</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="isMissionCritical">
            <tr><td class="detail-title" colspan="4">MISSION CRITICAL EQUIPMENT</td></tr>
            <EquipmentDivisionRows :divisions="data?.mce?.divisions" />
          </template>

          <tr><td class="detail-title" colspan="4">MISSION ESSENTIAL EQUIPMENT</td></tr>
          <EquipmentDivisionRows :divisions="data?.mee?.divisions" />

          <tr>
            <td colspan="3" class="text-end detail-title">Total Average MEE</td>
            <td class="text-center">{{ data?.mee?.total_average }}%</td>
          </tr>
          <tr>
            <td colspan="3" class="text-end detail-title">MEE({{ data?.mee?.weight_percent }}%)</td>
            <td class="text-center detail-title">{{ data?.mee?.weighted_score }}%</td>
          </tr>

          <tr v-for="(item, i) in data?.se?.divisions" :key="i">
            <td class="detail-title">{{ item.name }}</td>
            <td class="text-center">{{ item.required }}</td>
            <td class="text-center">{{ item.onhand }}</td>
            <td class="text-center">{{ item.rating ? item.rating + '%' : '' }}</td>
          </tr>

          <tr>
            <td colspan="3" class="text-end detail-title">{{ displayTotalLabel }}</td>
            <td class="text-center detail-title font-weight-bold">{{ totalScore }}%</td>
          </tr>
          <tr>
            <td colspan="3" class="text-end detail-title">REDCON</td>
            <td class="text-center detail-title" :class="red.redStyle(data?.redcon)">{{red.redCon(data?.redcon) }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { red } from '@/utils/redcon.js'
import { computed } from 'vue'
import EquipmentDivisionRows from './EquipmentDivisionRows.vue'

const props = defineProps({
  title: { type: String, required: true },
  data: { type: Object, default: () => ({}) },
  categoryId: { type: [Number, String], default: null },
  actualColumnLabel: { type: String, default: 'Actual Nr of Equipment' }
})

const isMissionCritical = computed(() => props.categoryId == 2)

const displayTotalLabel = computed(() =>
  isMissionCritical.value ? 'MCE + MEE + SE' : 'MEE + SE'
)

const totalScore = computed(() => {
  const mce = isMissionCritical.value ? Number(props.data?.mce?.weighted_score ?? 0) : 0
  const mee = Number(props.data?.mee?.weighted_score ?? 0)
  const se  = Number(props.data?.se?.weighted_score ?? 0)
  return (mce + mee + se).toFixed(2)
})
</script>