<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  tableTitle: {
    type: String,
    default: 'قائمة البيانات',
  },
  columns: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...',
  },
  pageSizeOptions: {
    type: Array,
    default: () => [10, 25, 50, 100],
  },
  initialPageSize: {
    type: Number,
    default: 10,
  },
  enablePagination: {
    type: Boolean,
    default: true,
  },
  emptyText: {
    type: String,
    default: 'No data found',
  },
  showTopBar: {
    type: Boolean,
    default: true,
  },
})

const search = ref('')
const currentPage = ref(1)
const pageSize = ref(props.initialPageSize)
const sortKey = ref('')
const sortDirection = ref('asc')
const fontSize = ref('14')
const density = ref('default')
const visibleColumnKeys = ref([])
const showControls = ref(true)

const statusItems = [
  { key: 'active', label: 'فعال', color: '#8cc63f' },
  { key: 'expired', label: 'منتهي الصلاحية', color: '#ff9f1c' },
  { key: 'consumed', label: 'مستهلك', color: '#d6cf3f' },
]

const resetVisibleColumns = () => {
  visibleColumnKeys.value = props.columns
    .filter((column) => column.visible !== false)
    .map((column) => column.key)
}

watch(
  () => props.columns,
  () => {
    resetVisibleColumns()
  },
  { immediate: true, deep: true }
)

watch([search, pageSize], () => {
  currentPage.value = 1
})

const tableStyle = computed(() => ({
  fontSize: `${fontSize.value}px`,
}))

const densityClass = computed(() => {
  if (density.value === 'compact') {
    return 'table-density-compact'
  }

  if (density.value === 'comfortable') {
    return 'table-density-comfortable'
  }

  return 'table-density-default'
})

const visibleColumns = computed(() => {
  return props.columns.filter((column) => visibleColumnKeys.value.includes(column.key))
})

const getCellValue = (row, key) => {
  if (!row || !key) {
    return ''
  }

  const keyParts = key.split('.')
  let value = row

  for (const keyPart of keyParts) {
    if (value == null) {
      return ''
    }

    value = value[keyPart]
  }

  return value ?? ''
}

const filteredRows = computed(() => {
  const sourceRows = Array.isArray(props.rows) ? props.rows : []
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) {
    return sourceRows
  }

  return sourceRows.filter((row) => {
    return visibleColumns.value.some((column) => {
      const rawValue = getCellValue(row, column.key)
      return String(rawValue).toLowerCase().includes(keyword)
    })
  })
})

const sortedRows = computed(() => {
  const rows = [...filteredRows.value]

  if (!sortKey.value) {
    return rows
  }

  return rows.sort((leftRow, rightRow) => {
    const leftValue = String(getCellValue(leftRow, sortKey.value)).toLowerCase()
    const rightValue = String(getCellValue(rightRow, sortKey.value)).toLowerCase()

    if (leftValue === rightValue) {
      return 0
    }

    if (sortDirection.value === 'asc') {
      return leftValue > rightValue ? 1 : -1
    }

    return leftValue < rightValue ? 1 : -1
  })
})

const totalPages = computed(() => {
  if (!props.enablePagination) {
    return 1
  }

  return Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value))
})

const paginatedRows = computed(() => {
  if (!props.enablePagination) {
    return sortedRows.value
  }

  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedRows.value.slice(start, end)
})

const pageNumbers = computed(() => {
  return Array.from({ length: totalPages.value }, (_, index) => index + 1)
})

const rowsCount = computed(() => sortedRows.value.length)

const toggleSort = (column) => {
  if (column.sortable === false) {
    return
  }

  if (sortKey.value !== column.key) {
    sortKey.value = column.key
    sortDirection.value = 'asc'
    return
  }

  if (sortDirection.value === 'asc') {
    sortDirection.value = 'desc'
    return
  }

  sortKey.value = ''
  sortDirection.value = 'asc'
}

const sortIcon = (columnKey) => {
  if (sortKey.value !== columnKey) {
    return '↕'
  }

  return sortDirection.value === 'asc' ? '↑' : '↓'
}

