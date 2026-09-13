<template>
    <div v-if="total > 0" class="app-pagination">
        <div class="pagination-container d-flex align-center justify-space-between">
            <!-- Left: Page Numbers and Per Page Selector -->
            <div class="pagination-left d-flex align-center ga-3">
                <!-- Per Page Selector -->
                <div class="per-page-selector d-flex align-center ga-2">
                    <label class="per-page-label">Per page:</label>
                    <select 
                        :value="perPage || 'all'"
                        @change="$emit('update:perPage', $event.target.value === 'all' ? null : Number($event.target.value))"
                        class="per-page-select"
                    >
                        <option :value="50">50</option>
                        <option :value="100">100</option>
                        <option :value="200">200</option>
                        <option value="all">All</option>
                    </select>
                </div>

                <!-- Page Numbers -->
                <!-- <div class="pagination-pages d-flex align-center ga-1">
                    <button
                        v-for="page in visiblePages"
                        :key="page"
                        class="page-button"
                        :class="{ 'page-button--active': currentPage === page }"
                        @click="$emit('update:currentPage', page)"
                    >
                        {{ page }}
                    </button>
                </div> -->
            </div>

            <!-- Right: Info and Navigation Buttons -->
            <div class="pagination-controls d-flex align-center ga-3">
                <span v-if="perPage" class="pagination-info">
                    Page <strong>{{ currentPage }}</strong> of <strong>{{ lastPage }}</strong>
                    <span class="pagination-total">• {{ total }} items</span>
                </span>
                <span v-else class="pagination-info">
                    <span class="pagination-total">Showing all {{ total }} items</span>
                </span>

                <div v-if="perPage" class="pagination-nav d-flex align-center ga-1">
                    <button
                        class="nav-button"
                        :disabled="currentPage === 1"
                        @click="$emit('update:currentPage', currentPage - 1)"
                        title="Previous page"
                    >
                        <v-icon size="small">mdi-chevron-left</v-icon>
                        Previous
                    </button>
                    <button
                        class="nav-button"
                        :disabled="currentPage === lastPage"
                        @click="$emit('update:currentPage', currentPage + 1)"
                        title="Next page"
                    >
                        Next
                        <v-icon size="small">mdi-chevron-right</v-icon>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    currentPage: {
        type: Number,
        default: 1,
        required: true
    },
    perPage: {
        type: Number,
        default: 10,
        required: true
    },
    total: {
        type: Number,
        default: 0,
        required: true
    }
});

defineEmits(['update:currentPage', 'update:perPage']);

// Calculate last page based on total and perPage
const lastPage = computed(() => {
    return Math.ceil(props.total / props.perPage) || 1;
});

// Compute visible pages for pagination (show 5 pages at a time)
const visiblePages = computed(() => {
    const pages = [];
    let start = Math.max(1, props.currentPage - 2);
    let end = Math.min(lastPage.value, start + 4);
    
    if (end - start < 4) {
        start = Math.max(1, end - 4);
    }
    
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});
</script>

<style scoped>
.app-pagination {
    margin-top: 24px;
    margin-bottom: 16px;
}

