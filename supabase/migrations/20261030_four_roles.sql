-- Migra una instalación existente de cinco roles al modelo simplificado de cuatro.
-- Los usuarios con rol Consulta pasan a Responsable del Área, el rol de menor privilegio operativo.

begin;

alter table public.profiles alter column role drop default;
alter type public.app_role rename to app_role_with_consulta;
create type public.app_role as enum ('Administrador', 'Auditor', 'Supervisor', 'Responsable del Área');

alter table public.profiles
  alter column role type public.app_role
  using (
    case
      when role::text = 'Consulta' then 'Responsable del Área'
      else role::text
    end
  )::public.app_role;

alter table public.profiles alter column role set default 'Responsable del Área';
drop type public.app_role_with_consulta;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1)), new.email, 'Responsable del Área')
  on conflict (id) do nothing;
  return new;
end;
$$;

commit;
