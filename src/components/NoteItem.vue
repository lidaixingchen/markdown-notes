<template>
  <div
    class="group relative p-3 border-b-2 border-[#1C293C] cursor-pointer transition-all duration-150"
    :class="isActive
      ? 'bg-[#FDC800]'
      : 'bg-[#FBFBF9] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1C293C]'
    "
    @click="handleClick"
  >
    <!-- Title -->
    <h3 class="font-bold text-sm text-[#1C293C] truncate pr-6 mb-2">
      {{ note.title || '无标题' }}
    </h3>

    <!-- Tags -->
    <div v-if="note.tags.length > 0" class="flex flex-wrap gap-1 mb-2">
      <span
        v-for="tag in note.tags"
        :key="tag"
        class="inline-block px-1.5 py-0.5 text-[10px] font-medium border-2 border-[#1C293C] bg-[#432DD7] text-white"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Date -->
    <p class="text-[11px] text-[#1C293C] opacity-60 font-mono">
      {{ formatDate(note.createdAt) }}
    </p>

    <!-- Delete button -->
    <button
      class="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      :class="isActive ? 'text-[#1C293C]' : 'text-[#1C293C] hover:text-red-600'"
      title="删除笔记"
      @click.stop="handleDelete"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="square" stroke-linejoin="miter" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { Note } from '../types/note'
import { useNoteStore } from '../stores/noteStore'

const props = defineProps<{
  note: Note
}>()

const store = useNoteStore()

const isActive = computed(() => store.activeNoteId === props.note.id)

function handleClick() {
  store.setActiveNote(props.note.id)
}

function handleDelete() {
  store.deleteNote(props.note.id)
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'yyyy-MM-dd HH:mm', { locale: zhCN })
}
</script>
