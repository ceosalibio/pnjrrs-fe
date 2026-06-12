<template>
  <div class="equipment-readiness">
    <v-card>
      <v-card-title class="bg-primary text-white">Equipment Readiness Report</v-card-title>
      <v-card-text class="pa-0">
        <v-table class="elevation-1 custom-table" fixed-header height="70vh">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th class="text-center">TE</th>
              <th class="text-center">ACTUAL</th>
              <th class="text-center">%</th>
            </tr>
          </thead>

          <tbody>
            <template v-for="(item, i) in obj.master" :key="i">
              <!-- Category title for MOBILITY/FIREPOWER when item.category equals sub -->
              <tr v-if="['MOBILITY','FIREPOWER'].includes(item.category) && item.category === item.sub">
                <td class="detail-title">{{ item.category }}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              <!-- Regular data row -->
              <tr v-else-if="!item.title">
                <td class="detail-title">{{ !['MOBILITY','FIREPOWER'].includes(item.category) ? item.category : '' }}</td>
                <td :class="item.break ? 'detail-title' : ''">{{ sub(item) }}</td>
                <td class="text-center" :class="item.break ? 'detail-title' : ''">{{ item.required ?? '' }}</td>
                <td class="text-center" :class="item.break ? 'detail-title' : ''">{{ item.actual ?? '' }}</td>
                <td class="text-center" :class="item.break ? 'detail-title' : ''">{{ percent(item) }}</td>
              </tr>

              <!-- If last item, show MEE + SEE summary rows -->
              <template v-if="!obj.master[i + 1]">
                <tr>
                  <td colspan="4" class="readiness">MEE + SEE</td>
                  <td class="readiness">{{ obj.result?.readiness?.toFixed(2) + '%' }}</td>
                </tr>
                <tr>
                  <td colspan="5" :class="obj.result ? red.redStyle(red.redCon(obj.result.readiness)) : ''">
                    {{ obj.result ? red.redCon(obj.result.readiness) : '' }}
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { red } from '@/utils/redcon.js'

// Helpers used in template
const sub = (item) => {
  // try common fields, fallback to empty string
  return item.subName || item.sub || ''
}

const percent = (item) => {
  const req = Number(item.required)
  const act = Number(item.actual)
  if (!req || !act) return ''
  const val = (act / req) * 100
  return isFinite(val) ? val.toFixed(2) + '%' : ''
}

// Props and mock fallback
const props = defineProps({
  obj: { type: Object, default: () => ({ master: [], result: {} }) }
})

const mock = {
  master: [
    { title: true, category: 'MOBILITY', sub: 'MOBILITY' },
    { title: false, category: 'MOBILITY', sub: 'WHEELS', subName: 'Wheeled Vehicles', required: 10, actual: 9 },
    { title: false, category: 'FIREPOWER', sub: 'CANNON', subName: 'Cannons', required: 5, actual: 4 }
  ],
  result: { readiness: 86.5 }
}

const obj = computed(() => {
  if (!props.obj || !props.obj.master || props.obj.master.length === 0) return mock
  return props.obj
})
</script>

<style scoped>
.equipment-readiness { padding: 1rem }
.custom-table { border-collapse: collapse }
.custom-table td { border-bottom: 1px solid #e0e0e0; padding: 12px 8px; vertical-align: middle }
.detail-title { font-weight:700 }
.readiness { background:#E3F2FD; font-weight:600; text-align:center }
.text-center { text-align:center }
.bg-primary { background-color: #1976D2 }
.text-white { color: white }

/* Header styling similar to other readiness reports */
.equipment-readiness :deep(thead th) {
  background-color: #1565C0 !important;
  color: white !important;
  font-weight: 700 !important;
  border-bottom: 3px solid #0D47A1 !important;
  padding: 12px 8px !important;
  text-transform: uppercase !important;
}

@media (max-width: 960px) {
  .custom-table td { padding: 8px 4px; font-size: 0.85rem }
  .equipment-readiness :deep(thead th) { padding: 12px 4px !important; font-size: 0.75rem !important }
}
</style>
