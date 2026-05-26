import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Note } from '../types/note'

const STORAGE_KEY = 'markdown-notes'

function loadNotes(): Note[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export const useNoteStore = defineStore('notes', () => {
  const notes = ref<Note[]>(loadNotes())

  const allNotes = computed(() =>
    [...notes.value].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  )

  function addNote(title: string, content: string) {
    const note: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      createdAt: new Date().toISOString(),
    }
    notes.value.unshift(note)
    saveNotes(notes.value)
  }

  function updateNote(id: string, title: string, content: string) {
    const index = notes.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notes.value[index] = { ...notes.value[index], title, content }
      saveNotes(notes.value)
    }
  }

  function deleteNote(id: string) {
    notes.value = notes.value.filter((n) => n.id !== id)
    saveNotes(notes.value)
  }

  return { notes: allNotes, addNote, updateNote, deleteNote }
})
