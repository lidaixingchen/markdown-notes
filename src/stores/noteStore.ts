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
  const searchQuery = ref('')
  const selectedTag = ref<string | null>(null)
  const activeNoteId = ref<string | null>(null)

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    notes.value.forEach((n) => n.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet)
  })

  const filteredNotes = computed(() => {
    let result = notes.value

    if (selectedTag.value) {
      result = result.filter((n) => n.tags.includes(selectedTag.value!))
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      )
    }

    return result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  })

  const activeNote = computed(() =>
    notes.value.find((n) => n.id === activeNoteId.value)
  )

  function setActiveNote(id: string | null) {
    activeNoteId.value = id
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setSelectedTag(tag: string | null) {
    selectedTag.value = tag
  }

  function addNote(title: string, content: string, tags: string[] = []) {
    const note: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      tags,
      createdAt: new Date().toISOString(),
    }
    notes.value.unshift(note)
    saveNotes(notes.value)
    activeNoteId.value = note.id
    return note
  }

  function updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) {
    const index = notes.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notes.value[index] = { ...notes.value[index], ...updates }
      saveNotes(notes.value)
    }
  }

  function deleteNote(id: string) {
    notes.value = notes.value.filter((n) => n.id !== id)
    saveNotes(notes.value)
    if (activeNoteId.value === id) {
      activeNoteId.value = notes.value[0]?.id ?? null
    }
  }

  return {
    notes: filteredNotes,
    allTags,
    activeNote,
    activeNoteId,
    searchQuery,
    selectedTag,
    setActiveNote,
    setSearchQuery,
    setSelectedTag,
    addNote,
    updateNote,
    deleteNote,
  }
})
