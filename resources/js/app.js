import './bootstrap';
import './plugins/axios';
import vuetify from './vuetify'
import './styles/theme-mode.css'
import './styles/professional-ui.css'
import 'vuetify/dist/vuetify.min.css';
import 'vue-select/dist/vue-select.css'
import v2Select from 'vue-select';
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/styles';
import router from './router';
import { createApp } from 'vue';
import Home from './layouts/Home.vue';
import JsonExcel from "vue-json-excel3";
import Vue3Toast from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import i18n from './i18n';
const app = createApp({});

app.component('home-component', Home);
app.component('downloadExcel', JsonExcel);
app.use(router);
app.use(i18n);
app.use(vuetify);
app.use(Vue3Toast,{autoClose: 3000});

const refreshFeatherIcons = () => {
	if (window.feather && typeof window.feather.replace === 'function') {
		window.feather.replace({
			width: 14,
			height: 14,
		});
	}
};

router.afterEach(() => {
	setTimeout(() => {
		refreshFeatherIcons();
	}, 0);
});

setTimeout(() => {
	refreshFeatherIcons();
}, 0);

app.mount('#app');
