import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { CalendarClock, Clock3, FileText, Mail, Send, Timer, Upload, Users, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
axios.defaults.withCredentials = true;

export default function ComposeModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [delayMs, setDelayMs] = useState(1000);
  const [hourlyLimit, setHourlyLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_URL}/api/upload`, formData);
      setRecipients(res.data.emails);
      setFileName(file.name);
      setError('');
    } catch (err) {
      setError('Could not read that file. Upload a CSV or TXT file with email addresses.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSchedule = async () => {
    if (!subject || !body || !startTime || recipients.length === 0) {
      return setError('Add a subject, message, start time, and at least one recipient.');
    }
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/schedule`, {
        subject,
        body,
        recipients,
        startTime: new Date(startTime).toISOString(),
        delayBetweenEmailsMs: delayMs,
        hourlyLimit,
      });
      onSuccess();
    } catch (err) {
      setError('Scheduling failed. Check that the API is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/45 backdrop-blur-sm">
      <div className="w-full max-w-xl h-full bg-brand-surface border-l border-brand-border shadow-2xl flex flex-col animate-slide-in">
        <div className="px-7 py-6 border-b border-brand-border flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-accent-primary text-xs font-semibold uppercase tracking-[0.16em]"><Send size={14} /> Campaign builder</div>
            <h2 className="mt-2 text-2xl font-display font-semibold text-text-base">Compose schedule</h2>
            <p className="mt-1 text-sm text-text-muted">Write once. Deliver on your rhythm.</p>
          </div>
          <button onClick={onClose} aria-label="Close compose schedule" className="w-9 h-9 rounded-lg border border-brand-border text-text-muted hover:text-text-base hover:bg-brand-base flex items-center justify-center transition-colors"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-text-base mb-4"><FileText size={16} className="text-accent-primary" /> Message</div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2" htmlFor="campaign-subject">Subject</label>
            <input 
              id="campaign-subject"
              type="text" 
              placeholder="A clear, relevant subject"
              className="w-full bg-brand-base border border-brand-border rounded-lg px-3.5 py-3 text-sm text-text-base placeholder:text-text-muted/60 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/15 outline-none transition"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2" htmlFor="campaign-body">Message body</label>
            <textarea 
              id="campaign-body"
              rows={4}
              placeholder="Keep it concise and personal..."
              className="w-full resize-y bg-brand-base border border-brand-border rounded-lg px-3.5 py-3 text-sm text-text-base placeholder:text-text-muted/60 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/15 outline-none transition"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-text-base"><Users size={16} className="text-accent-primary" /> Audience</div>
              {recipients.length > 0 && <span className="text-xs font-semibold text-accent-primary">{recipients.length} loaded</span>}
            </div>
            <div 
              {...getRootProps()} 
              className={`border border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-accent-primary bg-accent-primary/10' : 'border-brand-border bg-brand-base hover:border-accent-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="mx-auto w-10 h-10 rounded-lg bg-accent-primary/10 text-accent-primary flex items-center justify-center mb-2"><Upload size={19} /></div>
              <p className="text-sm font-medium text-text-base">{isDragActive ? 'Drop your audience here' : fileName || 'Upload your recipient list'}</p>
              <p className="text-xs text-text-muted mt-1">{fileName ? 'Click to replace this file' : 'CSV or TXT, one email per line'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2" htmlFor="campaign-start">Start time</label>
              <input 
                id="campaign-start"
                type="datetime-local" 
                className="w-full bg-brand-base border border-brand-border rounded-lg px-3 py-3 text-sm text-text-base font-mono focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/15 outline-none transition"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2" htmlFor="campaign-delay">Delay between sends</label>
              <input 
                id="campaign-delay"
                type="number" 
                min="0"
                className="w-full bg-brand-base border border-brand-border rounded-lg px-3 py-3 text-sm text-text-base font-mono focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/15 outline-none transition"
                value={delayMs}
                onChange={(e) => setDelayMs(Number(e.target.value))}
              />
              <p className="mt-1.5 text-[11px] text-text-muted">Milliseconds</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2" htmlFor="campaign-limit">Hourly limit per sender</label>
            <input 
              id="campaign-limit"
              type="number" 
              min="1"
              className="w-full bg-brand-base border border-brand-border rounded-lg px-3 py-3 text-sm text-text-base font-mono focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/15 outline-none transition"
              value={hourlyLimit}
              onChange={(e) => setHourlyLimit(Number(e.target.value))}
            />
            <p className="mt-1.5 text-[11px] text-text-muted">A guardrail for each connected sender account</p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-lg border border-brand-border bg-brand-base p-3">
            <div className="flex items-center gap-2 min-w-0"><Mail size={15} className="text-accent-primary shrink-0" /><span className="truncate text-xs text-text-muted"><strong className="block text-sm text-text-base">{recipients.length}</strong>recipients</span></div>
            <div className="flex items-center gap-2 min-w-0"><Timer size={15} className="text-accent-primary shrink-0" /><span className="truncate text-xs text-text-muted"><strong className="block text-sm text-text-base">{delayMs}ms</strong>send spacing</span></div>
            <div className="flex items-center gap-2 min-w-0"><Clock3 size={15} className="text-accent-primary shrink-0" /><span className="truncate text-xs text-text-muted"><strong className="block text-sm text-text-base">{hourlyLimit}/hr</strong>per sender</span></div>
          </div>

          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>}
        </div>

        <div className="px-7 py-5 border-t border-brand-border bg-brand-surface flex gap-3">
          <button 
            className="px-5 py-3 bg-brand-base border border-brand-border rounded-lg text-sm font-medium text-text-base hover:bg-brand-border transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="flex-1 px-5 py-3 bg-accent-primary rounded-lg text-white text-sm font-semibold hover:bg-accent-primary/90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSchedule}
            disabled={loading}
          >
            {loading ? 'Scheduling campaign...' : 'Schedule campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}
