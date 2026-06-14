<template>
    <div>
        <div class="d-flex justify-space-between mb-4">
            <div>
                <h3>Sub Offices List</h3>
            </div>
            <AppButton
                color="primary"
                @on-click="openDialog"
            >
                + Add Sub Office
            </AppButton>
        </div>

        <v-table v-if="suboffices.length > 0" class="elevation-1">
            <thead>
                <tr>
                    <!-- <th class="text-left">ID</th> -->
                    <th class="text-left">Office Name</th>
                    <th class="text-left">Sub Office Name</th>
                    <th class="text-left">Abbreviation</th>
                    <th class="text-left">Address</th>
                    <th class="text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="suboffice in suboffices" :key="suboffice.id">
                    <!-- <td>{{ suboffice.id }}</td> -->
                    <td>{{ suboffice?.office?.name }}</td>
                    <td>{{ suboffice.name }}</td>
                    <td>{{ suboffice.abreviation }}</td>
                    <td>{{ suboffice.address }}</td>
                    <td>
                        <div class="d-flex ga-2">
                            <AppButton
                                size="small"
                                color="warning"
                                variant="text"
                                @on-click="editItem(suboffice)"
                            >
                                Edit
                            </AppButton>
                            <AppButton
                                size="small"
                                color="error"
                                variant="text"
                                @on-click="deleteItem(suboffice.id)"
                            >
                                Delete
                            </AppButton>
                        </div>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <div v-else class="text-center py-8">
            <p class="text-grey">No sub offices found</p>
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
            :title="editingId ? 'Edit Sub Office' : 'Add Sub Office'"
            confirmText="Save"
            @confirm="saveSubOffice"
            @cancel="closeDialog"
        >
            <v-form ref="form" @submit.prevent="saveSubOffice">
                <div class="d-flex flex-column ga-4">
                    <AppAutocomplete
                        v-model="formData.office_id"
                        label="Office"
                        :items="offices"
                        text="name"
                        value="id"
                        :rules="[(v) => !!v || 'Office is required']"
                    />
                    <AppTextField
                        v-model="formData.name"
                        label="Sub Office Name"
                        placeholder="Enter sub office name"
                        :rules="[(v) => !!v || 'Sub Office Name is required']"
                    />
                    <AppTextField
                        v-model="formData.abreviation"
                        label="Abbreviation"
                        placeholder="Enter abbreviation"
                        :rules="[(v) => !!v || 'Abbreviation is required']"
                    />
                    <AppTextField
                        v-model="formData.address"
                        label="Office Address"
                        placeholder="Enter office address"
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
import AppSelect from '@/components/forms/AppSelect.vue';
import AppPagination from '@/components/common/AppPagination.vue';
import { getSubOffices, createSubOffice, updateSubOffice, deleteSubOffice, getOffices } from '@/services/organizationService';
import { useSnackbar } from '@/composables/useSnackbar';
import { required } from '@/utils/rules.js';
import AppAutocomplete from '../forms/AppAutocomplete.vue';

const suboffices = ref([]);
const offices = ref([]);
const isDialogOpen = ref(false);
const editingId = ref(null);
const form = ref(null);
const formData = ref({
    office_id: '',
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

const loadSubOffices = async (page = 1) => {
    const response = await getSubOffices(page, perPage.value);
    if (response.success) {
        const paginatedData = response.data;
        suboffices.value = paginatedData.data || [];
        currentPage.value = paginatedData.current_page || 1;
        lastPage.value = paginatedData.last_page || 1;
        totalItems.value = paginatedData.total || 0;
        perPage.value = paginatedData.per_page || 50;
    }
};

const loadOffices = async () => {
    const response = await getOffices();
    if (response.success) {
        const paginatedData = response.data;
        offices.value = paginatedData.data || paginatedData;
    }
};

const openDialog = async () => {
    await loadOffices();
    editingId.value = null;
    formData.value = { office_id: '', name: '', abreviation: '', address: '' };
    isDialogOpen.value = true;
    // Reset form validation state after the dialog renders
    nextTick(() => {
        form.value?.reset();
    });
};

const closeDialog = () => {
    isDialogOpen.value = false;
    editingId.value = null;
    formData.value = { office_id: '', name: '', abreviation: '', address: '' };
    form.value?.reset();
};

const editItem = async (suboffice) => {
    await loadOffices();
    editingId.value = suboffice.id;
    formData.value = { ...suboffice };
    isDialogOpen.value = true;
};

const saveSubOffice = async () => {
    // Validate form before saving
    const { valid } = await form.value.validate();
    if (!valid) {
        showError('Please fix all errors before saving');
        return;
    }

    let response;
    if (editingId.value) {
        response = await updateSubOffice(editingId.value, formData.value);
    } else {
        response = await createSubOffice(formData.value);
    }

    if (response?.status == "success") {

        showSuccess(editingId.value ? 'Sub Office updated successfully' : 'Sub Office created successfully');
        closeDialog();
        await loadSubOffices(currentPage.value);
    } else {
        showError(response.error);
    }
};

const deleteItem = async (id) => {
    if (confirm('Are you sure you want to delete this sub office?')) {
        const response = await deleteSubOffice(id);
        if (response.success) {
            showSuccess('Sub Office deleted successfully');
            await loadSubOffices(currentPage.value);
        } else {
            showError(response.error);
        }
    }
};

const goToPage = (page) => {
    loadSubOffices(page);
};

onMounted(async () => {
    // await loadOffices();
    await loadSubOffices();
});
</script>
