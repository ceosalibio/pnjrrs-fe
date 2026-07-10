<!-- components/EquipmentDivisionRows.vue -->
<template>
  <template v-for="cat in categories" :key="cat">
    <tr>
      <td class="detail-title" colspan="4">{{ cat === 'Communications' ? '' : cat }}</td>
    </tr>
    <tr v-for="(item, i) in filteredByCategory(cat)" :key="i">
      <td>{{ item.name }}</td>
      <td class="text-center">{{ item.required }}</td>
      <td class="text-center">{{ item.onhand }}</td>
      <td class="text-center">{{ item.rating ? item.rating + '%' : '' }}</td>
    </tr>
    <tr><td colspan="4"></td></tr>
  </template>
</template>

<script setup>
const props = defineProps({
  divisions: { type: Array, default: () => [] },
  categories: { type: Array, default: () => ['MOBILITY', 'FIREPOWER', 'Communications'] }
})

const filteredByCategory = (cat) =>
  props.divisions.filter(item => item.category_name === cat)
</script>