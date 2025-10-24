import React, { useState } from 'react'

type Props = {
    onSelect: (region: string) => void
}

const regions = [
    'Երևան', 'Արագածոտն', 'Արարատ', 'Արմավիր', 'Գեղարքունիք', 'Կոտայք', 'Լոռի', 'Շիրակ', 'Սյունիք', 'Տավուշ', 'Վայոց Ձոր'
]

export function ArmeniaMap({ onSelect }: Props): React.ReactElement {
    const [hovered, setHovered] = useState<string | null>(null)
    return (
        <div className="grid grid-cols-3 gap-2">
        {regions.map(r => (
            <button
            key={r}
            onMouseEnter={() => setHovered(r)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(r)}
            className={`rounded-lg p-3 text-left border transition-colors ${hovered === r ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'}`}
            aria-label={r}
            >
            <div className="font-medium">{r}</div>
            <div className="text-xs opacity-70">hover/click</div>
            </button>
        ))}
        </div>
    )
}


