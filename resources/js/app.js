import './bootstrap';
import './plugins/axios';
import vuetify from './vuetify'
import './styles/theme-mode.css'
import './styles/professional-ui.css'
import 'vue-select/dist/vue-select.css'
import v2Select from 'vue-select';
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles';
import router from './router';
import { createApp, nextTick } from 'vue';
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

const refreshFeatherIcons = async () => {
	await nextTick();
	if (window.feather && typeof window.feather.replace === 'function') {
		window.feather.replace({
			width: 14,
			height: 14,
		});
	}
};

let featherRefreshQueued = false;
const queueFeatherRefresh = () => {
	if (featherRefreshQueued) {
		return;
	}
	featherRefreshQueued = true;
	window.requestAnimationFrame(() => {
		setTimeout(async () => {
			await refreshFeatherIcons();
			featherRefreshQueued = false;
		}, 0);
	});
};

router.afterEach(() => {
	queueFeatherRefresh();
});

window.addEventListener('load', () => {
	queueFeatherRefresh();
});

if (typeof MutationObserver !== 'undefined') {
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (!(node instanceof Element)) {
					continue;
				}
				if (
					node.matches('i[data-feather], span[data-feather]') ||
					node.querySelector('i[data-feather], span[data-feather]')
				) {
					queueFeatherRefresh();
					return;
				}
			}
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
}

setTimeout(() => {
	queueFeatherRefresh();
}, 0);

app.mount('#app');
