<script setup>
import { ref } from "vue";
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
      <footer class="sticky-footer bg-white">
        <div class="container my-auto">
            <div class="copyright text-center my-auto">
                <span>Copyright &copy; {{ setting.name || 'Dashboard' }} 2024</span>
            </div>
        </div>
    </footer>
</template>
