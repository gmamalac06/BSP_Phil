# ScoutSmart Design Guidelines

## Design Approach
**System Selected**: Material Design with Boy Scouts of the Philippines organizational theming

**Rationale**: As a data-heavy, government-affiliated membership management system requiring efficiency, learnability, and professional credibility, Material Design provides the structured component library and clear visual hierarchy needed for complex administrative tasks while allowing customization for scouting brand identity.

**Key Design Principles**:
- Trustworthy & Professional: Instill confidence in a system managing sensitive scout data
- Efficiency-First: Minimize clicks and cognitive load for frequent administrative tasks
- Clear Hierarchy: Dense information must remain scannable and organized
- Role-Appropriate: Different user types see contextually relevant interfaces

---

## Core Design Elements

### A. Color Palette

**Light Mode**:
- Primary: 210 80% 45% (Scout Blue - trust, reliability)
- Primary Variant: 210 70% 35% (darker blue for emphasis)
- Secondary: 45 90% 50% (Scout Gold - heritage, achievement) - use sparingly for badges, achievements
- Background: 0 0% 98% (soft white)
- Surface: 0 0% 100% (white cards)
- Error: 0 65% 51%
- Success: 140 65% 42%
- Text Primary: 210 15% 20%
- Text Secondary: 210 10% 45%

**Dark Mode**:
- Primary: 210 75% 55%
- Primary Variant: 210 80% 65%
- Secondary: 45 85% 60%
- Background: 210 20% 12%
- Surface: 210 15% 16%
- Text Primary: 210 5% 95%
- Text Secondary: 210 5% 70%

### B. Typography

**Font Families**:
- Primary: 'Inter' (Google Fonts) - clean, highly legible for data
- Headings: 'Inter' with varied weights (600-700)
- Monospace: 'JetBrains Mono' for UIDs, data fields

**Scale**:
- H1: text-4xl font-bold (Dashboard titles)
- H2: text-2xl font-semibold (Section headers)
- H3: text-xl font-semibold (Card titles)
- Body: text-base (Forms, tables, content)
- Small: text-sm (Metadata, secondary info)
- Tiny: text-xs (Timestamps, audit trail)

### C. Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 6, 8, 12, 16** (p-4, m-8, gap-6, etc.)

**Grid System**:
- Dashboard cards: grid with gap-6
- Forms: Single column max-w-2xl with consistent p-6
- Tables: Full-width with responsive horizontal scroll
- Sidebar: Fixed 64 width (w-64) for navigation

### D. Component Library

**Navigation**:
- Sidebar navigation (fixed left, collapsible on mobile)
- Top app bar with user profile, notifications, role indicator
- Breadcrumbs for deep navigation paths
- Tab navigation within sections (e.g., "All Scouts" | "Pending" | "Active")

**Dashboard Cards**:
- Elevated cards (shadow-md) with p-6 padding
- Stat cards: Large number, label, trend indicator
- Quick action cards with icon + text buttons
- Chart cards for enrollment trends and analytics

**Forms**:
- Material-style inputs with floating labels
- Clear field grouping with section headers
- File upload areas with drag-and-drop zones for payment proofs
- Multi-step forms for scout registration (stepper component)
- Required field indicators (*)
- Inline validation with helper text

**Data Tables**:
- Sticky headers for long lists
- Sortable columns with arrow indicators
- Row actions (view, edit, delete) as icon buttons
- Pagination with rows-per-page selector
- Filter chips above table
- Bulk selection with checkboxes
- Export/Print actions in table toolbar

**Data Displays**:
- Scout profile cards with photo, UID, membership status badge
- Timeline component for activity history
- Status badges (Active, Pending, Expired) with color coding
- Achievement/rank badges with scout iconography

**Overlays**:
- Modal dialogs for confirmations and detailed forms
- Side sheets for quick edits and previews
- Toast notifications (top-right) for actions
- Bottom sheets (mobile) for action menus

### E. Page-Specific Patterns

**Login/Authentication**: Centered card on gradient background (scout blue to lighter variant)

**Admin Dashboard**: 
- 4-column stat cards at top
- 2-column layout: charts (left 2/3) + recent activity feed (right 1/3)
- Quick actions section below

**Scout Registration**:
- Multi-step form (stepper: Personal Info → School/Unit → Payment → Review)
- Clear progress indication
- Save draft functionality

**Reports Page**:
- Filter sidebar (left) with date ranges, gender, municipality, unit selectors
- Main area: data visualization + export toolbar + table/grid toggle

**Announcements**:
- Card list layout with announcement type badges
- SMS notification toggle per announcement
- Rich text editor for admin posting

**Audit Trail**:
- Searchable table with timestamp, user, action, details columns
- Advanced filters in collapsible panel

### F. Images

**No Hero Images**: This is a utility application, not a marketing site. Focus on functional UI.

**Image Usage**:
- Scout profile photos (circular avatars, 40px standard, 96px in profile view)
- Unit/school logos in lists and profiles
- Payment proof thumbnails in enrollment review (click to expand)
- Achievement badge icons throughout
- Empty state illustrations for no-data scenarios

### G. Accessibility & Interactions

- Maintain WCAG AA contrast ratios
- Keyboard navigation with visible focus states
- Screen reader labels for all interactive elements
- Loading skeletons for data-fetching states
- Animations: Minimal - only subtle transitions (150ms) for state changes, avoid distracting motion

---

## Role-Based UI Variations

**Admin**: Full access to all modules, analytics emphasis
**Staff**: Forms and list management focus, limited analytics
**Unit Leaders**: Unit-specific dashboard, activity management
**Scouts**: Personal profile view, activity participation, minimal navigation