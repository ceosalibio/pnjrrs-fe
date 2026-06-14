<template>
    <div>
        <div class="d-flex justify-space-between mb-4">
            <div>
                <h3>Unit List</h3>
            </div>
            <AppButton
                color="primary"
                @on-click="openDialog"
            >
                + Add Unit
            </AppButton>
        </div>
       

        <v-table v-if="units.length > 0" class="elevation-1">
            <thead>
                <tr>
                    <!-- <th class="text-left">ID</th> -->
                    <th class="text-left">Category Name</th>
                    <th class="text-left">Unit Name</th>
                    <th class="text-left">Abbreviation</th>
                    <th class="text-left">Address</th>
                    <th class="text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="unit in units" :key="unit.id">
                    <!-- <td>{{ unit.id }}</td> -->
                    <td>{{ unit?.category?.name }}</td>
                    <td class="font-weight-bold">{{ unit.name }}</td>
                    <td>{{ unit.abreviation }}</td>
                    <td>{{ unit.address }}</td>
                    <td>
                        <div class="d-flex ga-2">
                            <AppButton
                                size="small"
                                color="warning"
                                variant="text"
                                @on-click="editItem(unit)"
                            >
                                Edit
                            </AppButton>
                            <AppButton
                                size="small"
                                color="error"
                                variant="text"
                                @on-click="deleteItem(unit.id)"
                            >
                                Delete
                            </AppButton>
                        </div>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <div v-else class="text-center py-8">
            <p class="text-grey">No units found</p>
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
            :title="editingId ? 'Edit Unit' : 'Add Unit'"
            confirmText="Save"
            @confirm="saveUnit"
            @cancel="closeDialog"
        >
            <v-form ref="form" @submit.prevent="saveUnit">
                <div class="d-flex flex-column ga-4">
                    <AppAutocomplete 
                        v-model="formData.category_id"
                        label="Category"
                        placeholder="Select category"
                        :text="'name'"
                        :value="'id'"
                        :items="categories"
                        :rules="[(v) => !!v || 'Category is required']"
                    />

                    <AppTextField
                        v-model="formData.name"
                        label="Unit Name"
                        placeholder="Enter unit name"
                        :rules="[(v) => !!v || 'Unit Name is required']"
                    />
                    <AppTextField
                        v-model="formData.abreviation"
                        label="Abbreviation"
                        placeholder="Enter abbreviation"
                        :rules="[(v) => !!v || 'Abbreviation is required']"
                    />

                    <AppTextField
                        v-model="formData.address"
                        label="Unit Address"
                        placeholder="Enter unit address"
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
import { getCategories, getUnits, createUnit, updateUnit, deleteUnit } from '@/services/organizationService';
import { useSnackbar } from '@/composables/useSnackbar';
import AppAutocomplete from '../forms/AppAutocomplete.vue';
import { required } from '@/utils/rules.js';

const units = ref([]);
const isDialogOpen = ref(false);
const editingId = ref(null);
const categories = ref([]);
const form = ref(null);
const formData = ref({
    category_id: null,
    name: '',
    abreviation: '',
    address: '',
});

// Pagination states
const currentPage = ref(1);
const lastPage = ref(1);
const totalItems = ref(0);
const perPage = ref(50);

const { showSuccess, showError } = useSnackbar();

const loadUnits = async (page = 1) => {
    const response = await getUnits(page, perPage.value);
    console.log('Load Units response:', response);  
    if (response.success) {
        const paginatedData = response.data;
        units.value = paginatedData.data || [];
        currentPage.value = paginatedData.current_page || 1;
        lastPage.value = paginatedData.last_page || 1;
        totalItems.value = paginatedData.total || 0;
        perPage.value = paginatedData.per_page || 50;
    }
};

const openDialog = async () => {
    const response = await getCategories();
    categories.value = response.data || [];
    editingId.value = null;
    formData.value = { category_id: null, name: '', abreviation: '', address: ''};
    isDialogOpen.value = true;
    // Reset form validation state after the dialog renders
    nextTick(() => {
        form.value?.reset();
    });
};

const closeDialog = () => {
    isDialogOpen.value = false;
    editingId.value = null;
    formData.value = { category_id: null, name: '', abreviation: '', address: ''};
    form.value?.reset();
};

const editItem = (unit) => {
    editingId.value = unit.id;
    formData.value = { ...unit };
    isDialogOpen.value = true;
};

const saveUnit = async () => {
    const { valid } = await form.value.validate();
    console.log('Form valid:', valid);
    if (!valid) {
        console.log('Form validation failed');
        showError('Please fix all errors before saving');
        return;
    }

    let response;
    if (editingId.value) {
        response = await updateUnit(editingId.value, formData.value);
    } else {
        console.log('Creating unit with data:', formData.value);
        response = await createUnit(formData.value);
    }
    if (response?.status == "success") {
        showSuccess(editingId.value ? 'Unit updated successfully' : 'Unit created successfully');
        closeDialog();
        await loadUnits(currentPage.value);
    } else {
        showError(response.error);
    }
};

const deleteItem = async (id) => {
    if (confirm('Are you sure you want to delete this unit?')) {
        const response = await deleteUnit(id);
        console.log('Delete Unit response:', response); 
        if (response?.success) {
            showSuccess('Unit deleted successfully');
            await loadUnits(currentPage.value);
        } else {
            showError(response.error);
        }
    }
};

const goToPage = (page) => {
    loadUnits(page);
};

onMounted(() => {
    loadUnits();
});
</script>
