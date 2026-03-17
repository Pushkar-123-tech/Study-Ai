"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BookMarked, Search, Trash2, FileText, Sparkles, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  summary: string | null;
  created_at: string;
}

interface SavedNotesClientProps {
  initialNotes: Note[];
}

export function SavedNotesClient({ initialNotes }: SavedNotesClientProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  const filtered = useMemo(
    () => notes.filter((n) => n.title.toLowerCase().includes(search.toLowerCase())),
    [notes, search]
  );

  async function handleDelete(id: string) {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete note");
    } else {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      toast.success("Note deleted");
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Notes</h1>
          <p className="text-gray-500 mt-1 text-sm">{notes.length} note{notes.length !== 1 ? "s" : ""} saved</p>
        </div>
        <Link href="/generate">
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 gap-2">
            <Sparkles className="w-4 h-4" /> Generate New
          </Button>
        </Link>
      </div>

      {notes.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {notes.length === 0 ? (
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-12 text-center">
            <BookMarked className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No saved notes yet</p>
            <p className="text-sm text-gray-400 mb-4">Generate your first note to get started</p>
            <Link href="/generate">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0">
                <Sparkles className="w-4 h-4 mr-2" /> Generate Notes
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-8 text-center">
            <Search className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No notes match &quot;{search}&quot;</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((note) => (
            <Card key={note.id} className="border-0 shadow-sm bg-white hover:shadow-md transition-all group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{note.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                      </p>
                      {note.summary && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                          {note.summary.replace(/[#*]/g, "").slice(0, 120)}...
                        </p>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Note</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{note.title}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(note.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Link href={`/saved-notes/${note.id}`} className="mt-3 flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-medium">
                  Open note <ArrowRight className="w-3 h-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
