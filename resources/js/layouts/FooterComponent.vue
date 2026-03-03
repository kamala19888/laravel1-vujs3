<script setup>
import { ref } from "vue";
const props = defineProps(["activeTheme"]);
const parseSetting = () => {
    try {
        const rawValue = localStorage.getItem("setting");
        if (!rawValue || rawValue === 'null' || rawValue === 'undefined') {
            return {};
        }
        return JSON.parse(rawValue) ?? {};
    } catch (error) {
        return {};
    }
}
const setting = parseSetting();
</script>
<template>
    <footer
        :class="['footer', 'app-footer', props.activeTheme === 'dark' ? 'app-footer-dark' : 'app-footer-light']"
    >
        <div class="container-fluid my-auto px-2 px-sm-3 px-lg-4">
            <div class="copyright text-center my-auto footer-copy">
                <span>Copyright &copy; {{ setting.name || 'Dashboard' }} 2024</span>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.app-footer {
    font-family: inherit;
    border-top: 1px solid rgba(var(--bs-secondary-rgb), 0.18);
    box-shadow: 0 4px 24px 0 rgba(34, 41, 47, 0.1);
}

.app-footer-light {
    background-color: #ffffff !important;
    color: #6e6b7b !important;
}

.app-footer-dark {
    background-color: #283046 !important;
    color: #d0d2d6 !important;
    border-top-color: rgba(255, 255, 255, 0.14);
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.35);
}

.footer-copy {
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.1px;
    white-space: nowrap;
}

@media (max-width: 576px) {
    .footer-copy {
        font-size: 0.82rem;
        white-space: normal;
    }
}
</style>
