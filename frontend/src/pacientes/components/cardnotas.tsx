"use client"

import { useState } from "react"
import { FileText, Plus, Save, Trash } from "lucide-react"

export interface Note {
  id: number
  date: string
  content: string
  type: string
}

interface NotesSectionProps {
  title?: string
  notes: Note[]
}

export function NotesSection({ title = "Notas del Tratamiento", notes: initialNotes }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [newNote, setNewNote] = useState("")
  const [newType, setNewType] = useState("progress")
  const [isAddingNote, setIsAddingNote] = useState(false)

  const handleSaveNote = () => {
    if (newNote.trim()) {
      const newNoteObj: Note = {
        id: notes.length + 1,
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        content: newNote,
        type: newType,
      }
      setNotes([newNoteObj, ...notes])
      setNewNote("")
      setNewType("progress")
      setIsAddingNote(false)
    }
  }

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((n) => n.id !== id))
  }

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case "progress":
        return "bg-blue-50 text-blue-700"
      case "adjustment":
        return "bg-yellow-50 text-yellow-800"
      case "installation":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNoteTypeLabel = (type: string) => {
    switch (type) {
      case "progress":
        return "Progreso"
      case "adjustment":
        return "Ajuste"
      case "installation":
        return "Instalación"
      default:
        return "Nota"
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-8">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 text-lg font-semibold text-gray-900">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>{title}</span>
        </div>
        <button
          className="flex items-center px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition"
          onClick={() => setIsAddingNote(!isAddingNote)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Nota
        </button>
      </div>

      <div className="p-6 space-y-5">
        {isAddingNote && (
          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-3 shadow-inner">
            <textarea
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              placeholder="Escriba sus observaciones sobre el tratamiento del paciente..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            >
              <option value="progress">Progreso</option>
              <option value="adjustment">Ajuste</option>
              <option value="installation">Instalación</option>
            </select>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                onClick={() => {
                  setIsAddingNote(false)
                  setNewNote("")
                  setNewType("progress")
                }}
              >
                Cancelar
              </button>
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={handleSaveNote}
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Nota
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="p-5 border border-gray-200 rounded-2xl bg-gray-50 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getNoteTypeColor(note.type)}`}>
                  {getNoteTypeLabel(note.type)}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{note.date}</span>
                  <button
                    className="flex items-center text-red-500 hover:text-red-700 text-sm transition"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Eliminar
                  </button>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-700">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
