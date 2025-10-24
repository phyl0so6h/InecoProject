import React from 'react'
import { Companions } from '../components/Companions'

export function CompanionsPage(): React.ReactElement {
  return (
    <section className="rounded-xl border border-neutral-200/60 dark:border-neutral-800 p-6">
      <h2 className="text-xl font-semibold mb-2">Companions</h2>
      <Companions />
    </section>
  )
}


