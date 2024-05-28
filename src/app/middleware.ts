import { NextResponse } from 'next/server';
import { createClient } from '../../lib/supabase/server';

export async function middleware(req: Request) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // Redirect logged in users to the dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Allow the request to continue
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/your-specific-route'], // Adjust paths as needed
};
