"use client";
import { useState } from "react";

export default function Home(){
  const [query, setQuery] = useState("");
  const [bill, setBill] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);

  async function onCheck(){
    setLoading(true); setError(null); setBill(null); setSchedule(null);
    try{
      const res = await fetch(`/api/get-bill?ref=${encodeURIComponent(query)}`);
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || "Failed");
      setBill(data);
      const s = await fetch(`/api/get-schedule?disco=${encodeURIComponent(data.disco)}&ref=${encodeURIComponent(query)}`);
      if(s.ok){ setSchedule(await s.json()); }
    }catch(e){ setError(e.message); }
    finally{ setLoading(false); }
  }

  return (
    <main className="min-h-screen p-5">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold">Pakistan Electricity Hub — Duplicate Bill, PDF & Load‑Shedding</h1>
        <p className="text-sm text-gray-600 mt-1">Enter your 14‑digit Reference # or 10‑digit Customer ID once → get official bill viewer link, PDF/print, and feeder schedule snapshot.</p>
        <div className="mt-5 flex gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Enter Reference # or Customer ID" className="flex-1 border rounded p-2"/>
          <button onClick={onCheck} className="px-4 py-2 rounded bg-blue-600 text-white">Check</button>
        </div>
        {loading && <p className="mt-4 text-yellow-700">Loading…</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}

        {bill && (
          <div className="mt-6 border rounded p-4 bg-gray-50">
            <h2 className="font-semibold">{bill.disco} — Official Bill</h2>
            <p className="text-sm">Ref/ID: <span className="font-mono">{bill.normalized}</span></p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={bill.viewerUrl} target="_blank" className="px-3 py-2 border rounded">Open Bill (official)</a>
              {bill.pdfUrl && <a href={bill.pdfUrl} target="_blank" className="px-3 py-2 border rounded">PDF</a>}
            </div>
            <p className="text-xs text-gray-500 mt-2">Tip: If PDF doesn’t download, tap “Open Bill” and use the site’s Print/Download button.</p>
          </div>
        )}

        {schedule && (
          <div className="mt-6 border rounded p-4 bg-gray-50">
            <h3 className="font-semibold">Load‑shedding snapshot</h3>
            <p className="text-sm">Source: PITC CCMS feeder schedule</p>
            {schedule.slots?.length ? (
              <ul className="list-disc ml-5 text-sm mt-2">
                {schedule.slots.map((s,i)=>(<li key={i}>{s}</li>))}
              </ul>
            ) : <p className="text-sm">No schedule data available for this reference right now.</p>}
          </div>
        )}

        <div className="mt-8 text-xs text-gray-500">
          By using this tool you open official PITC/DISCO pages for actual bills. We don’t store your numbers.
        </div>
      </div>
    </main>
  );
}
