import React from 'react'

export function Admin(): React.ReactElement {
    return (
        <div className="grid gap-3">
            <div className="opacity-80">Admin panel (skeleton): manage content, events, partners</div>
            <div className="text-sm">Future: CRUD with role-based access</div>
        </div>
    )
}
