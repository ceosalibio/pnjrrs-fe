<template>
    <div>
        <div class="d-flex justify-space-between mb-4">
            <div>
                <h3>Sub Units List</h3>
            </div>
            <AppButton
                color="primary"
                @on-click="openDialog"
            >
                + Add Sub Unit
            </AppButton>
        </div>

        <v-table v-if="subunits.length > 0" class="elevation-1">
            <thead>
                <tr>
                    <!-- <th class="text-left">ID</th> -->
                    <th class="text-left">Unit Name</th>
                    <th class="text-left">Sub Unit Name</th>
          
                    <th class="text-left">Abbreviation</th>
                    <th class="text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="subunit in subunits" :key="subunit.id">
                    <!-- <td>{{ subunit.id }}</td> -->
                    <td>{{ subunit?.unit?.name }}</td> 
                    <td class="font-weight-bold">{{ subunit?.name }}</td> 
                    <td>{{ subunit.abreviation }}</td>
                    <td>
                        <div class="d-flex ga-2">
                            <AppButton
                                size="small"
                                color="warning"
                                variant="text"
                                @on-click="editItem(subunit)"
                            >
                                Edit
                            </AppButton>
                            <AppButton
                                size="small"
                                color="error"
                                variant="text"
                                @on-click="deleteItem(subunit.id)"
                            >
                                Delete
                            </AppButton>
                        </div>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <div v-else class="text-center py-8">
            <p class="text-grey">No sub units found</p>
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
            :title="editingId ? 'Edit Sub Unit' : 'Add Sub Unit'"
            confirmText="Save"
            @confirm="saveSubUnit"
            @cancel="closeDialog"
        >
            <v-form ref="form" @submit.prevent="saveSubUnit">
                <div class="d-flex flex-column ga-4">
                    <AppAutocomplete
                        v-model="formData.unit_id"
                        label="Unit"
                        :items="units"
                        text="name"
                        value="id"
                        :rules="[(v) => !!v || 'Unit is required']"
                    />
                    <AppTextField
                        v-model="formData.name"
                        label="Sub Unit Name"
                        placeholder="Enter sub unit name"
                        :rules="[(v) => !!v || 'Name is required']"
                    />
                    <AppTextField
                        v-model="formData.abreviation"
                        label="Abbreviation"
                        placeholder="Enter abbreviation"
                        :rules="[(v) => !!v || 'Abbreviation is required']"
                    />

                    <AppTextField
                        v-model="formData.address"
                        label="Sub Unit Address"
                        placeholder="Enter sub unit address"
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
import { getSubUnits, createSubUnit, updateSubUnit, deleteSubUnit, getUnits } from '@/services/organizationService';
import { useSnackbar } from '@/composables/useSnackbar';
import { required } from '@/utils/rules.js';
import AppAutocomplete from '@/components/forms/AppAutocomplete.vue';

const subunits = ref([]);
const units = ref([]);
const isDialogOpen = ref(false);
const editingId = ref(null);
const form = ref(null);
const formData = ref({
    unit_id: '',
    name: '',
    abreviation: '',
    address: ''
});

// Pagination states
const currentPage = ref(1);
const lastPage = ref(1);
const totalItems = ref(0);
const perPage = ref(50);

const { showSuccess, showError } = useSnackbar();

const loadSubUnits = async (page = 1) => {
    const response = await getSubUnits(page, perPage.value);
    if (response.success) {
        const paginatedData = response.data;
        subunits.value = paginatedData.data || [];
        currentPage.value = paginatedData.current_page || 1;
        lastPage.value = paginatedData.last_page || 1;
        totalItems.value = paginatedData.total || 0;
        perPage.value = paginatedData.per_page || 50;
    }
};

const loadUnits = async () => {
    const response = await getUnits();
    if (response.success) {
        const paginatedData = response.data;
        units.value = paginatedData.data || paginatedData;
    }
};

const openDialog = async () => {
       await loadUnits();
    editingId.value = null;
    formData.value = { unit_id: '', name: '', abreviation: '', address: '' };
    isDialogOpen.value = true;
    // Reset form validation state after the dialog renders
    nextTick(() => {
        form.value?.reset();
    });
};

const closeDialog = () => {
    isDialogOpen.value = false;
    editingId.value = null;
    formData.value = { unit_id: '', name: '', abreviation: '', address: '' };
    form.value?.reset();
};

const editItem = (subunit) => {
    editingId.value = subunit.id;
    formData.value = { ...subunit };
    isDialogOpen.value = true;
};

const saveSubUnit = async () => {
    // Validate form before saving
    const { valid } = await form.value.validate();
    if (!valid) {
        showError('Please fix all errors before saving');
        return;
    }

    let response;
    if (editingId.value) {
        response = await updateSubUnit(editingId.value, formData.value);
    } else {
        response = await createSubUnit(formData.value);
    }

    if (response?.status == "success") {
        showSuccess(editingId.value ? 'Sub Unit updated successfully' : 'Sub Unit created successfully');
        closeDialog();
        await loadSubUnits(currentPage.value);
    } else {
        showError(response.error);
    }
};

const deleteItem = async (id) => {
    if (confirm('Are you sure you want to delete this sub unit?')) {
        const response = await deleteSubUnit(id);
        if (response.success) {
            showSuccess('Sub Unit deleted successfully');
            await loadSubUnits(currentPage.value);
        } else {
            showError(response.error);
        }
    }
};

const goToPage = (page) => {
    loadSubUnits(page);
};

onMounted(async () => {
 
    await loadSubUnits();
});
</script>
