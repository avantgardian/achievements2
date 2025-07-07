'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  useEffect(() => {
    async function testSupabase() {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('Supabase connection error:', error);
      } else {
        console.log('Supabase connection successful! Users:', data);
      }
    }
    testSupabase();
  }, []);

  return <main>Welcome to your Steam Achievements Tracker!</main>;
}