const resetTableOptions = () => {
  search.value = ''
  currentPage.value = 1
  pageSize.value = props.initialPageSize
  sortKey.value = ''
  sortDirection.value = 'asc'
  fontSize.value = '14'
  density.value = 'default'
  resetVisibleColumns()
}

const toggleControls = () => {
  showControls.value = !showControls.value
}
</script>

<template>
  <div class="interactive-table-wrapper">
    <div v-if="showTopBar" class="table-status-strip">
      <div
        v-for="item in statusItems"
        :key="item.key"
        class="status-item"
      >
        <span class="status-dot" :style="{ backgroundColor: item.color }"></span>
        <span>{{ item.label }}</span>
      </div>
    </div>

    <div v-if="showTopBar" class="table-headbar">
      <div class="table-headbar-title">
        <i class="fas fa-table"></i>
        <span>{{ tableTitle }}</span>
        <span class="table-headbar-count">{{ rowsCount }}</span>
      </div>

      <div class="table-headbar-actions">
        <button type="button" class="headbar-icon-btn" @click="toggleControls" title="إظهار/إخفاء الأدوات">
          <i class="fas fa-sliders-h"></i>
        </button>
        <button type="button" class="headbar-icon-btn" @click="resetTableOptions" title="إعادة ضبط">
          <i class="fas fa-undo"></i>
        </button>
      </div>

      <details class="headbar-operations">
        <summary>
          <i class="fas fa-wrench"></i>
          عمليات
        </summary>
        <div class="headbar-menu">
          <button class="btn btn-sm btn-outline-primary w-100 mb-2" @click="resetTableOptions">
            إعادة الضبط
          </button>
          <div class="headbar-menu-label">إظهار/إخفاء الأعمدة</div>
          <label
            v-for="column in columns"
            :key="`headbar-col-${column.key}`"
            class="form-check d-flex align-items-center gap-2 mb-1"
          >
            <input
              v-model="visibleColumnKeys"
              :value="column.key"
              class="form-check-input"
              type="checkbox"
            />
            <span>{{ column.label }}</span>
          </label>
        </div>
      </details>
    </div>

    <div v-if="showControls" class="table-tools">
      <div class="table-tools-left">
        <div class="table-tool-label">بحث سريع</div>
        <input
          v-model="search"
          class="form-control"
          :placeholder="searchPlaceholder"
          type="text"
        />
      </div>

      <div class="table-tools-right">
        <div class="table-tool-group">
          <span class="table-tool-label">الخط</span>
        <select v-model="fontSize" class="form-select table-tool-select">
          <option value="12">خط صغير</option>
          <option value="14">خط متوسط</option>
          <option value="16">خط كبير</option>
        </select>
        </div>

        <div class="table-tool-group">
          <span class="table-tool-label">الكثافة</span>
        <select v-model="density" class="form-select table-tool-select">
          <option value="compact">صفوف مضغوطة</option>
          <option value="default">صفوف عادية</option>
          <option value="comfortable">صفوف مريحة</option>
        </select>
        </div>

        <div v-if="enablePagination" class="table-tool-group">
          <span class="table-tool-label">العرض</span>
        <select v-if="enablePagination" v-model="pageSize" class="form-select table-tool-select">
          <option v-for="option in pageSizeOptions" :key="option" :value="option">
            {{ option }} / صفحة
          </option>
        </select>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered text-center modern-data-table" :class="densityClass" :style="tableStyle" width="100%">
        <thead>
          <tr>
            <th
              v-for="column in visibleColumns"
              :key="column.key"
              class="sortable-header"
              @click="toggleSort(column)"
            >
              {{ column.label }}
              <span class="sort-icon">{{ sortIcon(column.key) }}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="paginatedRows.length === 0">
            <td :colspan="Math.max(visibleColumns.length, 1)">{{ emptyText }}</td>
          </tr>

          <tr
            v-for="row in paginatedRows"
            :key="row[rowKey] ?? JSON.stringify(row)"
          >
            <td v-for="column in visibleColumns" :key="column.key">
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="getCellValue(row, column.key)"
              >
                {{ getCellValue(row, column.key) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="enablePagination" class="table-pagination">
      <button
        class="btn btn-outline-secondary btn-sm"
        :disabled="currentPage <= 1"
        @click="currentPage = Math.max(1, currentPage - 1)"
      >
        السابق
      </button>

      <button
        v-for="number in pageNumbers"
        :key="number"
        class="btn btn-sm"
        :class="number === currentPage ? 'btn-primary' : 'btn-outline-primary'"
        @click="currentPage = number"
      >
        {{ number }}
      </button>

      <button
        class="btn btn-outline-secondary btn-sm"
        :disabled="currentPage >= totalPages"
        @click="currentPage = Math.min(totalPages, currentPage + 1)"
      >
        التالي
      </button>
    </div>
  </div>
</template>

<style scoped>
.interactive-table-wrapper {
  border: 1px solid rgba(var(--bs-secondary-rgb), 0.15);
  border-radius: 12px;
  overflow: hidden;
}

.table-status-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: rgba(var(--bs-secondary-rgb), 0.12);
  border-bottom: 1px solid rgba(var(--bs-secondary-rgb), 0.15);
}

.status-item {
  background: #f8f8f9;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #5e5873;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.table-headbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #2f3946;
  color: #fff;
}

.table-headbar-actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.headbar-icon-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.headbar-icon-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.table-headbar-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.92rem;
  font-weight: 700;
}

