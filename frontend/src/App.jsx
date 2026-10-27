import { useEffect, useMemo, useState } from "react";
import { api, API_URL } from "./api";

const COLORS = ["white", "yellow", "mint", "sky", "rose", "lavender"];
const blank = { title: "", content: "", tag: "", color: "yellow", pinned: false };

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export default function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(null); // null = checking
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState(null); // note being created/edited
  const [toast, setToast] = useState("");

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const load = async () => {
    try {
      setNotes(await api.list());
      setOnline(true);
    } catch {
      setOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    const q = query.toLowerCase();
    return notes.filter((n) =>
      [n.title, n.content, n.tag].some((f) => (f || "").toLowerCase().includes(q))
    );
  }, [notes, query]);

  const save = async (e) => {
    e.preventDefault();
    try {
      const { _id, createdAt, updatedAt, __v, ...payload } = editor;
      if (_id) await api.update(_id, payload);
      else await api.create(payload);
      setEditor(null);
      flash(_id ? "Note updated" : "Note added");
      load();
    } catch (err) {
      flash("Error: " + err.message);
    }
  };

  const togglePin = async (n) => {
    try {
      await api.update(n._id, { pinned: !n.pinned });
      load();
    } catch (err) {
      flash("Error: " + err.message);
    }
  };

  const remove = async (n) => {
    if (!window.confirm(`Delete "${n.title}"?`)) return;
    try {
      await api.remove(n._id);
      flash("Note deleted");
      load();
    } catch (err) {
      flash("Error: " + err.message);
    }
  };

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Your thoughts, safely stored in the cloud</p>
          <h1>Inkwell<span>.</span></h1>
        </div>
        <button className="btn primary" onClick={() => setEditor({ ...blank })}>
          + New note
        </button>
      </header>

      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Search by title, text or tag…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search notes"
        />
        <span className="count">{visible.length} {visible.length === 1 ? "note" : "notes"}</span>
      </div>

      {loading && <p className="empty">Waking up the server… free cloud servers can take a few seconds.</p>}
      {!loading && online === false && (
        <div className="empty error">
          Cannot reach the API at <code>{API_URL}</code>. Check VITE_API_URL and that the backend is running.
        </div>
      )}
      {!loading && online && visible.length === 0 && (
        <div className="empty">
          <div className="emoji">📝</div>
          <p>{query ? "No notes match your search." : "No notes yet. Create your first one!"}</p>
        </div>
      )}

      <main className="grid">
        {visible.map((n) => (
          <article className={`note c-${n.color}`} key={n._id}>
            <div className="note-top">
              <h3>{n.title}</h3>
              <button
                className={`icon ${n.pinned ? "on" : ""}`}
                onClick={() => togglePin(n)}
                title={n.pinned ? "Unpin" : "Pin"}
                aria-label={n.pinned ? "Unpin note" : "Pin note"}
              >
                📌
              </button>
            </div>
            <p className="body">{n.content}</p>
            <footer>
              <div className="meta">
                {n.tag && <span className="tag">#{n.tag}</span>}
                <span>{timeAgo(n.updatedAt)}</span>
              </div>
              <div className="actions">
                <button className="link" onClick={() => setEditor(n)}>Edit</button>
                <button className="link danger" onClick={() => remove(n)}>Delete</button>
              </div>
            </footer>
          </article>
        ))}
      </main>

      <footer className="status">
        <span className={`dot ${online === null ? "" : online ? "ok" : "bad"}`} />
        {online === null ? "Checking API…" : online ? "API online" : "API offline"}
        <span className="sep">·</span>
        <code>{API_URL.replace(/^https?:\/\//, "")}</code>
      </footer>

      {editor && (
        <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setEditor(null)}>
          <form className="modal" onSubmit={save}>
            <h2>{editor._id ? "Edit note" : "New note"}</h2>
            <input
              autoFocus
              placeholder="Title"
              value={editor.title}
              maxLength={120}
              required
              onChange={(e) => setEditor({ ...editor, title: e.target.value })}
            />
            <textarea
              rows="6"
              placeholder="Write something…"
              value={editor.content}
              onChange={(e) => setEditor({ ...editor, content: e.target.value })}
            />
            <input
              placeholder="Tag (optional, e.g. study)"
              value={editor.tag}
              maxLength={30}
              onChange={(e) => setEditor({ ...editor, tag: e.target.value })}
            />
            <div className="swatches" role="radiogroup" aria-label="Colour">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  role="radio"
                  aria-checked={editor.color === c}
                  aria-label={c}
                  className={`swatch c-${c} ${editor.color === c ? "sel" : ""}`}
                  onClick={() => setEditor({ ...editor, color: c })}
                />
              ))}
              <label className="pin-check">
                <input
                  type="checkbox"
                  checked={editor.pinned}
                  onChange={(e) => setEditor({ ...editor, pinned: e.target.checked })}
                />
                Pin
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn ghost" onClick={() => setEditor(null)}>Cancel</button>
              <button type="submit" className="btn primary">Save note</button>
            </div>
          </form>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
