<template>
  <div class="flex flex-col h-full w-[280px]">
    <!-- Top: Search + New Note -->
    <div class="p-3 border-b-2 border-[#1C293C] space-y-3">
      <!-- Search -->
      <div class="relative">
        <svg
          class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C293C]"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="square" stroke-linejoin="miter" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchInput"
          type="text"
          placeholder="搜索笔记..."
          class="w-full pl-9 pr-3 py-2 text-sm bg-white border-2 border-[#1C293C] text-[#1C293C] placeholder:text-[#1C293C]/40 focus:outline-none focus:shadow-[3px_3px_0px_#1C293C] transition-shadow"
          @input="handleSearchInput"
        />
      </div>

      <!-- New Note Button -->
      <button
        class="w-full py-2 px-3 text-sm font-bold text-[#1C293C] bg-[#FDC800] border-2 border-[#1C293C] shadow-[3px_3px_0px_#1C293C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#1C293C] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
        @click="handleCreateNote"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="square" stroke-linejoin="miter" d="M12 4v16m8-8H4" />
        </svg>
        新建笔记
      </button>
    </div>

    <!-- Middle: Tag Filter -->
    <div
      v-if="store.allTags.length > 0"
      class="px-3 py-2 border-b-2 border-[#1C293C]"
    >
      <p class="text-[10px] font-bold text-[#1C293C] uppercase tracking-wider mb-2">
        标签筛选
      </p>
      <div class="flex flex-wrap gap-1.5">
        <button
          class="px-2 py-0.5 text-[11px] font-medium border-2 border-[#1C293C] transition-all cursor-pointer"
          :class="store.selectedTag === null
            ? 'bg-[#FDC800] text-[#1C293C]'
            : 'bg-white text-[#1C293C] hover:bg-[#FDC800]/20'
          "
          @click="store.setSelectedTag(null)"
        >
          全部
        </button>
        <button
          v-for="tag in store.allTags"
          :key="tag"
          class="px-2 py-0.5 text-[11px] font-medium border-2 border-[#1C293C] transition-all cursor-pointer"
          :class="store.selectedTag === tag
            ? 'bg-[#432DD7] text-white'
            : 'bg-white text-[#1C293C] hover:bg-[#432DD7]/10'
          "
          @click="store.setSelectedTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- Bottom: Note List -->
    <div class="flex-1 overflow-y-auto">
      <template v-if="store.notes.length > 0">
        <NoteItem
          v-for="note in store.notes"
          :key="note.id"
          :note="note"
        />
      </template>
      <EmptyState v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNoteStore } from '../stores/noteStore'
import NoteItem from './NoteItem.vue'
import EmptyState from './EmptyState.vue'

const store = useNoteStore()

const searchInput = ref('')

function handleSearchInput() {
  store.setSearchQuery(searchInput.value)
}

function handleCreateNote() {
  const title = '新笔记'
  const content = ''
  store.addNote(title, content)
}
</script>
