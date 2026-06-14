<template>
    <div>
        <div class="d-flex justify-space-between mb-4">
            <div>
                <h3>Category List</h3>
            </div>
            <AppButton
                color="primary"
                @on-click="openDialog"
            >
                + Add Category
            </AppButton>
        </div>

        <v-table v-if="categories.length > 0" class="elevation-1">
            <thead>
                <tr>
                    <!-- <th class="text-left">ID</th> -->
                    <th class="text-left">Name</th>
                    <th class="text-left">Abbreviation</th>
                    <th class="text-left">Description</th>
                    <th class="text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="category in categories" :key="category.id">
                    <!-- <td>{{ category.id }}</td> -->
                    <td class="font-weight-bold">{{ category.name }}</td>
                    <td>{{ category.abreviation }}</td>
                    <td>{{ category.description }}</td>
                    <td>
                        <div class="d-flex ga-2">
                            <AppButton
                                size="small"
                                color="warning"
                                variant="text"
                                @on-click="editItem(category)"
                            >
                                Edit
                            </AppButton>
                            <AppButton
                                size="small"
                                color="error"
                                variant="text"
                                @on-click="deleteItem(category.id)"
                            >
                                Delete
                            </AppButton>
                        </div>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <div v-else class="text-center py-8">
            <p class="text-grey">No categories found</p>
        </div>

        <!-- Pagination Component -->
        <AppPagination
            :current-page="currentPage"
            :last-page="lastPage"
            :total-items="totalItems"
            @update:current-page="goToPage"
        />

        <!-- Add/Edit Dialog -->
        <AppDialog
            v-model="isDialogOpen"
            :title="editingId ? 'Edit Category' : 'Add Category'"
            confirmText="Save"
            @confirm="saveCategory"
            @cancel="closeDialog"
        >
            <v-form ref="form" @submit.prevent="saveCategory">
                <div class="d-flex flex-column ga-4">
                    <AppTextField
                        v-model="formData.name"
                        label="Category Name"
                        placeholder="Enter category name"
                        :rules="[(v) => !!v || 'Name is required']"
                    />
                    <AppTextField
                        v-model="formData.abreviation"
                        label="Abbreviation"
                        placeholder="Enter abbreviation"
                    />
                    <AppTextField
                        v-model="formData.description"
                        label="Description"
                        placeholder="Enter description"
                    />
                </div>
            </v-form>
        </AppDialog>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import AppDialog from '@/components/common/AppDialog.vue';
import AppTextField from '@/components/forms/AppTextField.vue';
import AppPagination from '@/components/common/AppPagination.vue';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/organizationService';
import { useSnackbar } from '@/composables/useSnackbar';

const categories = ref([]);
const isDialogOpen = ref(false);
const editingId = ref(null);
const form = ref(null);
const formData = ref({
    name: '',
    abreviation: '',
    description: ''
});

// Pagination states
const currentPage = ref(1);
const lastPage = ref(1);
const totalItems = ref(0);
const perPage = ref(50);

const { showSuccess, showError } = useSnackbar();

const loadCategories = async (page = 1) => {
    const response = await getCategories(page, perPage.value);
    if (response.success) {
        const paginatedData = response.data;
        categories.value = paginatedData.data || [];
        currentPage.value = paginatedData.current_page || 1;
        lastPage.value = paginatedData.last_page || 1;
        totalItems.value = paginatedData.total || 0;
        perPage.value = paginatedData.per_page || 50;
    }
};

const openDialog = () => {
    editingId.value = null;
    formData.value = { name: '', abreviation: '', description: '' };
    isDialogOpen.value = true;
    // Reset form validation state after the dialog renders
    nextTick(() => {
        form.value?.reset();
    });
};

const closeDialog = () => {
    isDialogOpen.value = false;
    editingId.value = null;
    formData.value = { name: '', abreviation: '', description: '' };
    form.value?.reset();
};

const editItem = (category) => {
    editingId.value = category.id;
    formData.value = { ...category };
    isDialogOpen.value = true;
};

const saveCategory = async () => {
    // Validate form before saving
    const { valid } = await form.value.validate();
    console.log('Form valid:', valid);
    if (!valid) {
        showError('Please fix all errors before saving');
        return;
    }

    let response;
    if (editingId.value) {
        response = await updateCategory(editingId.value, formData.value);
    } else {
        response = await createCategory(formData.value);
    }
    console.log('Save response:', response?.status);
    if (response?.status == "success") {
        showSuccess(editingId.value ? 'Category updated successfully' : 'Category created successfully');
        closeDialog();
        await loadCategories(currentPage.value);
    } else {
        showError(response.error);
    }
};

const deleteItem = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
        const response = await deleteCategory(id);
        if (response?.status == "success") {
            showSuccess('Category deleted successfully');
            await loadCategories(currentPage.value);
        } else {
            showError(response.error);
        }
    }
};

const goToPage = (page) => {
    loadCategories(page);
};

onMounted(() => {
    loadCategories();
});
</script>
