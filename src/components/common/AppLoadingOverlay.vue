<template>
    <transition name="fade">
        <div v-if="isVisible" class="loading-overlay">
            <div >
                <v-progress-circular
                    :size="size"
                    :width="width"
                    color="primary"
                    indeterminate
                />
                <p v-if="message" class="loading-message">{{ message }}</p>
            </div>
        </div>
    </transition>
</template>

<script setup>
    import { ref } from 'vue';

    defineProps({
        isVisible: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            default: 'Loading...'
        },
        size: {
            type: [String, Number],
            default: 50
        },
        width: {
            type: [String, Number],
            default: 4
        }
    });
</script>

<style scoped>
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }

    .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        background-color: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .loading-message {
        margin: 0;
        font-size: 1rem;
        color: #333;
        font-weight: 500;
    }

    /* Transition animations */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
