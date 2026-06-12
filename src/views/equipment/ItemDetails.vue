
<template>
  <div class="equipment-details">
    <app-filter-header />
    <v-card>
      <v-card-title>Equipment & Maintenance</v-card-title>
      <v-card-subtitle>Combined view of equipment items and maintenance status</v-card-subtitle>
      <v-divider />

      <v-card-text>
        <div class="mb-4 d-flex gap-3 align-center">
          <v-text-field
            v-model="searchQuery"
            placeholder="Search items..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            style="max-width: 320px"
            clearable
          />
          <v-spacer />
          <v-btn color="primary" @click="addMockItem">Add Mock Item</v-btn>
        </div>

        <v-table class="elevation-1 custom-table" fixed-header height="70vh">
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-center" style="width:10%">Required</th>
              <th class="text-center" style="width:10%">Actual</th>
              <th class="text-center" style="width:10%">Onhand</th>
              <th class="text-center" style="width:10%">OPL</th>
              <th class="text-center" style="width:10%">For RPR</th>
              <th class="text-center" style="width:10%">For TI/BER</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in filteredData" :key="i">
              <tr>
                <td :class="item.Title ? 'item-title' : 'item-detail'" :colspan="!item.required ? 7 : 1">
                  {{ item.description }}
                </td>

                <template v-if="item.required">
                  <td class="text-center">{{ item.required }}</td>

                  <!-- Actual (editable) -->
                  <v-tooltip text="Double click to edit" location="top">
                    <template #activator="{ props }">
                      <td
                        v-bind="props"
                        @dblclick="enableEdit(i, 'actual')"
                        :class="obj.status == '0' && item.required && !item.na && user.approver == 1 ? 'editable' : ''"
                      >
                        <div v-if="isEditing(i, 'actual')">
                          <v-text-field
                            v-model.number="item.actual"
                            type="number"
                            density="compact"
                            variant="outlined"
                            class="text-center"
                            @blur="saveEdit(item, 'actual')"
                          />
                        </div>
                        <div v-else>
                          {{ item.actual ?? '' }}
                        </div>
                      </td>
                    </template>
                  </v-tooltip>

                  <!-- Onhand -->
                  <td class="text-center">{{ item.onhand ?? '' }}</td>

                  <!-- Operational -->
                  <td class="text-center">{{ item.operational ?? '' }}</td>

                  <!-- Repair (editable) -->
                  <v-tooltip text="Double click to edit" location="top">
                    <template #activator="{ props }">
                      <td
                        v-bind="props"
                        @dblclick="enableEdit(i, 'repair')"
                        :class="obj.status == '0' && item.actual && !item.na && user.approver == 1 ? 'editable' : ''"
                      >
                        <div v-if="isEditing(i, 'repair')">
                          <v-text-field
                            v-model.number="item.repair"
                            type="number"
                            density="compact"
                            variant="outlined"
                            class="text-center"
                            @blur="saveEdit(item, 'repair')"
                          />
                        </div>
                        <div v-else>
                          {{ item.repair ?? '' }}
                        </div>
                      </td>
                    </template>
                  </v-tooltip>

                  <!-- Dispose (editable) -->
                  <v-tooltip text="Double click to edit" location="top">
                    <template #activator="{ props }">
                      <td
                        v-bind="props"
                        @dblclick="enableEdit(i, 'dispose')"
                        :class="obj.status == '0' && item.actual && !item.na && user.approver == 1 ? 'editable' : ''"
                      >
                        <div v-if="isEditing(i, 'dispose')">
                          <v-text-field
                            v-model.number="item.dispose"
                            type="number"
                            density="compact"
                            variant="outlined"
                            class="text-center"
                            @blur="saveEdit(item, 'dispose')"
                          />
                        </div>
                        <div v-else>
                          {{ item.dispose ?? '' }}
                        </div>
                      </td>
                    </template>
                  </v-tooltip>
                </template>
              </tr>
            </template>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import AppFilterHeader from '@/components/layouts/AppFilterHeader.vue'
import { ref, computed } from 'vue'

// Search
const searchQuery = ref('')

// Edit state: track which row & field is being edited
const editing = ref({ row: null, field: null })

// Mock user
const user = ref({ approver: 1 })

// Mock obj with status and tableData (combined)
const obj = ref({
  status: '0',
  tableData: [
    { Title: true, description: 'Communications Equipment' },
    { Title: false, description: 'Handheld Radio', required: 10, actual: 8, onhand: 10, operational: 8, repair: 1, dispose: 1, na: false, info: 'comms' },
    { Title: false, description: 'Base Radio', required: 2, actual: 2, onhand: 2, operational: 2, repair: 0, dispose: 0, na: false, info: 'comms' },
    { Title: true, description: 'Navigation Equipment' },
    { Title: false, description: 'GPS Unit', required: 5, actual: 4, onhand: 5, operational: 4, repair: 1, dispose: 0, na: false, info: 'nav' },
    { Title: false, description: 'Compass', required: 5, actual: 5, onhand: 5, operational: 5, repair: 0, dispose: 0, na: false, info: 'nav' }
  ]
})

// Filtered data
const filteredData = computed(() => {
  if (!searchQuery.value) return obj.value.tableData
  const q = searchQuery.value.toLowerCase()
  return obj.value.tableData.filter((it) => (it.description || '').toLowerCase().includes(q))
})

// Helpers
const isEditing = (row, field) => editing.value.row === row && editing.value.field === field
const enableEdit = (row, field) => { editing.value = { row, field } }

const saveEdit = (item, field) => {
  // Validate number fields
  if (typeof item[field] === 'number' && item[field] < 0) item[field] = 0
  // Reset editing
  editing.value = { row: null, field: null }
  // TODO: call API to persist change
  console.log('Saved', field, item)
}

const addMockItem = () => {
  obj.value.tableData.push({ Title: false, description: 'New Item', required: 1, actual: 0, onhand: 1, operational: 0, repair: 0, dispose: 0, na: false })
}
</script>

<style scoped>
.equipment-details { padding: 1rem; }
.custom-table { border-collapse: collapse; width: 100%; }
.custom-table th { background: #f5f5f5; padding: 12px; font-weight:600 }
.custom-table td { padding: 10px; border-bottom: 1px solid #e0e0e0 }
.item-title { font-weight:700; background:#e3f2fd; padding:12px }
.item-detail { padding:12px }
.editable { background:#fff9c4; cursor:pointer }
.text-center { text-align:center }
.d-flex { display:flex }
.gap-3 { gap: 1rem }
.align-center { align-items:center }
</style>
