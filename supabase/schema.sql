-- Auditoría 360 · Esquema PostgreSQL para Supabase
-- Ejecutar en un proyecto nuevo desde SQL Editor.

create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('Administrador', 'Auditor', 'Supervisor', 'Consulta');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.approval_state as enum ('Pendiente', 'Aprobado', 'Rechazado');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 3 and 100),
  email text not null,
  role public.app_role not null default 'Consulta',
  created_at timestamptz not null default now()
);

create table if not exists public.audits (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 180),
  description text not null,
  owner text not null,
  status text not null check (status in ('Planificada', 'En Proceso', 'Completada', 'Cerrada')),
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  observations text,
  approval_status public.approval_state not null default 'Pendiente',
  approval_notes text,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  updated_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.risks (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 3 and 180),
  category text not null,
  probability smallint not null check (probability between 1 and 5),
  impact smallint not null check (impact between 1 and 5),
  level text not null check (level in ('Bajo', 'Medio', 'Alto', 'Crítico')),
  status text not null check (status in ('Identificado', 'En Tratamiento', 'Mitigado', 'Aceptado')),
  approval_status public.approval_state not null default 'Pendiente',
  approval_notes text,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  updated_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.controls (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 3 and 180),
  process text not null,
  responsible text not null,
  compliance numeric(5,2) not null check (compliance between 0 and 100),
  observations text,
  approval_status public.approval_state not null default 'Pendiente',
  approval_notes text,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  updated_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.security_incidents (
  id uuid primary key default gen_random_uuid(),
  incident_type text not null,
  severity text not null check (severity in ('Baja', 'Media', 'Alta', 'Crítica')),
  description text not null,
  incident_date date not null,
  status text not null check (status in ('Abierto', 'En Investigación', 'Contenido', 'Resuelto', 'Cerrado')),
  approval_status public.approval_state not null default 'Pendiente',
  approval_notes text,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  updated_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.findings (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 180),
  audit_title text not null,
  severity text not null check (severity in ('Baja', 'Media', 'Alta', 'CrÃ­tica')),
  status text not null check (status in ('Abierto', 'En remediaciÃ³n', 'Verificado', 'Cerrado')),
  owner text not null,
  due_date date not null,
  description text not null,
  recommendation text not null,
  approval_status public.approval_state not null default 'Pendiente',
  approval_notes text,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  updated_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.action_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 180),
  finding_title text not null,
  responsible text not null,
  due_date date not null,
  progress numeric(5,2) not null default 0 check (progress between 0 and 100),
  status text not null check (status in ('Pendiente', 'En progreso', 'Vencido', 'Completado')),
  comments text,
  approval_status public.approval_state not null default 'Pendiente',
  approval_notes text,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  updated_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  company text check (company is null or char_length(company) <= 150),
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.control_assessments (
  id uuid primary key default gen_random_uuid(),
  control_id uuid not null references public.controls(id) on delete cascade,
  assessment_month date not null,
  compliance numeric(5,2) not null check (compliance between 0 and 100),
  assessed_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  unique (control_id, assessment_month),
  check (assessment_month = date_trunc('month', assessment_month)::date)
);

create table if not exists public.risk_history (
  id uuid primary key default gen_random_uuid(),
  risk_id uuid not null references public.risks(id) on delete cascade,
  probability smallint not null check (probability between 1 and 5),
  impact smallint not null check (impact between 1 and 5),
  level text not null check (level in ('Bajo', 'Medio', 'Alto', 'Crítico')),
  changed_by uuid references public.profiles(id) on delete set null default auth.uid(),
  changed_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  entity_type text not null,
  entity_id uuid not null,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT')),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_name text,
  actor_role text,
  details text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audits_status on public.audits(status);
create index if not exists idx_risks_level on public.risks(level);
create index if not exists idx_incidents_severity on public.security_incidents(severity);
create index if not exists idx_findings_status on public.findings(status);
create index if not exists idx_action_plans_status on public.action_plans(status);
create index if not exists idx_control_assessments_month on public.control_assessments(assessment_month);
create index if not exists idx_risk_history_changed_at on public.risk_history(changed_at);
create index if not exists idx_audit_events_created_at on public.audit_events(created_at desc);

create or replace function public.current_user_role()
returns text language sql stable security definer set search_path = public
as $$ select role::text from public.profiles where id = auth.uid() $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1)), new.email, 'Consulta')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.calculate_risk_level()
returns trigger language plpgsql set search_path = public
as $$
declare score integer := new.probability * new.impact;
begin
  new.level := case when score <= 4 then 'Bajo' when score <= 9 then 'Medio' when score <= 16 then 'Alto' else 'Crítico' end;
  return new;
end;
$$;

drop trigger if exists risks_calculate_level on public.risks;
create trigger risks_calculate_level before insert or update of probability, impact on public.risks for each row execute function public.calculate_risk_level();

