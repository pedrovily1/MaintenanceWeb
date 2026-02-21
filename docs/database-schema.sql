-- =============================================================================
-- CMMS Database Schema — PostgreSQL / Supabase
-- Generated from: MaintenanceWeb React + TypeScript frontend
-- =============================================================================
-- Execution order matters. Run top-to-bottom in Supabase SQL Editor.
-- Every business table carries site_id for multi-tenant data isolation.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. EXTENSIONS
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()


-- ---------------------------------------------------------------------------
-- 1. SITES
-- One row per physical or logical site (organization tenant unit).
-- ---------------------------------------------------------------------------

CREATE TABLE sites (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name         TEXT        NOT NULL,
    slug         TEXT        NOT NULL UNIQUE, -- URL-safe identifier
    address      TEXT,
    timezone     TEXT        NOT NULL DEFAULT 'UTC',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE sites IS 'Top-level tenant unit. Every business record is scoped to a site.';


-- ---------------------------------------------------------------------------
-- 2. USERS
-- Global user accounts (not site-specific). Site membership is in user_sites.
-- ---------------------------------------------------------------------------

CREATE TABLE users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name     TEXT        NOT NULL,
    role          TEXT        NOT NULL CHECK (role IN ('Administrator', 'Technician', 'Viewer')),
    pin_hash      TEXT        NOT NULL,  -- bcrypt hash of the 4-6 digit PIN
    is_active     BOOLEAN     NOT NULL DEFAULT true,
    avatar_url    TEXT,
    last_visit_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  users IS 'Application users. PIN is stored as a bcrypt hash; never store the raw PIN.';
COMMENT ON COLUMN users.pin_hash IS 'bcrypt hash of the 4–6 digit numeric PIN used for local user-switching.';


-- ---------------------------------------------------------------------------
-- 3. USER_SITES  (many-to-many: users <-> sites)
-- A user can belong to multiple sites, optionally with a site-level role
-- override. If site_role IS NULL the global users.role applies.
-- ---------------------------------------------------------------------------

CREATE TABLE user_sites (
    user_id     UUID  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    site_id     UUID  NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    site_role   TEXT  CHECK (site_role IN ('Administrator', 'Technician', 'Viewer')),
    joined_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, site_id)
);

COMMENT ON TABLE user_sites IS 'Controls which users can access which sites and (optionally) with what role.';


-- ---------------------------------------------------------------------------
-- 4. LOCATIONS
-- Hierarchical (tree). A site is the root; locations nest inside via
-- parent_location_id. Assets and work orders reference locations.
-- ---------------------------------------------------------------------------

