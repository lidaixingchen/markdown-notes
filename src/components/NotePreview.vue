<template>
  <div class="h-full flex flex-col bg-[#FBFBF9] border-2 border-[#1C293C]">
    <template v-if="store.activeNote">
      <!-- 预览头部 -->
      <div class="px-4 py-3 border-b-2 border-[#1C293C] flex items-center justify-between">
        <span class="text-sm font-bold text-[#1C293C]">预览</span>
        <span class="text-xs text-gray-500">
          {{ store.activeNote.title || '未命名笔记' }}
        </span>
      </div>

      <!-- Markdown 渲染区 -->
      <div class="flex-1 overflow-auto p-4">
        <div
          ref="previewRef"
          class="prose prose-sm max-w-none preview-content"
          v-html="renderedHtml"
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { useNoteStore } from '../stores/noteStore'

const store = useNoteStore()
const previewRef = ref<HTMLDivElement | null>(null)

const renderedHtml = computed(() => {
  if (!store.activeNote) return ''
  return marked.parse(store.activeNote.content, { async: false }) as string
})

async function highlightCode() {
  await nextTick()
  if (previewRef.value) {
    hljs.highlightAll()
  }
}

onMounted(() => {
  highlightCode()
})

watch(
  () => store.activeNote?.content,
  () => {
    highlightCode()
  },
  { immediate: true }
)
</script>

<style scoped>
.preview-content :deep(h1) {
  font-weight: 700;
  color: #1C293C;
  border-bottom: 2px solid #1C293C;
  padding-bottom: 0.3em;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-size: 1.75rem;
}

.preview-content :deep(h2) {
  font-weight: 700;
  color: #1C293C;
  border-bottom: 2px solid #1C293C;
  padding-bottom: 0.3em;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-size: 1.5rem;
}

.preview-content :deep(h3) {
  font-weight: 700;
  color: #1C293C;
  border-bottom: 2px solid #1C293C;
  padding-bottom: 0.3em;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-size: 1.25rem;
}

.preview-content :deep(h4) {
  font-weight: 700;
  color: #1C293C;
  border-bottom: 2px solid #1C293C;
  padding-bottom: 0.3em;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-size: 1.125rem;
}

.preview-content :deep(h5) {
  font-weight: 700;
  color: #1C293C;
  border-bottom: 2px solid #1C293C;
  padding-bottom: 0.3em;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-size: 1rem;
}

.preview-content :deep(h6) {
  font-weight: 700;
  color: #1C293C;
  border-bottom: 2px solid #1C293C;
  padding-bottom: 0.3em;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-size: 0.875rem;
}

.preview-content :deep(p) {
}

.preview-content :deep(p) {
  margin-bottom: 1em;
  line-height: 1.7;
  color: #1C293C;
}

.preview-content :deep(code) {
  background-color: #f4f3ec;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  padding: 0.15em 0.4em;
  font-size: 0.9em;
  border: 1px solid #1C293C;
}

.preview-content :deep(pre) {
  background-color: #f4f3ec;
  border: 2px solid #1C293C;
  box-shadow: 4px 4px 0px #1C293C;
  padding: 1em;
  overflow-x: auto;
  margin-bottom: 1em;
}

.preview-content :deep(pre code) {
  background-color: transparent;
  border: none;
  padding: 0;
  font-size: 0.85em;
  line-height: 1.6;
}

.preview-content :deep(blockquote) {
  border-left: 4px solid #FDC800;
  padding-left: 1em;
  margin-left: 0;
  margin-bottom: 1em;
  color: #1C293C;
  font-style: italic;
}

.preview-content :deep(a) {
  color: #432DD7;
  text-decoration: underline;
  font-weight: 600;
}

.preview-content :deep(a:hover) {
  color: #1C293C;
}

.preview-content :deep(ul),
.preview-content :deep(ol) {
  margin-bottom: 1em;
  padding-left: 1.5em;
  list-style: revert;
}

.preview-content :deep(ul) {
  list-style-type: disc;
}

.preview-content :deep(ol) {
  list-style-type: decimal;
}

.preview-content :deep(li) {
  margin-bottom: 0.25em;
  display: list-item;
}

.preview-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;
  border: 2px solid #1C293C;
}

.preview-content :deep(th),
.preview-content :deep(td) {
  border: 2px solid #1C293C;
  padding: 0.5em 0.75em;
}

.preview-content :deep(th),
.preview-content :deep(td) {
  text-align: left;
}

.preview-content :deep(th[align="center"]),
.preview-content :deep(td[align="center"]) {
  text-align: center;
}

.preview-content :deep(th[align="right"]),
.preview-content :deep(td[align="right"]) {
  text-align: right;
}

.preview-content :deep(th) {
  background-color: #FDC800;
  font-weight: 700;
  color: #1C293C;
}

.preview-content :deep(td) {
  background-color: #fff;
}

.preview-content :deep(hr) {
  border: none;
  border-top: 2px solid #1C293C;
  margin: 1.5em 0;
}

.preview-content :deep(img) {
  max-width: 100%;
  border: 2px solid #1C293C;
  box-shadow: 4px 4px 0px #1C293C;
}
</style>