create or replace function public.maintain_record_metadata()
returns trigger language plpgsql set search_path = public
as $$
begin
  new.updated_at := now();
  if (to_jsonb(new) - array['approval_status','approval_notes','approved_by','approved_at','updated_at','updated_by'])
     is distinct from
     (to_jsonb(old) - array['approval_status','approval_notes','approved_by','approved_at','updated_at','updated_by']) then
    new.approval_status := 'Pendiente';
    new.approval_notes := null;
    new.approved_by := null;
    new.approved_at := null;
  end if;
  return new;
end;
$$;

do $$ declare table_name text; begin
  foreach table_name in array array['audits','risks','controls','security_incidents','findings','action_plans'] loop
    execute format('drop trigger if exists maintain_metadata on public.%I', table_name);
    execute format('create trigger maintain_metadata before update on public.%I for each row execute function public.maintain_record_metadata()', table_name);
  end loop;
end $$;

create or replace function public.capture_control_assessment()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.control_assessments(control_id, assessment_month, compliance, assessed_by)
  values (new.id, date_trunc('month', current_date)::date, new.compliance, coalesce(new.updated_by, new.created_by))
  on conflict (control_id, assessment_month) do update set compliance = excluded.compliance, assessed_by = excluded.assessed_by, created_at = now();
  return new;
end;
$$;

drop trigger if exists controls_history on public.controls;
create trigger controls_history after insert or update of compliance on public.controls for each row execute function public.capture_control_assessment();

create or replace function public.capture_risk_history()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.risk_history(risk_id, probability, impact, level, changed_by)
  values (new.id, new.probability, new.impact, new.level, coalesce(new.updated_by, new.created_by));
  return new;
end;
$$;

drop trigger if exists risks_history on public.risks;
create trigger risks_history after insert or update of probability, impact on public.risks for each row execute function public.capture_risk_history();

create or replace function public.capture_audit_event()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  event_action text := tg_op;
  record_id uuid;
  actor public.profiles%rowtype;
begin
  record_id := case when tg_op = 'DELETE' then old.id else new.id end;
  select * into actor from public.profiles where id = auth.uid();
  if tg_op = 'UPDATE' and new.approval_status is distinct from old.approval_status then
    event_action := case when new.approval_status = 'Aprobado' then 'APPROVE' when new.approval_status = 'Rechazado' then 'REJECT' else 'UPDATE' end;
  end if;
  insert into public.audit_events(entity_type, entity_id, action, actor_id, actor_name, actor_role, details, old_data, new_data)
  values (tg_table_name, record_id, event_action, auth.uid(), actor.full_name, actor.role::text,
    case when event_action in ('APPROVE','REJECT') then new.approval_notes else null end,
    case when tg_op = 'INSERT' then null else to_jsonb(old) end,
    case when tg_op = 'DELETE' then null else to_jsonb(new) end);
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

do $$ declare table_name text; begin
  foreach table_name in array array['audits','risks','controls','security_incidents','findings','action_plans'] loop
    execute format('drop trigger if exists audit_event_trigger on public.%I', table_name);
    execute format('create trigger audit_event_trigger after insert or update or delete on public.%I for each row execute function public.capture_audit_event()', table_name);
  end loop;
end $$;

create or replace function public.review_record(p_entity text, p_record_id uuid, p_decision public.approval_state, p_notes text default null)
returns jsonb language plpgsql security definer set search_path = public
as $$
declare result jsonb;
begin
  if public.current_user_role() not in ('Administrador', 'Supervisor') then raise exception 'No autorizado para aprobar registros'; end if;
  if p_decision = 'Rechazado' and char_length(trim(coalesce(p_notes, ''))) < 5 then raise exception 'El rechazo requiere una observación'; end if;
  case p_entity
    when 'audits' then update public.audits set approval_status=p_decision, approval_notes=p_notes, approved_by=auth.uid(), approved_at=now() where id=p_record_id returning to_jsonb(audits.*) into result;
    when 'risks' then update public.risks set approval_status=p_decision, approval_notes=p_notes, approved_by=auth.uid(), approved_at=now() where id=p_record_id returning to_jsonb(risks.*) into result;
    when 'controls' then update public.controls set approval_status=p_decision, approval_notes=p_notes, approved_by=auth.uid(), approved_at=now() where id=p_record_id returning to_jsonb(controls.*) into result;
    when 'security_incidents' then update public.security_incidents set approval_status=p_decision, approval_notes=p_notes, approved_by=auth.uid(), approved_at=now() where id=p_record_id returning to_jsonb(security_incidents.*) into result;
    when 'findings' then update public.findings set approval_status=p_decision, approval_notes=p_notes, approved_by=auth.uid(), approved_at=now() where id=p_record_id returning to_jsonb(findings.*) into result;
    when 'action_plans' then update public.action_plans set approval_status=p_decision, approval_notes=p_notes, approved_by=auth.uid(), approved_at=now() where id=p_record_id returning to_jsonb(action_plans.*) into result;
    else raise exception 'Entidad no permitida';
  end case;
  if result is null then raise exception 'Registro no encontrado'; end if;
  return result;
