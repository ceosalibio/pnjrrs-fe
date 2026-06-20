<template>
    <div v-if="totalItems > 0" class="d-flex align-center justify-space-between ga-2 mt-4">
        <div>
            <span class="text-caption text-grey">
                Page {{ currentPage }} of {{ lastPage }} (Total: {{ totalItems }})
            </span>
        </div>
        

        <div class="d-flex align-center ga-2">
            <!-- <div class="d-flex ga-1">
                
            </div> -->

            <AppButton
                size="small"
                variant="outlined"
                :disabled="currentPage === 1"
                @on-click="$emit('update:currentPage', currentPage - 1)"
            >
                Previous
            </AppButton>
            <AppButton
                v-for="page in visiblePages"
                :key="page"
                size="small"
                :color="currentPage === page ? 'primary' : 'default'"
                :variant="currentPage === page ? 'flat' : 'text'"
                @on-click="$emit('update:currentPage', page)"
            >
                {{ page }}
            </AppButton>
            <AppButton
                size="small"
                variant="outlined"
                :disabled="currentPage === lastPage"
                @on-click="$emit('update:currentPage', currentPage + 1)"
            >
                Next
            </AppButton>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import AppButton from './AppButton.vue';

const props = defineProps({
    currentPage: {
        type: Number,
        default: 1
    },
    lastPage: {
        type: Number,
        default: 1
    },
    totalItems: {
        type: Number,
        default: 0
    }
});

defineEmits(['update:currentPage']);

// Compute visible pages for pagination (show 5 pages at a time)
const visiblePages = computed(() => {
    const pages = [];
    let start = Math.max(1, props.currentPage - 2);
    let end = Math.min(props.lastPage, start + 4);
    
    if (end - start < 4) {
        start = Math.max(1, end - 4);
    }
    
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});
</script>
