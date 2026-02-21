/**
 * One-time cleanup: removes duplicate categories created by seed.ts that
 * overlap with migrate-batch.ts categories, and re-points their resources.
 *
 * Run from apps/web:  pnpm --filter @repo/web cleanup
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@sanity/client'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
})

/**
 * Map: old seed category ID → canonical migrate-batch category ID
 * Only entries where a true duplicate exists are listed here.
 */
const CATEGORY_MERGES: Record<string, string> = {
    'category-food-bank-ngo':    'category-food-bank',   // "Food Bank / NGO" → "Food Bank & NGO"
    'category-free-clinic-ngo':  'category-clinic',       // "Free Clinic / NGO" → "Free Clinic / OPD"
}

async function main() {
    console.log('Starting duplicate cleanup...\n')

    for (const [oldId, newId] of Object.entries(CATEGORY_MERGES)) {
        // 1. Find resources still pointing to the old category
        const resources = await client.fetch<Array<{ _id: string; title: string }>>(
            `*[_type == "resource" && category._ref == $ref]{ _id, title }`,
            { ref: oldId }
        )

        if (resources.length > 0) {
            console.log(`  Re-pointing ${resources.length} resource(s) from "${oldId}" → "${newId}":`)
            const tx = client.transaction()
            for (const r of resources) {
                tx.patch(r._id, { set: { category: { _type: 'reference', _ref: newId } } })
                console.log(`    - ${r.title}`)
            }
            await tx.commit()
        } else {
            console.log(`  No resources reference "${oldId}" — skipping re-point`)
        }

        // 2. Delete the old duplicate category document
        try {
            await client.delete(oldId)
            console.log(`  Deleted category: ${oldId}\n`)
        } catch {
            console.log(`  Category "${oldId}" not found (already deleted?)\n`)
        }
    }

    console.log('Cleanup complete!')
}

main().catch(err => {
    console.error('Cleanup failed:', err)
    process.exit(1)
})
