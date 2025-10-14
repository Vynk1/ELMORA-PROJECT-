-- Check what role values are valid
SELECT unnest(enum_range(NULL::role_type)) as valid_roles;

-- Alternative: Check the enum type definition
SELECT 
    t.typname AS enum_name, 
    e.enumlabel AS enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'role_type';