.pagination-container {
    background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
    border: 1px solid #e0e6ed;
    border-radius: 8px;
    padding: 16px 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

/* Page Numbers */
.pagination-left {
    flex-wrap: wrap;
}

.per-page-selector {
    flex: 0 0 auto;
}

.per-page-label {
    font-size: 13px;
    font-weight: 600;
    color: #606266;
    white-space: nowrap;
}

.per-page-select {
    min-width: 80px;
    height: 36px;
    padding: 4px 8px;
    border: 1px solid #d9dfe6;
    border-radius: 6px;
    background: #ffffff;
    color: #606266;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
}

.per-page-select:hover {
    border-color: #b3d8ff;
    background: #f2f6fc;
    color: #3d7bff;
}

.per-page-select:focus {
    border-color: #3d7bff;
    box-shadow: 0 0 0 3px rgba(61, 123, 255, 0.1);
}

.per-page-select option {
    background: #ffffff;
    color: #606266;
}

.pagination-pages {
    flex: 0 0 auto;
    padding-left: 12px;
    border-left: 1px solid #e0e6ed;
}

.page-button {
    min-width: 36px;
    height: 36px;
    padding: 0 8px;
    border: 1px solid #d9dfe6;
    border-radius: 6px;
    background: #ffffff;
    color: #606266;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
}

.page-button:hover:not(.page-button--active) {
    border-color: #b3d8ff;
    background: #f2f6fc;
    color: #3d7bff;
}

.page-button--active {
    background: linear-gradient(135deg, #3d7bff 0%, #2563eb 100%);
    border-color: #2563eb;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(61, 123, 255, 0.3);
}

.page-button:active {
    transform: scale(0.95);
}

/* Controls Section */
.pagination-controls {
    flex: 1;
    padding-left: 24px;
    justify-content: flex-end;
}

.pagination-info {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
    margin-right: 8px;
}

.pagination-info strong {
    color: #303133;
    font-weight: 600;
}

.pagination-total {
    color: #909399;
    margin-left: 4px;
}

/* Navigation Buttons */
.pagination-nav {
    margin-left: 16px;
    padding-left: 16px;
    border-left: 1px solid #e0e6ed;
}

.nav-button {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 100px;
    height: 36px;
    padding: 0 12px;
    border: 1px solid #d9dfe6;
    border-radius: 6px;
    background: #ffffff;
    color: #3d7bff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
}

.nav-button:hover:not(:disabled) {
    border-color: #3d7bff;
    background: #f2f6fc;
    box-shadow: 0 2px 8px rgba(61, 123, 255, 0.15);
}

.nav-button:active:not(:disabled) {
    transform: scale(0.98);
}

.nav-button:disabled {
    color: #bfbfbf;
    border-color: #f0f0f0;
    background: #fafafa;
    cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 960px) {
    .pagination-container {
        flex-direction: column;
        gap: 12px;
    }

    .pagination-left {
        border-right: none;
        border-bottom: 1px solid #e0e6ed;
        padding-right: 0;
        padding-bottom: 12px;
        width: 100%;
    }

    .pagination-pages {
        border-left: none;
        padding-left: 12px;
        padding-top: 12px;
        border-top: 1px solid #e0e6ed;
        width: 100%;
        justify-content: center;
    }

    .pagination-controls {
        padding-left: 0;
        width: 100%;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .pagination-nav {
        margin-left: 0;
        padding-left: 0;
        border-left: none;
        width: 100%;
        justify-content: flex-end;
        margin-top: 12px;
    }
}

@media (max-width: 768px) {
    .pagination-container {
        padding: 12px 16px;
    }

    .pagination-info {
        font-size: 12px;
        margin-right: 4px;
    }

    .nav-button {
        min-width: 90px;
        height: 32px;
        font-size: 12px;
        padding: 0 8px;
    }

    .page-button {
        min-width: 32px;
        height: 32px;
        font-size: 12px;
    }

    .per-page-select {
        min-width: 70px;
        height: 32px;
        font-size: 12px;
    }

    .per-page-label {
        font-size: 12px;
    }
}

@media (max-width: 600px) {
    .pagination-left {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
    }

    .per-page-selector {
        width: 100%;
    }

    .per-page-select {
        width: 100%;
    }

    .pagination-pages {
        width: 100%;
        border-top: none;
        border-left: none;
        padding-left: 0;
        padding-top: 0;
        justify-content: flex-start;
        overflow-x: auto;
    }

    .pagination-controls {
        flex-direction: column;
        gap: 12px;
    }

    .pagination-nav {
        width: 100%;
        margin-top: 0;
    }

    .nav-button {
        flex: 1;
        min-width: auto;
    }

    .pagination-info {
        order: -1;
        margin-bottom: 8px;
    }
}
</style>
