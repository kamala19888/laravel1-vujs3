<template>
  <div>
    <div class="demo-inline-spacing p-2 page-top-actions">
      <button
        v-if="chickPermission('translates', 'create')"
        @click="addShow"
        class="btn btn-primary btn-relief-primary"
      >
        {{ isAdd ? $t('back') : $t('add') }}
      </button>
    </div>

    <div v-if="isAdd">
      <v-card max-width="400" class="mx-auto p-2" prepend-icon="mdi-home">
        <template
          v-if="chickPermission('translates', 'create') || chickPermission('translates', 'edit')"
          v-slot:title
        >
          {{ isEdit ? $t('update') : $t('create') }}
        </template>

        <v-card-text>
          <v-form validate-on="submit lazy" @submit.prevent="addLang()">
            <div class="m-auto center">
              <v-sheet max-width="300">
                <v-text-field
                  v-model="keyValue"
                  :rules="[(v) => !!v || 'keyValue is required']"
                  variant="solo"
                  :label="$t('key')"
                ></v-text-field>
              </v-sheet>

              <v-sheet max-width="300" v-for="(lang, index) in refForm" :key="index">
                <v-text-field
                  v-model="lang.value"
                  :rules="[(v) => !!v || `${lang.value} is required`]"
                  variant="solo"
                  :label="$t(lang.lang)"
                ></v-text-field>
              </v-sheet>
            </div>

            <v-sheet max-width="300" class="col-md-6 m-auto">
              <v-btn
                v-if="chickPermission('translates', 'create') || chickPermission('translates', 'update')"
                type="submit"
                block
                class="mt-2"
                :color="isEdit ? 'primary' : 'success'"
                :text="isEdit ? $t('update') : $t('create')"
              ></v-btn>
            </v-sheet>
          </v-form>
        </v-card-text>
        <hr />
      </v-card>
    </div>

    <div v-if="!isAdd" class="row" id="table-head">
      <div class="col-12">
        <div class="card page-card">
          <div class="card-header page-header-bar">
            <div class="page-title-wrap">
              <h4 class="card-title page-title">{{ $t('Table langs') }}</h4>
              <p class="page-subtitle">إدارة مفاتيح الترجمة مع فرز وبحث مرن</p>
            </div>
          </div>

          <div class="table-responsive">
            <InteractiveTable
              :columns="tableColumns"
              :rows="langs"
              row-key="id"
              :enable-pagination="false"
              search-placeholder="بحث في الترجمات"
            >
              <template #cell-actions="{ row }">
                <div class="d-flex">
                  <v-btn
                    v-if="chickPermission('translates', 'edit')"
                    @click="editLang(row.key)"
                    class="ma-2"
                    color="orange-darken-2"
                    icon="mdi-pencil"
                  ></v-btn>
                </div>
              </template>
            </InteractiveTable>

            <Paginate
              v-model="page"
              @click="getLangs(page)"
              :page-count="length"
              :page-range="max"
              :prev-text="$t('previous')"
              :next-text="$t('next')"
              :container-class="'pagination'"
            ></Paginate>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import { toast } from 'vue3-toastify'
import Paginate from 'vuejs-paginate-next'
import axios from 'axios'
import InteractiveTable from '@/components/InteractiveTable.vue'

const errors = ref([])
const notify = (message) => {
  toast.success(message, {
    autoClose: 1000,
    position: toast.POSITION.TOP_CENTER,
  })
}

const perUser = ref(JSON.parse(localStorage.getItem('perUser')))
const chickPermission = (page, per) => {
  const permission = perUser.value.find(
    (permissionItem) => permissionItem.page.page === page && permissionItem[per] === 1
  )
  return !!permission
}

const langs = ref([])
const isAdd = ref(false)
const isEdit = ref(false)
const keyValue = ref('')
const page = ref(1)
const length = ref(1)
const max = ref(3)

const tableColumns = ref([
  { key: 'lang', label: 'اللغة' },
  { key: 'key', label: 'المفتاح' },
  { key: 'value', label: 'القيمة' },
  { key: 'actions', label: 'الإجراءات', visible: chickPermission('translates', 'edit'), sortable: false },
])

const refForm = ref([
  { lang: 'ar', value: '' },
  { lang: 'en', value: '' },
  { lang: 'fr', value: '' },
  { lang: 'tr', value: '' },
])

const getLangForm = () => {
  keyValue.value = ''
  refForm.value = [
    { lang: 'ar', value: '' },
    { lang: 'en', value: '' },
    { lang: 'fr', value: '' },
    { lang: 'tr', value: '' },
  ]
}

const addShow = () => {
  isAdd.value = !isAdd.value
  isEdit.value = false
  getLangForm()
}

const addLang = async () => {
  await axios
    .post(`add-langs`, {
      refForm: refForm.value,
      keyValue: keyValue.value,
      isEdit: isEdit.value,
    })
    .then((r) => {
      const meassge = r.data.message
      isAdd.value = false
      isEdit.value = false
      getLangForm()
      getLangs()
      localStorage.setItem('messages', '')
      axios.get('/get-i18n').then((res) => {
        localStorage.setItem('messages', JSON.stringify(res.data))
      })
      notify(meassge)
    })
    .catch((error) => {
      errors.value = error
    })
}

const editLang = (key) => {
  isAdd.value = true
  isEdit.value = true
  axios.get(`langs/${key}`).then((r) => {
    refForm.value = r.data.langs
    keyValue.value = key
  })
}

const getLangs = async (page = 1) => {
  await axios.get(`langs?page=${page}`).then((r) => {
    langs.value = r.data.langs.data
    length.value = r.data.langs.last_page
  })
}

onMounted(async () => {
  await getLangs(page.value)
})
</script>
