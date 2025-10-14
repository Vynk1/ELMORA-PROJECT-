-- First, find your user ID by email
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Check what role values are valid (run this first to see options)
SELECT unnest(enum_range(NULL::role_type)) as valid_roles;

-- Insert profile with role - try 'user' first (most common)
INSERT INTO profiles (
    id, 
    user_id, 
    role,
    assessment_completed
) 
SELECT 
    id, 
    id,
    'user'::role_type,
    true
FROM auth.users 
WHERE email = 'your-email@example.com';

-- Alternative: If 'user' doesn't work, try 'member'
-- INSERT INTO profiles (
--     id, 
--     user_id, 
--     role,
--     assessment_completed
-- ) 
-- SELECT 
--     id, 
--     id,
--     'member'::role_type,
--     true
-- FROM auth.users 
-- WHERE email = 'your-email@example.com';

-- Verify the insert worked
SELECT id, user_id, role, assessment_completed, created_at 
FROM profiles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');