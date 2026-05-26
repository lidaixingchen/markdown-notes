<template>
  <div
    class="flex h-screen bg-[#FBFBF9] relative"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <!-- Drag overlay -->
    <div
      v-if="isDragging"
      class="absolute inset-0 z-50 bg-[#FDC800]/80 border-4 border-dashed border-[#1C293C] flex items-center justify-center"
    >
      <p class="text-2xl font-bold text-[#1C293C]">释放以导入 Markdown 文件</p>
    </div>
    <!-- Left sidebar -->
    <aside
      class="flex-shrink-0 border-r-2 border-[#1C293C] bg-[#FBFBF9] transition-all duration-200 overflow-hidden"
      :class="isLeftCollapsed ? 'w-0 opacity-0' : 'w-[280px] opacity-100'"
    >
      <NoteList />
    </aside>

    <!-- Toggle button -->
    <button
      class="flex-shrink-0 w-8 flex items-center justify-center border-r-2 border-[#1C293C] bg-[#FDC800] hover:bg-[#e0b000] transition-colors cursor-pointer"
      @click="isLeftCollapsed = !isLeftCollapsed"
      :title="isLeftCollapsed ? '展开左栏' : '折叠左栏'"
    >
      <svg
        class="w-4 h-4 text-[#1C293C] transition-transform duration-200"
        :class="isLeftCollapsed ? 'rotate-180' : ''"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="square" stroke-linejoin="miter" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Middle: Editor -->
    <section class="flex-1 border-r-2 border-[#1C293C] bg-[#FBFBF9] overflow-hidden">
      <NoteEditor />
    </section>

    <!-- Right: Preview -->
    <section class="flex-1 bg-[#FBFBF9] overflow-hidden">
      <NotePreview />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NoteList from './components/NoteList.vue'
import NoteEditor from './components/NoteEditor.vue'
import NotePreview from './components/NotePreview.vue'
import { useNoteStore } from './stores/noteStore'

const isLeftCollapsed = ref(false)
const store = useNoteStore()
const isDragging = ref(false)

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (!files) return
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file.name.endsWith('.md') || file.name.endsWith('.markdown') || file.name.endsWith('.txt')) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const text = String(ev.target?.result ?? '')
        const name = file.name.replace(/\.md$|\.markdown$|\.txt$/i, '')
        store.addNote(name || '导入的笔记', text)
      }
      reader.readAsText(file)
    }
  }
}
</script>