.table-headbar-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 0.78rem;
  font-weight: 700;
}

.headbar-operations {
  position: relative;
}

.headbar-operations summary {
  list-style: none;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-weight: 600;
  font-size: 0.84rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.headbar-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 20;
  min-width: 220px;
  max-height: 320px;
  overflow-y: auto;
  background: #fff;
  color: #5e5873;
  border: 1px solid #d8d6de;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.headbar-menu-label {
  font-size: 0.78rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #6e6b7b;
}

.table-tools {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 0;
  padding: 12px;
  background: #f8f8f9;
  border-bottom: 1px solid rgba(var(--bs-secondary-rgb), 0.15);
  flex-wrap: wrap;
}

.table-responsive {
  margin-top: 0;
}

.table-tools-left {
  flex: 1 1 260px;
}

.table-tools-right {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.table-tool-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.table-tool-label {
  font-size: 0.78rem;
  font-weight: 600;
  opacity: 0.85;
}

.table-tool-select {
  min-width: 130px;
}

.modern-data-table thead th {
  background: #2f3946;
  color: #fff;
  border-color: #44505e;
  font-size: 0.84rem;
}

.modern-data-table tbody td {
  border-color: rgba(var(--bs-secondary-rgb), 0.16);
}

.sortable-header {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.sort-icon {
  margin-inline-start: 6px;
  opacity: 0.7;
}

.table-density-compact td,
.table-density-compact th {
  padding-top: 4px;
  padding-bottom: 4px;
}

.table-density-default td,
.table-density-default th {
  padding-top: 9px;
  padding-bottom: 9px;
}

.table-density-comfortable td,
.table-density-comfortable th {
  padding-top: 14px;
  padding-bottom: 14px;
}

.table-pagination {
  display: flex;
  gap: 6px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.interactive-table-wrapper :deep(.v-btn) {
  margin: 0 !important;
}

.dark-layout .table-tools {
  background: #242b3d;
  border-bottom-color: #3b4253;
}

.dark-layout .status-item {
  background: #2b3344;
  color: #d0d2d6;
}

.dark-layout .headbar-menu {
  background: #283046;
  color: #d0d2d6;
  border-color: #3b4253;
}

.dark-layout .headbar-menu-label {
  color: #b4b7bd;
}

.dark-layout .modern-data-table thead th {
  background: #2b3344;
  border-color: #3b4253;
}

.dark-layout .modern-data-table tbody td {
  border-color: #3b4253;
}
</style>
