-- Replace 'your-email@example.com' with your actual email

-- Step 1: Find your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Step 2: Insert profile with a simple text role value
INSERT INTO profiles (
    id, 
    user_id, 
    role,
    assessment_completed
) 
SELECT 
    id, 
    id,
    'user',  -- Simple text value, not an enum
    true
FROM auth.users 
WHERE email = 'your-email@example.com';

-- Step 3: Verify the insert worked
SELECT id, user_id, role, assessment_completed, created_at 
FROM profiles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');