<template>
  <div class="personnel-list">
    <AppFilterHeader />

    <v-card class="mb-6">
      <v-card-title>Personnel List</v-card-title>
      <v-card-subtitle>Manage and view all personnel records</v-card-subtitle>
      <v-divider />
      
      <v-card-text>
        <v-table class="data-table">
          <thead>
            <tr class="header-row">
              <th>DESCRIPTION/POSITION</th>
              <th>NAME</th>
              <th>RANK REQUIRED</th>
              <th>ACTUAL</th>
              <th>POINTS</th>
              <th>AFPOS</th>
              <th>ACTUAL</th>
              <th>POINTS</th>
              <th>REQUIRED</th>
            </tr>
          </thead>
          <tbody>
            <!-- Executive Section -->
            <tr class="section-header">
              <td colspan="9" class="section-title">Executive Section</td>
            </tr>
            <tr v-for="person in executiveSection" :key="`exec-${person.id}`">
              <td>{{ person.position }}</td>
              <td>{{ person.name }}</td>
              <td class="text-center">{{ person.rankRequired }}</td>
              <td class="text-center">{{ person.actual }}</td>
              <td class="text-center">{{ person.points }}</td>
              <td class="text-center">{{ person.afpos }}</td>
              <td class="text-center">{{ person.actualAfpos }}</td>
              <td class="text-center">{{ person.pointsAfpos }}</td>
              <td class="text-center">{{ person.required }}</td>
            </tr>

            <!-- Administrative Branch -->
            <tr class="section-header">
              <td colspan="9" class="section-title">Administrative Branch</td>
            </tr>
            <tr v-for="person in administrativeSection" :key="`admin-${person.id}`">
              <td>{{ person.position }}</td>
              <td>{{ person.name }}</td>
              <td class="text-center">{{ person.rankRequired }}</td>
              <td class="text-center">{{ person.actual }}</td>
              <td class="text-center">{{ person.points }}</td>
              <td class="text-center">{{ person.afpos }}</td>
              <td class="text-center">{{ person.actualAfpos }}</td>
              <td class="text-center">{{ person.pointsAfpos }}</td>
              <td class="text-center">{{ person.required }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppFilterHeader from '@/components/layouts/AppFilterHeader.vue'

const router = useRouter()
const searchQuery = ref('')

const executiveSection = ref([
  { id: 1, position: 'AC of NS for Personnel, N1', name: '', rankRequired: 'O6', actual: '', points: '', afpos: 'PERS', actualAfpos: '', pointsAfpos: '', required: 1 },
  { id: 2, position: 'Deputy AC of NS for Personnel, N1', name: '', rankRequired: 'O6', actual: '', points: '', afpos: 'PERS', actualAfpos: '', pointsAfpos: '', required: 1 },
  { id: 3, position: 'Executive Officer', name: '', rankRequired: 'O5', actual: '', points: '', afpos: 'PERS', actualAfpos: '', pointsAfpos: '', required: 1 },
  { id: 4, position: 'Chief Administrative Officer', name: '', rankRequired: 'SG24', actual: '', points: '', afpos: 'Civ', actualAfpos: '', pointsAfpos: '', required: '' },
  { id: 5, position: 'Chief Clerk', name: '', rankRequired: 'E7/E8', actual: '', points: '', afpos: 'YN', actualAfpos: '', pointsAfpos: '', required: 1 },
  { id: 6, position: 'Staff EP', name: '', rankRequired: 'E4/E5/E6', actual: '', points: '', afpos: 'YN', actualAfpos: '', pointsAfpos: '', required: 1 },
  { id: 7, position: 'Staff EP', name: '', rankRequired: 'E3', actual: '', points: '', afpos: 'CD', actualAfpos: '', pointsAfpos: '', required: 1 },
  { id: 8, position: 'Staff EP', name: '', rankRequired: 'E3', actual: '', points: '', afpos: 'CD', actualAfpos: '', pointsAfpos: '', required: 1 }
])

const administrativeSection = ref([
  { id: 9, position: 'Staff Officer', name: '', rankRequired: 'O3/O4', actual: '', points: '', afpos: 'PERS', actualAfpos: '', pointsAfpos: '', required: 1 },
  { id: 10, position: 'Staff Officer', name: '', rankRequired: 'O3/O4', actual: '', points: '', afpos: 'PERS', actualAfpos: '', pointsAfpos: '', required: 1 },
  { id: 11, position: 'Staff EP', name: '', rankRequired: 'E7/E8', actual: '', points: '', afpos: 'YN', actualAfpos: '', pointsAfpos: '', required: '' },
  { id: 12, position: 'Administrative Assistant V', name: '', rankRequired: 'SG11', actual: '', points: '', afpos: 'Civ', actualAfpos: '', pointsAfpos: '', required: '' },
  { id: 13, position: 'Administrative Officer II', name: '', rankRequired: 'SG11', actual: '', points: '', afpos: 'Civ', actualAfpos: '', pointsAfpos: '', required: '' }
])

const filteredPersonnel = computed(() => {
  if (!searchQuery.value) return [...executiveSection.value, ...administrativeSection.value]
  const query = searchQuery.value.toLowerCase()
  return [...executiveSection.value, ...administrativeSection.value].filter(p => 
    p.position.toLowerCase().includes(query) || p.name.toLowerCase().includes(query)
  )
})

const editPersonnel = (id) => {
  router.push(`/personnel/${id}/edit`)
}

const deletePersonnel = (id) => {
  if (confirm('Are you sure you want to delete this personnel?')) {
    executiveSection.value = executiveSection.value.filter(p => p.id !== id)
    administrativeSection.value = administrativeSection.value.filter(p => p.id !== id)
  }
}
</script>

<style scoped>
.personnel-list {
  padding: 1rem;
}

.text-center {
  text-align: center;
}
</style>
