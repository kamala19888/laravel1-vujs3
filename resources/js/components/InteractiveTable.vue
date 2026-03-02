<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
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
})

const search = ref('')
const currentPage = ref(1)
const pageSize = ref(props.initialPageSize)
const sortKey = ref('')
const sortDirection = ref('asc')
const fontSize = ref('14')
const density = ref('default')
const visibleColumnKeys = ref([])

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
</script>

<template>
  <div class="interactive-table-wrapper">
    <div class="table-tools">
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

        <details class="columns-toggle">
          <summary>الأعمدة</summary>
          <div class="columns-menu">
            <label
              v-for="column in columns"
              :key="column.key"
              class="form-check d-flex align-items-center gap-2"
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
    </div>

    <div class="table-responsive">
      <table class="table table-bordered text-center" :class="densityClass" :style="tableStyle" width="100%">
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
.table-tools {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
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

.columns-toggle {
  position: relative;
}

.columns-toggle summary {
  list-style: none;
  cursor: pointer;
  padding: 9px 12px;
  border: 1px solid #d8d6de;
  border-radius: 8px;
  background: #fff;
  font-size: 0.85rem;
  font-weight: 600;
}

.columns-menu {
  position: absolute;
  top: 42px;
  right: 0;
  z-index: 10;
  background: #fff;
  border: 1px solid #d8d6de;
  border-radius: 10px;
  padding: 10px;
  min-width: 190px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
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
</style>
