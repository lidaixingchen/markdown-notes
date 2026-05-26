<template>
  <div class="h-full flex flex-col bg-[#FBFBF9] border-2 border-[#1C293C]">
    <template v-if="store.activeNote">
      <!-- 标题输入 -->
      <div class="p-4 border-b-2 border-[#1C293C]">
        <input
          v-model="title"
          type="text"
          placeholder="笔记标题"
          class="w-full text-2xl font-bold text-[#1C293C] placeholder:text-gray-400 bg-transparent outline-none"
          @input="onTitleInput"
        />
      </div>

      <!-- 标签输入区 -->
      <div class="px-4 py-3 border-b-2 border-[#1C293C] flex flex-wrap items-center gap-2">
        <span class="text-sm font-semibold text-[#1C293C]">标签:</span>
        <span
          v-for="tag in store.activeNote.tags"
          :key="tag"
          class="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-[#1C293C] bg-[#FDC800] border-2 border-[#1C293C] shadow-[2px_2px_0px_#1C293C]"
        >
          {{ tag }}
          <button
            class="ml-1 font-bold hover:text-[#432DD7]"
            @click="removeTag(tag)"
          >
            x
          </button>
        </span>
        <input
          v-model="tagInput"
          type="text"
          placeholder="添加标签..."
          class="text-sm px-2 py-1 border-2 border-[#1C293C] bg-white outline-none focus:shadow-[2px_2px_0px_#1C293C] transition-shadow"
          @keydown.enter.prevent="addTag"
        />
      </div>

      <!-- Markdown 编辑器 -->
      <div class="flex-1 min-h-0">
        <textarea
          v-model="content"
          placeholder="在此输入 Markdown..."
          class="w-full h-full p-4 resize-none outline-none border-0 text-[#1C293C] bg-white font-mono text-sm leading-relaxed"
          @input="onContentInput"
        />
      </div>

      <!-- 底部工具栏 -->
      <div class="px-4 py-3 border-t-2 border-[#1C293C] flex items-center gap-3">
        <button
          class="px-4 py-2 text-sm font-bold text-[#1C293C] bg-white border-2 border-[#1C293C] shadow-[3px_3px_0px_#1C293C] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#1C293C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          @click="onImport"
        >
          导入
        </button>
        <button
          class="px-4 py-2 text-sm font-bold text-[#1C293C] bg-[#FDC800] border-2 border-[#1C293C] shadow-[3px_3px_0px_#1C293C] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#1C293C] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          @click="showExportModal = true"
        >
          导出
        </button>
        <input
          ref="fileInputRef"
          type="file"
          accept=".md,.markdown,.txt"
          class="hidden"
          @change="handleFileImport"
        />
      </div>
    </template>

    <!-- 未选中笔记提示 -->
    <div
      v-else
      class="flex-1 flex items-center justify-center text-lg font-bold text-gray-400"
    >
      请选择或创建笔记
    </div>

    <!-- 导出弹窗 -->
    <ExportModal
      v-model:visible="showExportModal"
      @export-md="exportMarkdown"
      @export-pdf="exportPdf"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNoteStore } from '../stores/noteStore'
import ExportModal from './ExportModal.vue'

const store = useNoteStore()

const title = ref('')
const content = ref('')
const tagInput = ref('')
const showExportModal = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

// 同步 activeNote 到本地编辑状态
watch(
  () => store.activeNote,
  (note) => {
    if (note) {
      title.value = note.title
      content.value = note.content
      tagInput.value = ''
    } else {
      title.value = ''
      content.value = ''
      tagInput.value = ''
    }
  },
  { immediate: true }
)

function onTitleInput() {
  if (store.activeNote) {
    store.updateNote(store.activeNote.id, { title: title.value })
  }
}

function onContentInput() {
  if (store.activeNote) {
    store.updateNote(store.activeNote.id, { content: content.value })
  }
}

function addTag() {
  const raw = tagInput.value.trim()
  if (!raw || !store.activeNote) return

  const newTags = raw.split(/[,，\s]+/).filter((t) => t.length > 0)
  const existing = new Set(store.activeNote.tags)
  const merged = Array.from(new Set([...store.activeNote.tags, ...newTags.filter((t) => !existing.has(t))]))

  store.updateNote(store.activeNote.id, { tags: merged })
  tagInput.value = ''
}

function removeTag(tag: string) {
  if (!store.activeNote) return
  const next = store.activeNote.tags.filter((t) => t !== tag)
  store.updateNote(store.activeNote.id, { tags: next })
}

function onImport() {
  fileInputRef.value?.click()
}

function handleFileImport(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const text = String(e.target?.result ?? '')
    const name = file.name.replace(/\.md$|\.markdown$|\.txt$/i, '')
    store.addNote(name || '导入的笔记', text)
  }
  reader.readAsText(file)
  target.value = ''
}

function exportMarkdown() {
  if (!store.activeNote) return
  const blob = new Blob([store.activeNote.content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${store.activeNote.title || 'untitled'}.md`
  a.click()
  URL.revokeObjectURL(url)
}

function exportPdf() {
  if (!store.activeNote) return
  showExportModal.value = false

  // 获取预览区域的 DOM 元素
  const previewEl = document.querySelector('.preview-content') as HTMLElement
  if (!previewEl) return

  import('html2pdf.js').then((html2pdf) => {
    const opt = {
      margin: 10,
      filename: `${store.activeNote!.title || 'untitled'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
    }
    html2pdf.default().set(opt).from(previewEl).save()
  })
}
</script>

<style scoped>
textarea {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
}
</style>
