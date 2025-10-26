    -- =====================================================
    -- ELMORA Profile Table Fix & Migration (Updated)
    -- Handles existing first_name column with NOT NULL constraint
    -- Run this in your Supabase SQL Editor
    -- =====================================================

    -- 1. First, let's check what columns exist and fix constraints
    DO $$ 
    BEGIN
        -- Make first_name nullable if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name='profiles' AND column_name='first_name') THEN
            ALTER TABLE public.profiles ALTER COLUMN first_name DROP NOT NULL;
        END IF;

        -- Make last_name nullable if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name='profiles' AND column_name='last_name') THEN
            ALTER TABLE public.profiles ALTER COLUMN last_name DROP NOT NULL;
        END IF;

        -- Make email nullable if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name='profiles' AND column_name='email') THEN
            ALTER TABLE public.profiles ALTER COLUMN email DROP NOT NULL;
        END IF;

        -- Add display_name if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name='profiles' AND column_name='display_name') THEN
            ALTER TABLE public.profiles ADD COLUMN display_name text;
        END IF;

        -- Add bio if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name='profiles' AND column_name='bio') THEN
            ALTER TABLE public.profiles ADD COLUMN bio text;
        END IF;

        -- Add avatar_url if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name='profiles' AND column_name='avatar_url') THEN
            ALTER TABLE public.profiles ADD COLUMN avatar_url text;
        END IF;

        -- Add assessment_completed if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name='profiles' AND column_name='assessment_completed') THEN
            ALTER TABLE public.profiles ADD COLUMN assessment_completed boolean DEFAULT false;
        END IF;

        -- Add updated_at if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name='profiles' AND column_name='updated_at') THEN
            ALTER TABLE public.profiles ADD COLUMN updated_at timestamptz DEFAULT now();
        END IF;
    END $$;

    -- 2. Update existing rows to populate display_name from first_name/last_name or email
    UPDATE public.profiles 
    SET display_name = COALESCE(
        NULLIF(TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, ''))), ''),
        email,
        'User'
    )
    WHERE display_name IS NULL;

    -- 3. Populate first_name for existing rows that have display_name but no first_name
    UPDATE public.profiles 
    SET first_name = SPLIT_PART(display_name, ' ', 1)
    WHERE first_name IS NULL AND display_name IS NOT NULL;

    -- 4. Enable Row Level Security (RLS)
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- 5. Drop existing policies if they exist (to avoid conflicts)
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.profiles;
    DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
    DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;

    -- 6. Create RLS policies
    CREATE POLICY "Users can view their own profile" 
        ON public.profiles FOR SELECT 
        USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own profile" 
        ON public.profiles FOR INSERT 
        WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own profile" 
        ON public.profiles FOR UPDATE 
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);

    -- 7. Create function to automatically create profile on user signup
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $$
    DECLARE
        user_name text;
    BEGIN
        -- Extract name from metadata or use email
        user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'User');
        
        INSERT INTO public.profiles (
            user_id, 
            display_name, 
            first_name,
            email,
            created_at, 
            updated_at
        )
        VALUES (
            NEW.id,
            user_name,
            SPLIT_PART(user_name, ' ', 1),
            NEW.email,
            NOW(),
            NOW()
        )
        ON CONFLICT (user_id) DO NOTHING;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- 8. Drop existing trigger if it exists
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

    -- 9. Create trigger to call function on new user signup
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_new_user();

    -- 10. Create updated_at trigger function
    CREATE OR REPLACE FUNCTION public.handle_updated_at()
    RETURNS trigger AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- 11. Drop existing updated_at trigger if exists
    DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;

    -- 12. Create trigger to automatically update updated_at
    CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON public.profiles
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_updated_at();

    -- 13. Create profiles for existing users who don't have one
    INSERT INTO public.profiles (user_id, display_name, first_name, email, created_at, updated_at)
    SELECT 
        id,
        COALESCE(raw_user_meta_data->>'full_name', email, 'User') as display_name,
        SPLIT_PART(COALESCE(raw_user_meta_data->>'full_name', email, 'User'), ' ', 1) as first_name,
        email,
        created_at,
        NOW()
    FROM auth.users
    WHERE id NOT IN (SELECT user_id FROM public.profiles)
    ON CONFLICT (user_id) DO NOTHING;

    -- 14. Create index for faster lookups
    CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

    -- 15. Set default values for first_name in existing rows that are still null
    UPDATE public.profiles 
    SET first_name = 'User'
    WHERE first_name IS NULL;

    -- =====================================================
    -- Verification queries (optional - run separately)
    -- =====================================================

    -- Check if profiles table exists with all columns
    -- SELECT column_name, data_type, is_nullable
    -- FROM information_schema.columns
    -- WHERE table_name = 'profiles'
    -- ORDER BY ordinal_position;

    -- Check if your user has a profile
    -- SELECT * FROM public.profiles WHERE user_id = auth.uid();

    -- Count total profiles
    -- SELECT COUNT(*) as total_profiles FROM public.profiles;
