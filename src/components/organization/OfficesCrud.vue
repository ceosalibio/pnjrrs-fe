<template>
    <div>
        <div class="d-flex justify-space-between mb-4">
            <div>
                <h3>Offices List</h3>
            </div>
            <AppButton
                color="primary"
                @on-click="openDialog"
            >
                + Add Office
            </AppButton>
        </div>

        <v-table v-if="offices.length > 0" class="elevation-1">
            <thead>
                <tr>
                    <!-- <th class="text-left">ID</th> -->
                    <th class="text-left">Unit Name</th>
                    <th class="text-left">Sub Unit Name</th>
                    <th class="text-left">Office Name</th>
                    <th class="text-left">Sub Unit</th>
                    <th class="text-left">Code</th>
                    <th class="text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="office in offices" :key="office.id">
                    <!-- <td>{{ office.id }}</td> -->
                    <td>{{ office?.unit?.name }}</td>
                    <td>{{ office?.sub_unit?.name }}</td>
                    <td class="font-weight-bold">{{ office.name }}</td>
                    <td>{{ office.abreviation }}</td>
                    <td>
                        <div class="d-flex ga-2">
                            <AppButton
                                size="small"
                                color="warning"
                                variant="text"
                                @on-click="editItem(office)"
                            >
                                Edit
                            </AppButton>
                            <AppButton
                                size="small"
                                color="error"
                                variant="text"
                                @on-click="deleteItem(office.id)"
                            >
                                Delete
                            </AppButton>
                        </div>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <div v-else class="text-center py-8">
            <p class="text-grey">No offices found</p>
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
            :title="editingId ? 'Edit Office' : 'Add Office'"
            confirmText="Save"
            @confirm="saveOffice"
            @cancel="closeDialog"
        >
            <v-form ref="form" @submit.prevent="saveOffice">
                <div class="d-flex flex-column ga-4">
                    <AppAutocomplete
                        v-model="formData.unit_id"
                        label="Unit"
                        :items="units"
                        text="name"
                        value="id"
                        :rules="[(v) => !!v || 'Unit is required']"
                    />
                    <AppAutocomplete
                        v-model="formData.sub_unit_id"
                        label="Sub Unit"
                        :items="subunits"
                        text="name"
                        value="id"
        
                    />
                    <AppTextField
                        v-model="formData.name"
                        label="Office Name"
                        placeholder="Enter office name"
                       :rules="[(v) => !!v || 'Office Name is required']"
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
import { ref, onMounted, nextTick , watch} from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import AppDialog from '@/components/common/AppDialog.vue';
import AppTextField from '@/components/forms/AppTextField.vue';
import AppSelect from '@/components/forms/AppSelect.vue';
import AppPagination from '@/components/common/AppPagination.vue';
import { getOffices, createOffice, updateOffice, deleteOffice, getUnits,  getSubUnits } from '@/services/organizationService';
import { useSnackbar } from '@/composables/useSnackbar';
import { required } from '@/utils/rules.js';
import AppAutocomplete from '../forms/AppAutocomplete.vue';

const offices = ref([]);
const units = ref([]);
const subunits = ref([]);
const isDialogOpen = ref(false);
const editingId = ref(null);
const form = ref(null);
const formData = ref({
    unit_id: '',
    sub_unit_id: '',
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

const loadOffices = async (page = 1) => {
    const response = await getOffices(page, perPage.value);
    if (response.success) {
        const paginatedData = response.data;
        offices.value = paginatedData.data || [];
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

const loadSubUnits = async () => {
    const response = await getSubUnits(1, null, formData.value.unit_id);
    if (response.success) {
        const paginatedData = response.data;
        subunits.value = paginatedData.data || paginatedData;
    }
};

const openDialog = async () => {
    await loadUnits();
    editingId.value = null;
    formData.value = { unit_id: '', sub_unit_id: '', name: '', abreviation: '', address: '' };
    isDialogOpen.value = true;
    // Reset form validation state after the dialog renders
    nextTick(() => {
        form.value?.reset();
    });
};

const closeDialog = () => {
    isDialogOpen.value = false;
    editingId.value = null;
    formData.value = { unit_id: '', sub_unit_id: '', name: '', abreviation: '', address: '' };
    form.value?.reset();
};

const editItem = (office) => {
    editingId.value = office.id;
    formData.value = { ...office };
    isDialogOpen.value = true;
};

const saveOffice = async () => {
    // Validate form before saving
    const { valid } = await form.value.validate();
    if (!valid) {
        showError('Please fix all errors before saving');
        return;
    }

    let response;
    if (editingId.value) {
        response = await updateOffice(editingId.value, formData.value);
    } else {
        response = await createOffice(formData.value);
    }

    if (response?.status == "success") {
        showSuccess(editingId.value ? 'Office updated successfully' : 'Office created successfully');
        closeDialog();
        await loadOffices(currentPage.value);
    } else {
        showError(response.error);
    }
};

const deleteItem = async (id) => {
    if (confirm('Are you sure you want to delete this office?')) {
        const response = await deleteOffice(id);
        if (response.success) {
            showSuccess('Office deleted successfully');
            await loadOffices(currentPage.value);
        } else {
            showError(response.error);
        }
    }
};

const goToPage = (page) => {
    loadOffices(page);
};

watch(() => formData.value.unit_id, async (newUnitId) => {
    if (newUnitId) {
        await loadSubUnits();
    } else {
        subunits.value = [];
        formData.value.sub_unit_id = '';
    }
});

onMounted(async () => {
    await loadOffices();
});
</script>
