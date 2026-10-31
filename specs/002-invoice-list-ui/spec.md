# Feature Specification: Invoice List UI

**Feature Branch**: `002-invoice-list-ui`

**Created**: 2026-10-31

**Status**: Draft

**Input**: Make the negotiable invoice list clearer for filters, statuses, due dates, and role-aware actions without changing data contracts.

## User Scenarios & Testing

### User Story 1 - Read portfolio status at a glance (Priority: P1)

As an auditor or supervisor, I want summary indicators and clear status labels
so that I can identify active, overdue, observed, and closed cases before opening
an individual record.

**Independent Test**: Load the invoice module with demo data and verify the
summary counts match the visible dataset and overdue records are visually distinct.

**Acceptance Scenarios**:

1. **Given** a list with active, observed, closed, and overdue invoices,
   **When** the module loads, **Then** the summary displays each relevant count.
2. **Given** an invoice past its due date that is not closed, **When** the list is
   displayed, **Then** its row shows a clear overdue indicator and due date.

### User Story 2 - Find a specific invoice quickly (Priority: P1)

As a contributor, I want search and filters grouped clearly so that I can reduce
the list without losing the ability to export the currently filtered results.

**Independent Test**: Search by code, participant, or audit, change stage/status
filters, clear them, and export the remaining rows.

**Acceptance Scenarios**:

1. **Given** several invoices, **When** a search term or filter changes,
   **Then** the visible count and table rows update consistently.
2. **Given** active search or filters, **When** the user chooses clear filters,
   **Then** all records return and the search input is empty.
3. **Given** filtered rows, **When** export is selected, **Then** only the visible
   filtered rows are exported.

### User Story 3 - Use actions safely by role (Priority: P2)

As a user with a specific role, I want row actions labeled and grouped so that
I understand what I can do without confusing review, edit, delete, and detail.

**Independent Test**: Sign in with each demo role and verify action availability
matches existing permission helpers.

**Acceptance Scenarios**:

1. **Given** a role that can review, **When** the row actions render,
   **Then** the review action is available and labeled.
2. **Given** a closed invoice, **When** an auditor views the row,
   **Then** editing is not offered.
3. **Given** an administrator, **When** an invoice row renders,
   **Then** delete remains available without changing its confirmation behavior.

## Edge Cases

- A search with no matches must explain that filters can be cleared.
- A responsible-area user must continue seeing only invoices assigned to that user.
- Missing due dates or amounts must not break rendering or produce invalid labels.
- The list must remain usable on narrow screens through horizontal scrolling and
  responsive summary/filter layout.

## Requirements

### Functional Requirements

- **FR-001**: The invoice module MUST be reachable from the authenticated
  application navigation for supported roles.
- **FR-002**: The list MUST show summary counts for total visible, active,
  overdue, observed, and closed invoices.
- **FR-003**: Each invoice row MUST show code, invoice number, participants,
  amount, stage progress, due date, status, approval status, and actions.
- **FR-004**: Overdue active invoices MUST have a distinct visual indicator.
- **FR-005**: Search and stage/status filters MUST remain functional and MUST
  expose a clear-filters action when any filter is active.
- **FR-006**: CSV export MUST continue using the currently filtered rows.
- **FR-007**: Row actions MUST preserve the existing role helper decisions and
  must have accessible labels or titles.
- **FR-008**: The change MUST NOT alter invoice data structures, stage transitions,
  repository methods, or authorization behavior.

## Success Criteria

- **SC-001**: A user can identify the number of active and overdue invoices
  without opening a detail view.
- **SC-002**: A user can find an invoice by code or participant using one search
  field and can restore the full list with one clear action.
- **SC-003**: All existing invoice repository tests continue to pass.
- **SC-004**: The module is reachable through the application UI for every role
  that can list invoices.
- **SC-005**: Lint, automated tests, and production build complete successfully.

## Assumptions

- The existing demo repository and permission helpers remain authoritative.
- The first iteration is a presentation and navigation improvement only.
- Supabase invoice parity and schema changes are deferred to a later specification.
