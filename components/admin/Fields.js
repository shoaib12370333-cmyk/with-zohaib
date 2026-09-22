'use client';

export function SectionCard({ title, subtitle, children }) {
  return (
    <details className="bg-white border border-line rounded-2xl mb-4 open:shadow-sm" open>
      <summary className="cursor-pointer select-none px-6 py-5 font-display font-bold text-[1.05rem] flex items-center justify-between">
        <span>
          {title}
          {subtitle && <span className="block font-body font-normal text-slateSoft text-[.85rem] mt-1">{subtitle}</span>}
        </span>
        <span className="text-slateSoft text-xl leading-none">⌄</span>
      </summary>
      <div className="px-6 pb-6 space-y-4">{children}</div>
    </details>
  );
}

export function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="block">
      <span className="block text-[.8rem] font-display font-semibold mb-1.5">{label}</span>
      <input
        type={type}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 border border-line rounded-lg bg-paper focus:bg-white focus:border-teal outline-none text-[.92rem]"
      />
    </label>
  );
}

export function TextArea({ label, value, onChange, rows = 3, placeholder }) {
  return (
    <label className="block">
      <span className="block text-[.8rem] font-display font-semibold mb-1.5">{label}</span>
      <textarea
        rows={rows}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 border border-line rounded-lg bg-paper focus:bg-white focus:border-teal outline-none text-[.92rem]"
      />
    </label>
  );
}

// Edits an array of plain strings as one-per-line text.
export function ListTextArea({ label, items, onChange, rows = 4 }) {
  return (
    <TextArea
      label={`${label} (one per line)`}
      rows={rows}
      value={(items || []).join('\n')}
      onChange={(v) => onChange(v.split('\n'))}
    />
  );
}

export function ImageField({ label, value, onChange, uploading, onUpload }) {
  return (
    <div>
      <span className="block text-[.8rem] font-display font-semibold mb-1.5">{label}</span>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-paper2 border border-line flex-none flex items-center justify-center text-slateSoft text-xs">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : 'None'}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], onChange)}
            className="text-[.85rem]"
          />
          {uploading && <p className="text-teal text-xs mt-1">Uploading…</p>}
          {value && !uploading && (
            <button type="button" onClick={() => onChange('')} className="block text-red-600 text-xs font-display font-semibold hover:underline mt-1.5">
              Remove image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function RangeField({ label, value, onChange, min = 0, max = 100, step = 1 }) {
  return (
    <label className="block mt-3">
      <span className="block text-[.8rem] font-display font-semibold mb-1.5">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? min}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-teal"
      />
    </label>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="block text-[.8rem] font-display font-semibold mb-1.5">{label}</span>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 border border-line rounded-lg bg-paper focus:bg-white focus:border-teal outline-none text-[.92rem]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

export function RemoveButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="text-red-600 text-xs font-display font-semibold hover:underline">
      Remove
    </button>
  );
}

export function AddButton({ onClick, label = '+ Add' }) {
  return (
    <button type="button" onClick={onClick} className="text-tealDeep text-sm font-display font-semibold hover:underline">
      {label}
    </button>
  );
}
