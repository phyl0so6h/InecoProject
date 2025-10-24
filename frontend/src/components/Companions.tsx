import React, { useMemo, useState } from 'react'

type Companion = { id: string; name: string; interests: string[]; regions: string[] }

export function Companions(): React.ReactElement {
  const apiUrl = useMemo(() => (import.meta as any).env?.VITE_API_URL || '/api', [])
    const [items, setItems] = useState<Companion[]>([])

    const search = async () => {
        const res = await fetch(`${apiUrl}/companions/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests: ['culture'] })
        })
        const data = await res.json()
        setItems(Array.isArray(data.items) ? data.items : [])
    }

    return (
        <div className="grid gap-3">
        <button className="px-3 py-2 rounded-md border w-max" onClick={search}>Find Companions</button>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(c => (
            <div key={c.id} className="rounded-lg border p-4">
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm opacity-70">{c.regions.join(', ')}</div>
                <div className="text-sm">{c.interests.join(', ')}</div>
            </div>
            ))}
        </div>
        </div>
    )
}


