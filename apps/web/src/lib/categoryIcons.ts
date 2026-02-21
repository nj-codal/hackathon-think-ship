import {
    BookOpen, UtensilsCrossed, HeartPulse, Trees, Dumbbell,
    Printer, Wrench, Fuel, Landmark, MapPin,
} from 'lucide-react'
import { type LucideIcon } from 'lucide-react'

const CATEGORY_ICONS: { keyword: string; icon: LucideIcon }[] = [
    { keyword: 'library', icon: BookOpen },
    { keyword: 'food', icon: UtensilsCrossed },
    { keyword: 'clinic', icon: HeartPulse },
    { keyword: 'ngo', icon: HeartPulse },
    { keyword: 'park', icon: Trees },
    { keyword: 'playground', icon: Trees },
    { keyword: 'gym', icon: Dumbbell },
    { keyword: 'xerox', icon: Printer },
    { keyword: 'print', icon: Printer },
    { keyword: 'puncture', icon: Wrench },
    { keyword: 'tyre', icon: Wrench },
    { keyword: 'petrol', icon: Fuel },
    { keyword: 'fuel', icon: Fuel },
    { keyword: 'civic', icon: Landmark },
    { keyword: 'ward', icon: Landmark },
]

export function getCategoryIcon(categoryTitle: string): LucideIcon {
    const lower = categoryTitle.toLowerCase()
    for (const { keyword, icon } of CATEGORY_ICONS) {
        if (lower.includes(keyword)) return icon
    }
    return MapPin
}