end;
$$;

create or replace function public.update_own_profile(p_full_name text)
returns public.profiles language plpgsql security definer set search_path = public
as $$
declare result public.profiles;
begin
  if char_length(trim(p_full_name)) not between 3 and 100 then raise exception 'Nombre inválido'; end if;
  update public.profiles set full_name=trim(p_full_name) where id=auth.uid() returning * into result;
  return result;
end;
$$;

create or replace function public.submit_contact(p_name text, p_email text, p_company text, p_message text)
returns jsonb language plpgsql security definer set search_path = public
as $$
begin
  if char_length(trim(p_name)) not between 2 and 100 or char_length(trim(p_message)) not between 10 and 2000 then raise exception 'Datos de contacto inválidos'; end if;
  insert into public.contacts(name,email,company,message) values (trim(p_name),lower(trim(p_email)),nullif(trim(p_company),''),trim(p_message));
  return jsonb_build_object('ok', true);
end;
$$;

alter table public.profiles enable row level security;
alter table public.audits enable row level security;
alter table public.risks enable row level security;
alter table public.controls enable row level security;
alter table public.security_incidents enable row level security;
alter table public.findings enable row level security;
alter table public.action_plans enable row level security;
alter table public.contacts enable row level security;
alter table public.control_assessments enable row level security;
alter table public.risk_history enable row level security;
alter table public.audit_events enable row level security;

drop policy if exists profiles_read_authenticated on public.profiles;
create policy profiles_read_authenticated on public.profiles for select to authenticated using (true);

do $$ declare table_name text; begin
  foreach table_name in array array['audits','risks','controls','security_incidents','findings','action_plans'] loop
    execute format('drop policy if exists %I on public.%I', table_name || '_read', table_name);
    execute format('create policy %I on public.%I for select to authenticated using (true)', table_name || '_read', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_insert', table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.current_user_role() in (''Administrador'',''Auditor''))', table_name || '_insert', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_update', table_name);
    execute format('create policy %I on public.%I for update to authenticated using (public.current_user_role() in (''Administrador'',''Auditor'')) with check (public.current_user_role() in (''Administrador'',''Auditor''))', table_name || '_update', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_delete', table_name);
    execute format('create policy %I on public.%I for delete to authenticated using (public.current_user_role() = ''Administrador'')', table_name || '_delete', table_name);
  end loop;
end $$;

drop policy if exists histories_read on public.control_assessments;
create policy histories_read on public.control_assessments for select to authenticated using (true);
drop policy if exists risk_history_read on public.risk_history;
create policy risk_history_read on public.risk_history for select to authenticated using (true);
drop policy if exists audit_events_privileged_read on public.audit_events;
create policy audit_events_privileged_read on public.audit_events for select to authenticated using (public.current_user_role() in ('Administrador','Supervisor'));
drop policy if exists contacts_admin_read on public.contacts;
create policy contacts_admin_read on public.contacts for select to authenticated using (public.current_user_role() = 'Administrador');
drop policy if exists contacts_admin_delete on public.contacts;
create policy contacts_admin_delete on public.contacts for delete to authenticated using (public.current_user_role() = 'Administrador');

revoke all on all tables in schema public from anon, authenticated;
grant select on public.profiles, public.audits, public.risks, public.controls, public.security_incidents, public.findings, public.action_plans, public.control_assessments, public.risk_history, public.audit_events to authenticated;
grant select, delete on public.contacts to authenticated;
grant insert on public.audits, public.risks, public.controls, public.security_incidents, public.findings, public.action_plans to authenticated;
grant update(title,description,owner,status,start_date,end_date,observations,updated_by) on public.audits to authenticated;
grant update(name,category,probability,impact,status,updated_by) on public.risks to authenticated;
grant update(name,process,responsible,compliance,observations,updated_by) on public.controls to authenticated;
grant update(incident_type,severity,description,incident_date,status,updated_by) on public.security_incidents to authenticated;
grant update(title,audit_title,severity,status,owner,due_date,description,recommendation,updated_by) on public.findings to authenticated;
grant update(title,finding_title,responsible,due_date,progress,status,comments,updated_by) on public.action_plans to authenticated;
grant delete on public.audits, public.risks, public.controls, public.security_incidents, public.findings, public.action_plans to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.review_record(text,uuid,public.approval_state,text) to authenticated;
grant execute on function public.update_own_profile(text) to authenticated;
grant execute on function public.submit_contact(text,text,text,text) to anon, authenticated;

revoke insert, update, delete on public.audit_events, public.control_assessments, public.risk_history from authenticated;
revoke all on public.contacts from anon;

comment on table public.audit_events is 'Bitácora inmutable, generada exclusivamente mediante triggers de servidor.';
comment on function public.submit_contact is 'Punto de entrada público validado; no concede lectura de contactos.';