CREATE TABLE locations (
    id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id            UUID        NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name               TEXT        NOT NULL,
    description        TEXT,
    address            TEXT,
    parent_location_id UUID        REFERENCES locations(id) ON DELETE RESTRICT,
    image_url          TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  locations IS 'Physical or logical places within a site. Supports unlimited depth via parent_location_id.';
COMMENT ON COLUMN locations.parent_location_id IS 'NULL = root location for this site.';

CREATE INDEX idx_locations_site_id            ON locations(site_id);
CREATE INDEX idx_locations_parent_location_id ON locations(parent_location_id);


-- ---------------------------------------------------------------------------
-- 5. CATEGORIES
-- Grouping labels for work orders. Icons are stored as SVG data-URLs;
-- consider migrating to Supabase Storage URLs for large icons.
-- ---------------------------------------------------------------------------

CREATE TABLE categories (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id             UUID        NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name                TEXT        NOT NULL,
    icon_svg            TEXT,        -- SVG data-URL or Supabase Storage URL
    color               TEXT,        -- Tailwind CSS class, e.g. "bg-teal-50"
    description         TEXT,
    is_active           BOOLEAN     NOT NULL DEFAULT true,
    created_by_user_id  UUID        REFERENCES users(id) ON DELETE SET NULL,
    updated_by_user_id  UUID        REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (site_id, name)           -- names unique within a site (case-insensitive enforced at app level)
);

COMMENT ON TABLE categories IS 'Work-order categories. isActive=false means soft-archived.';

CREATE INDEX idx_categories_site_id  ON categories(site_id);
CREATE INDEX idx_categories_is_active ON categories(site_id, is_active);


-- ---------------------------------------------------------------------------
-- 6. VENDORS
-- External contractors / suppliers. Soft-deleted via is_active.
-- ---------------------------------------------------------------------------

CREATE TABLE vendors (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id             UUID        NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name                TEXT        NOT NULL,
    trade               TEXT,        -- e.g. "Electrical", "HVAC", "Plumbing"
    contact_name        TEXT,
    phone               TEXT,
    email               TEXT,
    address             TEXT,
    notes               TEXT,
    is_active           BOOLEAN     NOT NULL DEFAULT true,
    created_by_user_id  UUID        REFERENCES users(id) ON DELETE SET NULL,
    updated_by_user_id  UUID        REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (site_id, name)
);

COMMENT ON TABLE vendors IS 'External service providers. vendorId=NULL on a work order means internal work.';

CREATE INDEX idx_vendors_site_id   ON vendors(site_id);
CREATE INDEX idx_vendors_is_active ON vendors(site_id, is_active);


-- ---------------------------------------------------------------------------
-- 7. ASSETS
-- Physical or logical equipment. Supports parent-child hierarchy and
-- optional location assignment.
-- ---------------------------------------------------------------------------

CREATE TABLE assets (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id          UUID        NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    asset_tag        TEXT,
    name             TEXT        NOT NULL,
    description      TEXT,
    status           TEXT        NOT NULL DEFAULT 'Active'
                                 CHECK (status IN ('Active', 'Inactive', 'Out of Service')),
    criticality      TEXT        CHECK (criticality IN ('Low', 'Medium', 'High')),
    location_id      UUID        REFERENCES locations(id) ON DELETE SET NULL,
    parent_asset_id  UUID        REFERENCES assets(id) ON DELETE SET NULL,
    category         TEXT,        -- legacy free-text category; migrate to FK when ready
    manufacturer     TEXT,
    model            TEXT,
    serial_number    TEXT,
    install_date     DATE,
    warranty_end     DATE,
    image_url        TEXT,
    notes            TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  assets IS 'Physical equipment. Parent-child hierarchy via parent_asset_id.';
COMMENT ON COLUMN assets.category IS 'Legacy free-text category from the frontend. Consider normalising to a FK later.';

CREATE INDEX idx_assets_site_id         ON assets(site_id);
CREATE INDEX idx_assets_location_id     ON assets(location_id);
CREATE INDEX idx_assets_parent_asset_id ON assets(parent_asset_id);
CREATE INDEX idx_assets_status          ON assets(site_id, status);


-- ---------------------------------------------------------------------------
-- 8. PARTS
-- Inventory items. Stock is tracked per location in part_inventory.
-- ---------------------------------------------------------------------------

CREATE TABLE parts (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id     UUID        NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name        TEXT        NOT NULL,
    description TEXT,
    part_type   TEXT        NOT NULL
                            CHECK (part_type IN ('Spare Part', 'Consumable', 'Tool', 'Safety Equipment', 'Other')),
    unit        TEXT,        -- e.g. "unit", "L", "kg"
    min_stock   INTEGER     NOT NULL DEFAULT 0,
    image_url   TEXT,
    barcode     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE parts IS 'Inventory items. Global part definition; stock is per-location in part_inventory.';

CREATE INDEX idx_parts_site_id ON parts(site_id);


-- ---------------------------------------------------------------------------
-- 9. PART_INVENTORY  (per-location stock for each part)
-- ---------------------------------------------------------------------------

CREATE TABLE part_inventory (
    id           UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id      UUID     NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
    location_id  UUID     NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    quantity     INTEGER  NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    min_quantity INTEGER  NOT NULL DEFAULT 0 CHECK (min_quantity >= 0),
    UNIQUE (part_id, location_id)
);

COMMENT ON TABLE part_inventory IS 'Per-location stock record. Quantity is decremented on work order completion.';

CREATE INDEX idx_part_inventory_part_id     ON part_inventory(part_id);
CREATE INDEX idx_part_inventory_location_id ON part_inventory(location_id);


-- ---------------------------------------------------------------------------
-- 10. ASSET_COMPATIBLE_PARTS  (many-to-many: assets <-> parts)
-- ---------------------------------------------------------------------------

CREATE TABLE asset_compatible_parts (
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    part_id  UUID NOT NULL REFERENCES parts(id)  ON DELETE CASCADE,
    PRIMARY KEY (asset_id, part_id)
);

COMMENT ON TABLE asset_compatible_parts IS 'Links parts that are compatible with (or designated for) a specific asset.';

CREATE INDEX idx_acp_part_id  ON asset_compatible_parts(part_id);
CREATE INDEX idx_acp_asset_id ON asset_compatible_parts(asset_id);


-- ---------------------------------------------------------------------------
-- 11. METERS
-- Measurement points attached to an asset or location.
-- ---------------------------------------------------------------------------

CREATE TABLE meters (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id          UUID        NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name             TEXT        NOT NULL,
    unit             TEXT,        -- e.g. "hrs", "kWh"
    description      TEXT,
    asset_id         UUID        REFERENCES assets(id) ON DELETE SET NULL,
    location_id      UUID        REFERENCES locations(id) ON DELETE SET NULL,
    is_active        BOOLEAN     NOT NULL DEFAULT true,
    -- Denormalised snapshot updated by trigger / app on new reading:
    last_reading     NUMERIC,
    last_reading_at  TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  meters IS 'A measurable quantity tracked over time. Linked to an asset or location.';
COMMENT ON COLUMN meters.last_reading IS 'Denormalised snapshot of the most recent reading value for fast UI display.';

CREATE INDEX idx_meters_site_id     ON meters(site_id);
CREATE INDEX idx_meters_asset_id    ON meters(asset_id);
CREATE INDEX idx_meters_location_id ON meters(location_id);


-- ---------------------------------------------------------------------------
-- 12. METER_READINGS
-- Immutable time-series log. Readings survive meter deletion.
-- ---------------------------------------------------------------------------

CREATE TABLE meter_readings (
    id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id              UUID        NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    meter_id             UUID        NOT NULL REFERENCES meters(id) ON DELETE RESTRICT,
    work_order_id        UUID,        -- SET later once work_orders table exists (FK added below)
    value                NUMERIC     NOT NULL,
    unit_snapshot        TEXT,        -- unit at time of recording; do not rely for current unit
    recorded_by_user_id  UUID        REFERENCES users(id) ON DELETE SET NULL,
    source               TEXT        NOT NULL DEFAULT 'manual'
                                     CHECK (source IN ('manual', 'workorder')),
    recorded_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (meter_id, work_order_id) -- prevents duplicate readings per WO per meter
);

COMMENT ON TABLE  meter_readings IS 'Append-only reading log. Kept even if the meter is deleted.';
COMMENT ON COLUMN meter_readings.unit_snapshot IS 'Snapshot of the meter unit at recording time. Source of truth is meters.unit.';

CREATE INDEX idx_meter_readings_meter_id      ON meter_readings(meter_id);
CREATE INDEX idx_meter_readings_work_order_id ON meter_readings(work_order_id);
CREATE INDEX idx_meter_readings_recorded_at   ON meter_readings(meter_id, recorded_at DESC);


-- ---------------------------------------------------------------------------
-- 13. PROCEDURES  (reusable checklists / inspection templates)
-- ---------------------------------------------------------------------------

CREATE TABLE procedures (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id     UUID        NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name        TEXT        NOT NULL,
    description TEXT,
    version     INTEGER     NOT NULL DEFAULT 1,
    field_count INTEGER     NOT NULL DEFAULT 0, -- computed by app on save
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  procedures IS 'Reusable procedure / checklist templates. Versioned on every save.';
COMMENT ON COLUMN procedures.field_count IS 'Count of input-capable items (excludes Heading/TextBlock). Maintained by the app.';

CREATE INDEX idx_procedures_site_id ON procedures(site_id);


-- ---------------------------------------------------------------------------
-- 14. PROCEDURE_SECTIONS
-- Ordered sections within a procedure.
-- ---------------------------------------------------------------------------

CREATE TABLE procedure_sections (
    id           UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
    procedure_id UUID     NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
    title        TEXT     NOT NULL DEFAULT '',
    order_index  INTEGER  NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE procedure_sections IS 'Ordered grouping of items within a procedure.';

CREATE INDEX idx_procedure_sections_procedure_id ON procedure_sections(procedure_id);


-- ---------------------------------------------------------------------------
-- 15. PROCEDURE_ITEMS
-- Individual fields / content blocks within a section.
-- Kind-specific config is stored as JSONB to avoid a table-per-kind explosion.
-- ---------------------------------------------------------------------------

CREATE TABLE procedure_items (
    id          UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id  UUID     NOT NULL REFERENCES procedure_sections(id) ON DELETE CASCADE,
    kind        TEXT     NOT NULL
                         CHECK (kind IN (
                             'Heading', 'TextBlock', 'TextInput', 'NumberInput',
                             'MultipleChoice', 'YesNoNA', 'Inspection', 'Date',
                             'Photo', 'File', 'Signature', 'MeterReading'
                         )),
    label       TEXT,
    help_text   TEXT,
    required    BOOLEAN  NOT NULL DEFAULT false,
    order_index INTEGER  NOT NULL,
    -- Kind-specific configuration fields:
    config      JSONB    NOT NULL DEFAULT '{}',
    -- config examples by kind:
    --   Heading:         { "level": 1 }
    --   TextBlock:       { "text": "Instructions..." }
    --   TextInput:       { "multiline": true, "placeholder": "...", "maxLength": 500 }
    --   NumberInput:     { "unit": "kg", "min": 0, "max": 100, "step": 0.1 }
    --   MultipleChoice:  { "options": ["A","B"], "otherOption": true }
    --   Photo/File:      { "multiple": true }
    --   MeterReading:    { "meterId": "uuid", "allowedMeterIds": ["uuid"], "unit": "hrs" }
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  procedure_items IS 'Individual item / field within a procedure section. Kind drives UI rendering.';
COMMENT ON COLUMN procedure_items.config IS 'Kind-specific options (options list, min/max, meterId, etc.).';

CREATE INDEX idx_procedure_items_section_id ON procedure_items(section_id);


-- ---------------------------------------------------------------------------
-- 16. WORK_ORDERS  (core CMMS entity)
-- ---------------------------------------------------------------------------

CREATE TABLE work_orders (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id                 UUID        NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    work_order_number       TEXT        NOT NULL,          -- e.g. "#411"
    title                   TEXT        NOT NULL,
    description             TEXT,
    status                  TEXT        NOT NULL DEFAULT 'Open'
                                        CHECK (status IN ('Open', 'On Hold', 'In Progress', 'Done')),
    priority                TEXT        NOT NULL DEFAULT 'Medium'
                                        CHECK (priority IN ('Low', 'Medium', 'High')),
    work_type               TEXT        NOT NULL DEFAULT 'Corrective'
                                        CHECK (work_type IN ('Preventive', 'Corrective', 'Inspection', 'Other')),
    start_date              DATE,
    due_date                DATE        NOT NULL,
    completed_at            TIMESTAMPTZ,
    -- Asset linkage (assetId + display snapshots)
    asset_id                UUID        REFERENCES assets(id) ON DELETE SET NULL,
    asset_name_snapshot     TEXT,       -- denormalised for fast list display
    asset_image_url         TEXT,
    -- Location linkage
    location_id             UUID        REFERENCES locations(id) ON DELETE SET NULL,
    location_name_snapshot  TEXT,       -- denormalised for fast list display
    -- Category (primary; additional via work_order_categories)
    category_id             UUID        REFERENCES categories(id) ON DELETE SET NULL,
    -- Vendor (NULL = internal work)
    vendor_id               UUID        REFERENCES vendors(id) ON DELETE SET NULL,
    -- Assignment (primary; additional users via work_order_assigned_users)
    assigned_to_text        TEXT,       -- legacy free-text "assignedTo" field
    assigned_to_user_id     UUID        REFERENCES users(id) ON DELETE SET NULL,
    -- Recurrence
    is_repeating            BOOLEAN     NOT NULL DEFAULT false,
    schedule_frequency      TEXT        CHECK (schedule_frequency IN ('weekly', 'monthly', 'quarterly')),
    schedule_start_date     DATE,
    schedule_end_date       DATE,
    parent_work_order_id    UUID        REFERENCES work_orders(id) ON DELETE SET NULL,
    occurrence_date         DATE,       -- for recurring instances
    -- Totals (updated on completion)
    total_time_hours        NUMERIC     DEFAULT 0,
    total_cost              NUMERIC     DEFAULT 0,
    -- Audit
    created_by_user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (site_id, work_order_number)
);

COMMENT ON TABLE  work_orders IS 'Central CMMS entity. Tracks maintenance tasks from creation to completion.';
COMMENT ON COLUMN work_orders.assigned_to_text IS 'Legacy free-text field. Prefer assigned_to_user_id for new records.';
COMMENT ON COLUMN work_orders.parent_work_order_id IS 'Points to the recurring template when this is an auto-generated instance.';
COMMENT ON COLUMN work_orders.occurrence_date IS 'Set on recurring instances to identify which occurrence this represents.';

CREATE INDEX idx_wo_site_id              ON work_orders(site_id);
CREATE INDEX idx_wo_status               ON work_orders(site_id, status);
CREATE INDEX idx_wo_due_date             ON work_orders(site_id, due_date);
CREATE INDEX idx_wo_asset_id             ON work_orders(asset_id);
CREATE INDEX idx_wo_location_id          ON work_orders(location_id);
CREATE INDEX idx_wo_assigned_to_user_id  ON work_orders(assigned_to_user_id);
CREATE INDEX idx_wo_parent_id            ON work_orders(parent_work_order_id);
CREATE INDEX idx_wo_created_by           ON work_orders(created_by_user_id);


-- Now that work_orders exists, add the deferred FK from meter_readings:
ALTER TABLE meter_readings
    ADD CONSTRAINT fk_meter_readings_work_order_id
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE SET NULL;


-- ---------------------------------------------------------------------------
-- 17. WORK_ORDER_CATEGORIES  (many-to-many: work_orders <-> categories)
-- A work order can belong to multiple categories.
-- ---------------------------------------------------------------------------

CREATE TABLE work_order_categories (
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    category_id   UUID NOT NULL REFERENCES categories(id)  ON DELETE CASCADE,
    PRIMARY KEY (work_order_id, category_id)
);

CREATE INDEX idx_woc_category_id ON work_order_categories(category_id);


-- ---------------------------------------------------------------------------
-- 18. WORK_ORDER_ASSIGNED_USERS  (many-to-many: work_orders <-> users)
-- Multiple technicians can be assigned to a single work order.
-- ---------------------------------------------------------------------------

CREATE TABLE work_order_assigned_users (
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES users(id)       ON DELETE CASCADE,
    PRIMARY KEY (work_order_id, user_id)
);

CREATE INDEX idx_woau_user_id ON work_order_assigned_users(user_id);


-- ---------------------------------------------------------------------------
-- 19. WORK_ORDER_PARTS
-- Records which parts are earmarked for / consumed by a work order.
-- Inventory is decremented when consumed = true (set on WO completion).
-- ---------------------------------------------------------------------------

CREATE TABLE work_order_parts (
    id                    UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id         UUID     NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    part_id               UUID     NOT NULL REFERENCES parts(id)       ON DELETE RESTRICT,
    part_name_snapshot    TEXT     NOT NULL,   -- display even if part is later renamed
    location_id           UUID     NOT NULL REFERENCES locations(id)   ON DELETE RESTRICT,
    location_name_snapshot TEXT    NOT NULL,
    quantity_used         INTEGER  NOT NULL CHECK (quantity_used > 0),
    consumed              BOOLEAN  NOT NULL DEFAULT false,  -- true once inventory deducted
    UNIQUE (work_order_id, part_id, location_id)
);

COMMENT ON TABLE  work_order_parts IS 'Parts allocated to a WO. consumed=true means inventory was already deducted.';

CREATE INDEX idx_wop_work_order_id ON work_order_parts(work_order_id);
CREATE INDEX idx_wop_part_id       ON work_order_parts(part_id);


-- ---------------------------------------------------------------------------
-- 20. WORK_ORDER_SECTIONS  (legacy / ad-hoc section system)
-- Used by the pre-procedure workflow. New work orders prefer procedure instances.
-- ---------------------------------------------------------------------------

CREATE TABLE work_order_sections (
    id            UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID     NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    title         TEXT     NOT NULL DEFAULT '',
    section_type  TEXT     NOT NULL DEFAULT 'mixed'
                           CHECK (section_type IN ('checklist', 'text', 'photos', 'meters', 'mixed')),
    required      BOOLEAN  NOT NULL DEFAULT false,
    order_index   INTEGER  NOT NULL,
    is_collapsed  BOOLEAN  NOT NULL DEFAULT false,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE work_order_sections IS 'Legacy inline sections directly on a work order (pre-procedure system).';

CREATE INDEX idx_wos_work_order_id ON work_order_sections(work_order_id);


-- ---------------------------------------------------------------------------
-- 21. WORK_ORDER_FIELDS  (fields inside legacy work order sections)
-- ---------------------------------------------------------------------------

CREATE TABLE work_order_fields (
    id                UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id        UUID     NOT NULL REFERENCES work_order_sections(id) ON DELETE CASCADE,
    label             TEXT     NOT NULL DEFAULT '',
    field_type        TEXT     NOT NULL
                               CHECK (field_type IN (
                                   'checkbox', 'multi-checkbox', 'text', 'textarea',
                                   'select', 'photo', 'file', 'meter', 'signature',
                                   'timestamp', 'date', 'yesno_na', 'inspection'
                               )),
    required          BOOLEAN  NOT NULL DEFAULT false,
    options           JSONB,    -- for select / multi-checkbox: string[]
    unit              TEXT,     -- for meter fields
    meter_id          UUID     REFERENCES meters(id) ON DELETE SET NULL,
    allowed_meter_ids JSONB,    -- optional restriction list: string[]
    placeholder       TEXT,
    value             JSONB,    -- stored response value
    order_index       INTEGER  NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE work_order_fields IS 'Individual response fields within legacy work order sections.';

CREATE INDEX idx_wof_section_id ON work_order_fields(section_id);
CREATE INDEX idx_wof_meter_id   ON work_order_fields(meter_id);


-- ---------------------------------------------------------------------------
-- 22. WORK_ORDER_PROCEDURE_INSTANCES
-- When a procedure template is attached to a work order, a snapshot is stored
-- here so historical records remain accurate even if the template changes.
-- ---------------------------------------------------------------------------

CREATE TABLE work_order_procedure_instances (
    id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id             UUID        NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    procedure_id              UUID        NOT NULL REFERENCES procedures(id)  ON DELETE RESTRICT,
    procedure_name_snapshot   TEXT        NOT NULL,
    procedure_version_snapshot INTEGER    NOT NULL,
    procedure_schema_snapshot JSONB       NOT NULL, -- full sections[] snapshot at attach time
    responses                 JSONB       NOT NULL DEFAULT '{}', -- itemId -> value map
    created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  work_order_procedure_instances IS
    'A copy of a procedure template attached to a specific WO. '
    'The schema snapshot ensures historical accuracy when templates are later edited.';

CREATE INDEX idx_wopi_work_order_id ON work_order_procedure_instances(work_order_id);
CREATE INDEX idx_wopi_procedure_id  ON work_order_procedure_instances(procedure_id);


-- ---------------------------------------------------------------------------
-- 23. ATTACHMENTS
-- File attachments for work orders, assets, parts, and procedure responses.
-- Uses a polymorphic entity_type / entity_id pattern.
-- Files should be stored in Supabase Storage; storage_url points to them.
-- ---------------------------------------------------------------------------

CREATE TABLE attachments (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id             UUID        NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name                TEXT        NOT NULL,
    mime_type           TEXT,
    storage_url         TEXT        NOT NULL,  -- Supabase Storage public/signed URL
    size_bytes          INTEGER,
    -- Polymorphic parent
    entity_type         TEXT        NOT NULL
                                    CHECK (entity_type IN (
                                        'work_order',
                                        'work_order_field',
                                        'work_order_procedure_response',
                                        'asset',
                                        'part'
                                    )),
    entity_id           UUID        NOT NULL,   -- PK of the parent record
    field_id            TEXT,                   -- optional: item/field ID within entity
    created_by_user_id  UUID        REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  attachments IS
    'All uploaded files. storage_url must be a Supabase Storage URL (not a base64 blob).';
COMMENT ON COLUMN attachments.entity_type IS
    'Discriminator for the polymorphic parent (work_order, asset, part, etc.).';
COMMENT ON COLUMN attachments.field_id IS
    'Optional sub-field reference (e.g. procedure item ID) within the parent entity.';

CREATE INDEX idx_attachments_site_id    ON attachments(site_id);
CREATE INDEX idx_attachments_entity     ON attachments(entity_type, entity_id);


-- ---------------------------------------------------------------------------
-- 24. WORK_ORDER_COMMENTS
-- Threaded comments on work orders (visible in the Comments section of a WO).
-- ---------------------------------------------------------------------------

CREATE TABLE work_order_comments (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id  UUID        NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    site_id        UUID        NOT NULL REFERENCES sites(id)       ON DELETE CASCADE,
    author_user_id UUID        NOT NULL REFERENCES users(id)       ON DELETE RESTRICT,
    body           TEXT        NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE work_order_comments IS 'User comments on a work order. No threading — flat list ordered by created_at.';

CREATE INDEX idx_woc_work_order_id ON work_order_comments(work_order_id);
CREATE INDEX idx_woc_site_id       ON work_order_comments(site_id);


-- ---------------------------------------------------------------------------
-- 25. CONVERSATIONS  (internal messaging — currently mock in the frontend)
-- ---------------------------------------------------------------------------

CREATE TABLE conversations (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id      UUID        NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    name         TEXT,        -- NULL for 1-on-1; set for group / team channels
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE conversations IS 'Message threads. name=NULL for direct 1-on-1 conversations.';

CREATE INDEX idx_conversations_site_id ON conversations(site_id);


-- ---------------------------------------------------------------------------
-- 26. CONVERSATION_PARTICIPANTS  (many-to-many: conversations <-> users)
-- ---------------------------------------------------------------------------

CREATE TABLE conversation_participants (
    conversation_id UUID        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id         UUID        NOT NULL REFERENCES users(id)         ON DELETE CASCADE,
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX idx_cp_user_id ON conversation_participants(user_id);


-- ---------------------------------------------------------------------------
-- 27. MESSAGES
-- Individual messages within a conversation.
-- ---------------------------------------------------------------------------

CREATE TABLE messages (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id  UUID        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    author_user_id   UUID        NOT NULL REFERENCES users(id)         ON DELETE RESTRICT,
    body             TEXT        NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE messages IS 'Individual messages within a conversation thread.';

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at      ON messages(conversation_id, created_at DESC);


-- =============================================================================
-- ROW LEVEL SECURITY (RLS)  —  Supabase
-- =============================================================================
-- Enable RLS on every business table. The pattern below assumes:
--   • Supabase Auth is used (auth.uid() returns the user's UUID).
--   • The users table maps Supabase Auth UIDs to CMMS user rows.
--   • A helper function get_user_site_ids() returns the site IDs the
--     current user is a member of.
-- =============================================================================

-- Helper: returns the set of site_ids accessible to the calling user.
CREATE OR REPLACE FUNCTION get_user_site_ids()
RETURNS SETOF UUID
LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT site_id FROM user_sites WHERE user_id = auth.uid();
$$;

-- Enable RLS on every table:
ALTER TABLE sites                           ENABLE ROW LEVEL SECURITY;
ALTER TABLE users                           ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sites                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors                         ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets                          ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts                           ENABLE ROW LEVEL SECURITY;
ALTER TABLE part_inventory                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_compatible_parts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE meters                          ENABLE ROW LEVEL SECURITY;
ALTER TABLE meter_readings                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedure_sections              ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedure_items                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_categories           ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_assigned_users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_parts                ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_sections             ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_fields               ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_procedure_instances  ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_comments             ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants       ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages                        ENABLE ROW LEVEL SECURITY;

-- Example SELECT policy for site-scoped tables (repeat pattern for each table):
CREATE POLICY "Users see their own sites" ON sites
    FOR SELECT USING (id IN (SELECT get_user_site_ids()));

CREATE POLICY "Users see locations in their sites" ON locations
    FOR SELECT USING (site_id IN (SELECT get_user_site_ids()));

CREATE POLICY "Users see work orders in their sites" ON work_orders
    FOR SELECT USING (site_id IN (SELECT get_user_site_ids()));

-- NOTE: Add INSERT / UPDATE / DELETE policies per your role-based rules.
--       Administrators get full CRUD; Technicians can update WOs they are
--       assigned to; Viewers get SELECT only.
--       Implement via: auth.uid() -> user_sites.site_role check.


-- =============================================================================
-- SCHEMA DESIGN NOTES
-- =============================================================================

-- 1. MULTI-TENANCY
--    Every business table has site_id. Data is isolated at the DB level via RLS.
--    The user_sites table controls which users can access which sites.

-- 2. ATTACHMENTS STRATEGY
--    The frontend currently encodes files as base64 data-URLs (stored in
--    localStorage). In production, upload files to Supabase Storage and
--    store the resulting public/signed URL in attachments.storage_url.
--    The base64 approach must NOT be used in the database.

-- 3. USER PIN SECURITY
--    The frontend stores raw 4-6 digit PINs. The backend must store
--    bcrypt hashes in users.pin_hash. Never write the raw PIN to the DB.

-- 4. CATEGORY ICONS
--    Currently stored as very long SVG data-URLs. Consider uploading to
--    Supabase Storage and storing the URL instead.

-- 5. LEGACY SECTIONS vs. PROCEDURE INSTANCES
--    The app has two parallel systems:
--      a) work_order_sections / work_order_fields  — legacy inline sections
--      b) work_order_procedure_instances           — newer, preferred approach
--    Both are included to ensure backwards compatibility. Plan to migrate all
--    new work to the procedure instance system over time.

-- 6. WORK ORDER NUMBER SEQUENCING
--    The app generates sequential numbers per site (#1, #2, …).
--    The UNIQUE (site_id, work_order_number) constraint prevents duplicates.
--    A Supabase Edge Function or DB function should generate the next number
--    atomically to avoid race conditions:
--      SELECT COALESCE(MAX(CAST(REPLACE(work_order_number,'#','') AS INTEGER)), 0) + 1
--      FROM work_orders WHERE site_id = $1;
--    Wrap in a transaction with a FOR UPDATE lock on the site row.

-- 7. RECURRING WORK ORDERS
--    Templates are work_orders with is_repeating=true and a schedule.
--    Instances have parent_work_order_id and occurrence_date set.
--    Instances are not themselves repeating (is_repeating=false).

-- 8. INTENTIONALLY OMITTED FIELDS
--    a) users.pin          — Raw PIN not persisted; only bcrypt hash is stored.
--    b) attachments.url (base64) — Replaced by storage_url (Supabase Storage).
--    c) meters.locationName (display helper) — Derived via JOIN to locations.
--    d) part_inventory.locationName — Derived via JOIN to locations.
--    e) work_order_parts.partName / locationName — Stored as _snapshot columns
--       since they are explicitly denormalised in the frontend for display.
--    f) work_order.asset (string) — Replaced by asset_id + asset_name_snapshot.
--    g) work_order.location (string) — Replaced by location_id + location_name_snapshot.
--    h) work_order.occurrenceInstances (Record<date,id>) — Not modelled; can
--       be derived by querying work_orders WHERE parent_work_order_id = $templateId.

-- 9. FIELDS WITH NO BACKEND MODEL YET (frontend mock only)
--    a) IssuesSection fields (failure_detected_during, first_indication_of_trouble,
--       issue_description, issue_remarks) — Currently static HTML with no data
--       binding. These should map to work_order_fields in a dedicated WO section
--       or be added as explicit columns on work_orders when the feature is built.
--    b) ReviewSection signatures (manager_signature, site_lead_signature) — Also
--       currently static HTML. In the DB, these would be procedure_items of kind
--       'Signature' whose responses live in work_order_procedure_instances.responses
--       or as dedicated work_order_fields with field_type='signature'.
--    c) Messages/Conversations — Schema is included (tables 25-27) but currently
--       all data is mock. No store or persistence service exists in the frontend.
