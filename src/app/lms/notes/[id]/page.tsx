'use client';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ArrowLeft, Pencil, Save, Trash2 } from 'lucide-react';
import { LMS_CARD_CLASS, LMS_PAGE_SUBTITLE } from '../../constants';
import { useLmsState } from '../../state/LmsStateProvider';
import { LmsCtaButton } from '../../components/ux/LmsCtaButton';
import { useLmsToast } from '../../components/ux/LmsToastProvider';
import type { NoteType } from '../../data/ai-mock';

const NOTE_TYPES: NoteType[] = ['Interview Prep', 'Learning Notes', 'Company Research', 'Salary Research'];

export default function LmsNoteDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const search = useSearchParams();
  const toast = useLmsToast();
  const { state, updateNote, deleteNote, careerToggleStep } = useLmsState();

  const note = useMemo(() => state.notes.find((n) => n.id === params.id), [params.id, state.notes]);
  const editMode = search.get('edit') === '1';

  const [title, setTitle] = useState(note?.title ?? '');
  const [type, setType] = useState<NoteType>(note?.type ?? 'Learning Notes');
  const [body, setBody] = useState(note?.body ?? '');

  if (!note) {
    return (
      <div className="space-y-6">
        <Link href="/lms/notes" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:underline">
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to notes
        </Link>
        <div className={`${LMS_CARD_CLASS} text-sm text-gray-600 bg-rose-50/20 border-rose-100`}>
          <p className="font-bold text-rose-800">Note not found</p>
          <p className="mt-1">This note does not exist in your local session state.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="min-w-0">
        <Link href="/lms/notes" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:underline">
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to notes
        </Link>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{note.title}</h1>
        <p className={LMS_PAGE_SUBTITLE}>Frontend-only note detail + edit (mock).</p>
      </div>

      <div className={`${LMS_CARD_CLASS} space-y-4`}>
        {editMode ? (
          <>
            <label className="block space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as NoteType)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 cursor-pointer"
              >
                {NOTE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Body</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-between">
              <div className="flex flex-col sm:flex-row gap-2">
                <LmsCtaButton
                  variant="primary"
                  leftIcon={<Save className="h-4 w-4" strokeWidth={2} />}
                  onClick={() => {
                    updateNote(note.id, { title: title.trim() || note.title, body, type });
                    careerToggleStep('notes');
                    toast.push({ title: 'Saved', message: 'Note updated natively.', tone: 'success' });
                    router.push(`/lms/notes/${note.id}`);
                  }}
                >
                  Save changes
                </LmsCtaButton>
                <LmsCtaButton variant="secondary" onClick={() => router.push(`/lms/notes/${note.id}`)}>
                  Cancel
                </LmsCtaButton>
              </div>
              
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl text-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-50 transition-colors"
                onClick={() => {
                   if (confirm('Are you sure you want to delete this note?')) {
                       deleteNote(note.id);
                       toast.push({ title: 'Note deleted', message: 'Removed from local state.', tone: 'info' });
                       router.push('/lms/notes');
                   }
                }}
              >
                 <Trash2 className="h-4 w-4" />
                 Delete note
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex rounded-full bg-gray-50 border border-gray-200 px-3 py-1 text-sm font-semibold text-gray-800">
                {note.type}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl text-rose-600 px-3 py-2 text-sm font-semibold hover:bg-rose-50 transition-colors"
                  onClick={() => {
                     if (confirm('Are you sure you want to delete this note?')) {
                         deleteNote(note.id);
                         toast.push({ title: 'Note deleted', message: 'Removed from local state.', tone: 'info' });
                         router.push('/lms/notes');
                     }
                  }}
                >
                   <Trash2 className="h-4 w-4" />
                </button>
                <LmsCtaButton
                  variant="secondary"
                  leftIcon={<Pencil className="h-4 w-4" strokeWidth={2} />}
                  onClick={() => router.push(`/lms/notes/${note.id}?edit=1`)}
                >
                  Edit
                </LmsCtaButton>
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last updated · {note.updated}</p>
            <pre className="whitespace-pre-wrap text-sm font-normal text-gray-700 leading-relaxed font-sans mt-4">{note.body}</pre>
          </>
        )}
      </div>
    </div>
  );
}
